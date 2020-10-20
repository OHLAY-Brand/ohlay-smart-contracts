const { expectRevert, time } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

function shouldBehaveLikeTokenTimelock ([beneficiary], amount) {
  context('once deployed', function () {
    it('can get state', async function () {
      expect(await this.timelock.token()).to.equal(this.token.address);
      expect(await this.timelock.beneficiary()).to.equal(beneficiary);
      expect(await this.timelock.releaseTime()).to.be.bignumber.equal(this.releaseTime);
    });

    it('cannot be released before time limit', async function () {
      await expectRevert(this.timelock.release(), 'TokenTimelock: current time is before release time');
    });

    it('cannot be released just before time limit', async function () {
      await time.increaseTo(this.releaseTime.sub(time.duration.seconds(3)));
      await expectRevert(this.timelock.release(), 'TokenTimelock: current time is before release time');
    });

    it('can be released just after limit', async function () {
      await time.increaseTo(this.releaseTime.add(time.duration.seconds(1)));
      await this.timelock.release();
      expect(await this.token.balanceOf(beneficiary)).to.be.bignumber.equal(amount);
    });

    it('can be released after time limit', async function () {
      await time.increaseTo(this.releaseTime.add(time.duration.years(1)));
      await this.timelock.release();
      expect(await this.token.balanceOf(beneficiary)).to.be.bignumber.equal(amount);
    });

    it('cannot be released twice', async function () {
      await time.increaseTo(this.releaseTime.add(time.duration.years(1)));
      await this.timelock.release();
      await expectRevert(this.timelock.release(), 'TokenTimelock: no tokens to release');
      expect(await this.token.balanceOf(beneficiary)).to.be.bignumber.equal(amount);
    });
  });
}

module.exports = {
  shouldBehaveLikeTokenTimelock,
};
