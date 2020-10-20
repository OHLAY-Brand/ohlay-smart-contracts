const { expectRevert, time } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

function shouldBehaveLikeTimedCrowdsale ([owner, investor, wallet, purchaser], value) {
  describe('checking properties', function () {
    it('openingTime should be right set', async function () {
      expect(await this.crowdsale.openingTime()).to.be.bignumber.equal(this.openingTime);
    });

    it('closingTime should be right set', async function () {
      expect(await this.crowdsale.closingTime()).to.be.bignumber.equal(this.closingTime);
    });
  });

  describe('checking times', function () {
    describe('before opening time', function () {
      it('it is not open nor ended', async function () {
        (await this.crowdsale.isOpen()).should.equal(false);
        (await this.crowdsale.hasClosed()).should.equal(false);
      });
    });

    describe('after opening time', function () {
      it('it is open and not ended', async function () {
        await time.increaseTo(this.openingTime);
        (await this.crowdsale.isOpen()).should.equal(true);
        (await this.crowdsale.hasClosed()).should.equal(false);
      });
    });

    describe('after closing time', function () {
      it('it is not open and ended', async function () {
        await time.increaseTo(this.afterClosingTime);
        (await this.crowdsale.isOpen()).should.equal(false);
        (await this.crowdsale.hasClosed()).should.equal(true);
      });
    });
  });

  describe('accepting payments', function () {
    it('should reject payments before start', async function () {
      (await this.crowdsale.isOpen()).should.equal(false);
      await expectRevert.unspecified(this.crowdsale.send(value));
      await expectRevert.unspecified(this.crowdsale.buyTokens(investor, { from: purchaser, value: value }));
    });

    it('should accept payments after start', async function () {
      await time.increaseTo(this.openingTime);
      (await this.crowdsale.isOpen()).should.equal(true);
      await this.crowdsale.send(value);
      await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
    });

    it('should reject payments after end', async function () {
      await time.increaseTo(this.afterClosingTime);
      await expectRevert.unspecified(this.crowdsale.send(value));
      await expectRevert.unspecified(this.crowdsale.buyTokens(investor, { value: value, from: purchaser }));
    });
  });
}

module.exports = {
  shouldBehaveLikeTimedCrowdsale,
};
