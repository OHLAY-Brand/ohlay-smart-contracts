// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "../token/IERC20Burnable.sol";

contract OhlayCrowdsale is ReentrancyGuard, Context {
    using SafeMath for uint256;
    using SafeERC20 for IERC20Burnable;

    IERC20Burnable private _token;

    address payable private _wallet;
    uint256 private _rate;
    uint256 private _weiRaised;
    uint256 private _openingTime;
    uint256 private _closingTime;

    uint256 public constant MIN_CONTRIBUTION = 0.1 ether;

    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    constructor (
        uint256 rate,
        address payable wallet,
        IERC20Burnable token,
        uint256 openingTime,
        uint256 closingTime
    ) {
        require(rate > 0, "Crowdsale: rate is 0");
        require(wallet != address(0), "Crowdsale: wallet is the zero address");
        require(address(token) != address(0), "Crowdsale: token is the zero address");
        require(openingTime >= block.timestamp, "TimedCrowdsale: opening time is before current time"); // solhint-disable-line not-rely-on-time
        require(closingTime > openingTime, "TimedCrowdsale: opening time is not before closing time");

        _rate = rate;
        _wallet = wallet;
        _token = token;
        _openingTime = openingTime;
        _closingTime = closingTime;
    }

    receive() external payable {
        buyTokens(_msgSender());
    }

    function token() public view returns (IERC20Burnable) {
        return _token;
    }

    function wallet() public view returns (address payable) {
        return _wallet;
    }

    function rate() public view returns (uint256) {
        return _rate;
    }

    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    function openingTime() public view returns (uint256) {
        return _openingTime;
    }

    function closingTime() public view returns (uint256) {
        return _closingTime;
    }

    function isOpen() public view returns (bool) {
        // solhint-disable-next-line not-rely-on-time
        return block.timestamp >= _openingTime && block.timestamp <= _closingTime;
    }

    function hasClosed() public view returns (bool) {
        // solhint-disable-next-line not-rely-on-time
        return block.timestamp > _closingTime;
    }

    function buyTokens(address beneficiary) public nonReentrant payable {
        uint256 weiAmount = msg.value;

        _preValidatePurchase(beneficiary, weiAmount);

        uint256 tokens = _getTokenAmount(weiAmount);

        _weiRaised = _weiRaised.add(weiAmount);

        _processPurchase(beneficiary, tokens);

        emit TokensPurchased(_msgSender(), beneficiary, weiAmount, tokens);

        _forwardFunds();
    }

    function burnRemaining() public {
        require(hasClosed(), "OhlayCrowdsale: not closed");
        _token.burn(_token.balanceOf(address(this)));
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view virtual {
        require(beneficiary != address(0), "Crowdsale: beneficiary is the zero address");
        require(isOpen(), "TimedCrowdsale: not open");
        require(weiAmount >= MIN_CONTRIBUTION, "OhlayCrowdsale: minimum amount is 0.1 ether");

        this;
    }

    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal virtual {
        _token.safeTransfer(beneficiary, tokenAmount);
    }

    function _processPurchase(address beneficiary, uint256 tokenAmount) internal virtual {
        _deliverTokens(beneficiary, tokenAmount);
    }

    function _getTokenAmount(uint256 weiAmount) internal view virtual returns (uint256) {
        return weiAmount.mul(_rate);
    }

    function _forwardFunds() internal virtual {
        _wallet.transfer(msg.value);
    }
}
