const { BN, constants, ether, expectRevert, time } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeOhlayCrowdsale } = require('./behaviours/OhlayCrowdsale.behaviour');

const OhlayCrowdsale = artifacts.require('OhlayCrowdsale');
const ERC20Mock = artifacts.require('ERC20Mock');

contract('OhlayCrowdsale', function ([owner, investor, wallet, purchaser, thirdParty]) {
  const value = ether('0.1');
  const rate = new BN(80000);
  const tokenSupply = web3.utils.toWei(new BN(20000000), 'ether'); // 20 million tokens

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock();
  });

  beforeEach(async function () {
    this.openingTime = (await time.latest()).add(time.duration.weeks(1));
    this.closingTime = this.openingTime.add(time.duration.weeks(1));
    this.afterClosingTime = this.closingTime.add(time.duration.seconds(1));
  });

  describe('creating a valid OhlayCrowdsale', function () {
    it('requires a non-null token', async function () {
      await expectRevert(
        OhlayCrowdsale.new(rate, wallet, ZERO_ADDRESS, this.openingTime, this.closingTime),
        'Crowdsale: token is the zero address',
      );
    });

    context('with token', async function () {
      beforeEach(async function () {
        this.token = await ERC20Mock.new('TEST', 'TEST', owner, tokenSupply);
      });

      it('requires a non-zero rate', async function () {
        await expectRevert(
          OhlayCrowdsale.new(0, wallet, this.token.address, this.openingTime, this.closingTime),
          'Crowdsale: rate is 0',
        );
      });

      it('requires a non-null wallet', async function () {
        await expectRevert(
          OhlayCrowdsale.new(rate, ZERO_ADDRESS, this.token.address, this.openingTime, this.closingTime),
          'Crowdsale: wallet is the zero address',
        );
      });

      it('requires opening time is in the future', async function () {
        await expectRevert(
          OhlayCrowdsale.new(
            rate,
            wallet,
            this.token.address,
            (await time.latest()).sub(time.duration.seconds(1)),
            this.closingTime,
          ),
          'TimedCrowdsale: opening time is before current time',
        );
      });

      it('requires opening time is before closing time', async function () {
        await expectRevert(
          OhlayCrowdsale.new(
            rate,
            wallet,
            this.token.address,
            this.closingTime,
            this.openingTime,
          ),
          'TimedCrowdsale: opening time is not before closing time',
        );
      });

      context('once deployed', async function () {
        beforeEach(async function () {
          this.crowdsale = await OhlayCrowdsale.new(
            rate,
            wallet,
            this.token.address,
            this.openingTime,
            this.closingTime,
          );

          await this.token.transfer(this.crowdsale.address, tokenSupply);
        });

        shouldBehaveLikeOhlayCrowdsale(
          [owner, investor, wallet, purchaser, thirdParty],
          { rate, value },
        );
      });
    });
  });
});
