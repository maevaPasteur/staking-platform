// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20 Token Contract
 * @notice This contract implements a basic ERC20 token with a fixed initial supply.
 * @dev The token is minted entirely to the contract creator upon deployment.
 */
contract Token is ERC20 {
    /**
     * @notice Constructor that initializes the ERC20 token with a name and symbol, and mints the initial supply.
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @dev The initial supply is set to 1,000,000 tokens with decimals taken into account (e.g., 1,000,000 * 10 ** decimals).
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10 ** uint(decimals()));
    }
}
