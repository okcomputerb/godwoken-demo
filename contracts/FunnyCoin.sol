// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract FunnyCoin is ERC20, ERC20Burnable {
    constructor(uint256 initalSupply) ERC20("Funny", "FUN") {
        _mint(msg.sender, initalSupply);
    }
}