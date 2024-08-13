// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

contract Staking {
    address public owner;
    IERC20 public stakingToken;

    mapping(address => uint256) public balances;

    constructor(Token _stakingToken) {
        stakingToken = _stakingToken;
        owner = msg.sender;
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] += _amount;
    }

    function getUserBalance(address _userAddress) external view returns (uint256) {
        return balances[_userAddress];
    }
}
