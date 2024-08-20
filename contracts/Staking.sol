// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Token } from "./Token.sol";

/**
 * @title Staking Contract
 * @notice This contract allows users to stake ERC20 tokens and keeps track of each user's balance.
 * @dev This contract interacts with an ERC20 token contract for staking.
 */
contract Staking {
    /**
     * @dev Represents a user in the staking contract.
     * @notice This structure holds information about a user's staked balance, the last time they withdrew funds, and the rewards they have accumulated.
     */
    struct User {
        /// @dev The amount of tokens currently staked by the user.
        uint256 balance;
        /// @dev The timestamp of the last withdrawal made by the user.
        uint256 lastWithdrawalDate;
        /// @dev The total rewards accumulated by the user that have not yet been claimed or added to their staked balance.
        uint256 rewards;
    }

    /// @notice The address of the owner of the contract
    address public owner;

    /// @notice The ERC20 token used for staking
    IERC20 public stakingToken;

    /// @notice The Annual Percentage Yields used to calculate rewards
    uint256 public apy = 1;

    /// @notice Array of user with their balance, last withdrawal date & rewards earned
    mapping(address => User[]) public users;

    /// @notice Total of staked token balance
    uint256 public totalStakedBalance;

    // Custom errors
    error OnlyOwner();
    error AmountMustBeGreaterThanZero();
    error InsufficientBalance(uint256 requested, uint256 available);
    error UserDoesntExist();

    /**
     * @notice Constructor to initialize the staking contract
     * @dev The staking token contract must adhere to the IERC20 interface.
     * @param _stakingToken The address of the ERC20 token to be used for staking.
     */
    constructor(Token _stakingToken) public {
        stakingToken = _stakingToken;
        owner = msg.sender;
    }

    /**
     * @dev Modifier to make a function callable only by the owner.
     * @notice Restricts the usage of the function to the owner of the contract.
     * @dev Reverts with an error message if the caller is not the owner.
     */
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }
        _;
    }

    /**
     * @notice Stake a certain amount of ERC20 tokens.
     * @dev The function transfers tokens from the user's account to the contract.
     * @param _amount The amount of tokens to stake.
     */
    function stake(uint256 _amount) external {
        if (_amount <= 0) {
            revert AmountMustBeGreaterThanZero();
        }
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        User[] storage userRecords = users[msg.sender];
        if (userRecords.length == 0) {
            // Create user if he doesn't exist
            userRecords.push(
                User({
                    balance: _amount,
                    lastWithdrawalDate: block.timestamp,
                    rewards: 0
                })
            );
        } else {
            // Update current user balance
            User storage currentUser = userRecords[0];
            currentUser.balance += _amount;
            currentUser.lastWithdrawalDate = block.timestamp;
        }
        totalStakedBalance += _amount;
    }

    /**
     * @notice Get the staked balance of a specific user.
     * @param _userAddress The address of the user whose balance you want to query.
     * @return The amount of tokens staked by the user.
     */
    function getUserBalance(
        address _userAddress
    ) external view returns (uint256) {
        User[] storage userRecords = users[_userAddress];
        if (userRecords.length == 0) {
            return 0;
        }
        return userRecords[0].balance;
    }

    /**
     * @notice Get the rewards of a specific user.
     * @param _userAddress The address of the user whose balance you want to query.
     * @return The amount of tokens rewards by the user.
     */
    function getUserRewards(
        address _userAddress
    ) external view returns (uint256) {
        User[] storage userRecords = users[_userAddress];
        if (userRecords.length == 0) {
            return 0;
        }
        return userRecords[0].rewards;
    }

    /**
     * @notice Set the Annual Percentage Yield (APY) value.
     * @dev The APY is used to calculate rewards.
     * @param _apy The Annual Percentage Yield used to calculate rewards.
     */
    function setApy(uint256 _apy) public onlyOwner {
        apy = _apy;
    }

    /**
     * @notice Allows users to withdraw staked tokens from the staking contract.
     * @dev This function checks that the user has a sufficient staked balance before allowing the withdrawal.
     *      It also updates the user's internal balance before transferring the tokens back to the user's address.
     * @param _amount The amount of tokens to withdraw from the staking contract.
     */
    function withdrawing(uint256 _amount) public {
        if (_amount <= 0) {
            revert AmountMustBeGreaterThanZero();
        }
        User[] storage userRecords = users[msg.sender];
        if (userRecords.length == 0) {
            revert UserDoesntExist();
        }
        User storage currentUser = userRecords[0];
        if (_amount > currentUser.balance) {
            revert InsufficientBalance(_amount, currentUser.balance);
        }

        // Transfer token
        stakingToken.transfer(msg.sender, _amount);

        // Update user infos
        currentUser.balance -= _amount;

        // Update total staked
        totalStakedBalance -= _amount;

        // Calculate user rewards
        uint256 elapsedTime = block.timestamp - currentUser.lastWithdrawalDate;
        uint256 rewards = (currentUser.balance * apy * elapsedTime) /
            (365 days * 100);
        currentUser.rewards += rewards;

        // Update user last withdrawing date
        currentUser.lastWithdrawalDate = block.timestamp;
    }

    function claimingRewards() public {
        User[] storage userRecords = users[msg.sender];
        if (userRecords.length == 0) {
            revert UserDoesntExist();
        }

        // Get user
        User storage currentUser = userRecords[0];

        // Calculate rewards
        uint256 elapsedTime = block.timestamp - currentUser.lastWithdrawalDate;
        uint256 rewards = (currentUser.balance * apy * elapsedTime) /
            (365 days * 100);
        currentUser.rewards += rewards;

        // Update last withdrawing date
        currentUser.lastWithdrawalDate = block.timestamp;

        // Add rewards to user balance
        currentUser.balance += currentUser.rewards;

        // Init user rewards
        currentUser.rewards = 0;
    }
}
