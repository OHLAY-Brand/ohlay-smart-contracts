const { balance, BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

function shouldBehaveLikeCrowdsale (
  [owner, investor, wallet, purchaser, thirdParty],
  { rate, value },
) {
  const expectedTokenAmount = rate.mul(value);

  describe('checking properties', function () {
    it('rate should be right set', async function () {
      expect(await this.crowdsale.rate()).to.be.bignumber.equal(rate);
    });

    it('token should be right set', async function () {
      expect(await this.crowdsale.token()).to.be.equal(this.token.address);
    });

    it('wallet should be right set', async function () {
      expect(await this.crowdsale.wallet()).to.be.equal(wallet);
    });

    it('weiRaised should be zero', async function () {
      expect(await this.crowdsale.weiRaised()).to.be.bignumber.equal(new BN(0));
    });
  });

  describe('accepting payments', function () {
    describe('bare payments', function () {
      it('should accept payments', async function () {
        await this.crowdsale.send(value, { from: purchaser });
      });

      it('reverts on zero-valued payments', async function () {
        await expectRevert(
          this.crowdsale.send(0, { from: purchaser }),
          'Crowdsale: minimum amount is 0.1 ether',
        );
      });
    });

    describe('buyTokens', function () {
      it('should accept payments', async function () {
        await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
      });

      it('reverts on zero-valued payments', async function () {
        await expectRevert(
          this.crowdsale.buyTokens(investor, { value: 0, from: purchaser }),
          'Crowdsale: minimum amount is 0.1 ether',
        );
      });

      it('requires a non-null beneficiary', async function () {
        await expectRevert(
          this.crowdsale.buyTokens(ZERO_ADDRESS, { value: value, from: purchaser }),
          'Crowdsale: beneficiary is the zero address',
        );
      });
    });
  });

  describe('high-level purchase', function () {
    it('should log purchase', async function () {
      const { logs } = await this.crowdsale.sendTransaction({ value: value, from: investor });
      expectEvent.inLogs(logs, 'TokensPurchased', {
        purchaser: investor,
        beneficiary: investor,
        value: value,
        amount: expectedTokenAmount,
      });
    });

    it('should assign tokens to sender', async function () {
      await this.crowdsale.sendTransaction({ value: value, from: investor });
      expect(await this.token.balanceOf(investor)).to.be.bignumber.equal(expectedTokenAmount);
    });

    it('should forward funds to wallet', async function () {
      const balanceTracker = await balance.tracker(wallet);
      await this.crowdsale.sendTransaction({ value, from: investor });
      expect(await balanceTracker.delta()).to.be.bignumber.equal(value);
    });

    it('should increase weiRaised', async function () {
      await this.crowdsale.sendTransaction({ value, from: investor });
      expect(await this.crowdsale.weiRaised()).to.be.bignumber.equal(value);
    });
  });

  describe('low-level purchase', function () {
    it('should log purchase', async function () {
      const { logs } = await this.crowdsale.buyTokens(investor, { value, from: purchaser });
      expectEvent.inLogs(logs, 'TokensPurchased', {
        purchaser: purchaser,
        beneficiary: investor,
        value: value,
        amount: expectedTokenAmount,
      });
    });

    it('should assign tokens to beneficiary', async function () {
      await this.crowdsale.buyTokens(investor, { value, from: purchaser });
      expect(await this.token.balanceOf(investor)).to.be.bignumber.equal(expectedTokenAmount);
    });

    it('should forward funds to wallet', async function () {
      const balanceTracker = await balance.tracker(wallet);
      await this.crowdsale.buyTokens(investor, { value, from: purchaser });
      expect(await balanceTracker.delta()).to.be.bignumber.equal(value);
    });

    it('should increase weiRaised', async function () {
      await this.crowdsale.buyTokens(investor, { value, from: purchaser });
      expect(await this.crowdsale.weiRaised()).to.be.bignumber.equal(value);
    });
  });
}

module.exports = {
  shouldBehaveLikeCrowdsale,
};
