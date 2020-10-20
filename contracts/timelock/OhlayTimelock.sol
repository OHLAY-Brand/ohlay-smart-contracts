// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/TokenTimelock.sol";

contract OhlayTimelock is TokenTimelock {

    constructor(
        IERC20 token,
        address beneficiary,
        uint256 releaseTime
    )
        TokenTimelock(token, beneficiary, releaseTime)
    {}
}
