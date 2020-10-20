// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

import "eth-token-recover/contracts/TokenRecover.sol";

contract OhlayToken is ERC20Burnable, TokenRecover {

    constructor() ERC20("OHLAY Brand", "OHLAY") {
        _mint(_msgSender(), 50000000e18);
    }
}
