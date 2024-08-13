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
    /// @notice The address of the owner of the contract
    address public owner;

    /// @notice The ERC20 token used for staking
    IERC20 public stakingToken;

    /// @notice The Annual Percentage Yields used to calculate rewards
    uint256 public apy = 1;

    /// @notice Mapping to store the balances of staked tokens for each user
    mapping(address => uint256) public balances;

    // Custom errors
    error OnlyOwner();
    error AmountMustBeGreaterThanZero();
    error InsufficientBalance(uint256 requested, uint256 available);

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
        balances[msg.sender] += _amount;
    }

    /**
     * @notice Get the staked balance of a specific user.
     * @param _userAddress The address of the user whose balance you want to query.
     * @return The amount of tokens staked by the user.
     */
    function getUserBalance(
        address _userAddress
    ) external view returns (uint256) {
        return balances[_userAddress];
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
        if (_amount > balances[msg.sender]) {
            revert InsufficientBalance(_amount, balances[msg.sender]);
        }
        balances[msg.sender] -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }
}
