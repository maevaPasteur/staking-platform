// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

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

    /// @notice Mapping to store the balances of staked tokens for each user
    mapping(address => uint256) public balances;

    /**
     * @notice Constructor to initialize the staking contract
     * @param _stakingToken The address of the ERC20 token to be used for staking
     * @dev The staking token contract must adhere to the IERC20 interface
     */
    constructor(Token _stakingToken) {
        stakingToken = _stakingToken;
        owner = msg.sender;
    }

    /**
     * @notice Stake a certain amount of ERC20 tokens
     * @param _amount The amount of tokens to stake
     * @dev The function transfers tokens from the user's account to the contract
     * @dev Emits a transfer event from the token contract
     */
    function stake(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] += _amount;
    }

    /**
     * @notice Get the staked balance of a specific user
     * @param _userAddress The address of the user whose balance you want to query
     * @return The amount of tokens staked by the user
     */
    function getUserBalance(address _userAddress) external view returns (uint256) {
        return balances[_userAddress];
    }
}
