const { BN, expectRevert, time } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeTokenTimelock } = require('./behaviours/TokenTimelock.behaviour');

const OhlayTimelock = artifacts.require('OhlayTimelock');
const ERC20Mock = artifacts.require('ERC20Mock');

contract('OhlayTimelock', function ([owner, beneficiary]) {
  const amount = new BN(100);

  beforeEach(async function () {
    this.token = await ERC20Mock.new('TEST', 'TEST', owner, amount);
  });

  context('creating a valid timelock', function () {
    it('rejects a release time in the past', async function () {
      const pastReleaseTime = (await time.latest()).sub(time.duration.years(1));
      await expectRevert(
        OhlayTimelock.new(this.token.address, beneficiary, pastReleaseTime),
        'TokenTimelock: release time is before current time',
      );
    });
  });

  context('as a Timelock', function () {
    beforeEach(async function () {
      this.releaseTime = (await time.latest()).add(time.duration.years(1));
      this.timelock = await OhlayTimelock.new(this.token.address, beneficiary, this.releaseTime);
      await this.token.transfer(this.timelock.address, amount, { from: owner });
    });

    shouldBehaveLikeTokenTimelock([beneficiary], amount);
  });
});
