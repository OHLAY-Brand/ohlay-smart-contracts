const { BN, expectRevert, time } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const { shouldBehaveLikeCrowdsale } = require('./Crowdsale.behaviour');
const { shouldBehaveLikeTimedCrowdsale } = require('./TimedCrowdsale.behaviour');

function shouldBehaveLikeOhlayCrowdsale (
  [owner, investor, wallet, purchaser, thirdParty],
  { rate, value },
) {
  context('OhlayCrowdsale behaviours', function () {
    context('like a Crowdsale', async function () {
      beforeEach(async function () {
        await time.increaseTo(this.openingTime);
      });

      shouldBehaveLikeCrowdsale(
        [owner, investor, wallet, purchaser, thirdParty],
        { rate, value },
      );
    });

    context('like a TimedCrowdsale', async function () {
      shouldBehaveLikeTimedCrowdsale(
        [owner, investor, wallet, purchaser, thirdParty],
        value,
      );
    });

    context('like a OhlayCrowdsale', function () {
      beforeEach(async function () {
        await time.increaseTo(this.openingTime);
      });

      describe('accepting payments', function () {
        describe('bare payments', function () {
          it('requires a minimum amount', async function () {
            await expectRevert(
              this.crowdsale.send(value.subn(1), { from: purchaser }),
              'OhlayCrowdsale: minimum amount is 0.1 ether',
            );
          });
        });

        describe('buyTokens', function () {
          it('requires a minimum amount', async function () {
            await expectRevert(
              this.crowdsale.buyTokens(investor, { value: value.subn(1), from: purchaser }),
              'OhlayCrowdsale: minimum amount is 0.1 ether',
            );
          });
        });
      });

      describe('burn remaining tokens', function () {
        context('before crowdsale end', function () {
          it('should fail', async function () {
            await expectRevert(
              this.crowdsale.burnRemaining({ from: thirdParty }),
              'OhlayCrowdsale: not closed',
            );
          });
        });

        context('after crowdsale end', function () {
          describe('if anyone is calling', function () {
            beforeEach(async function () {
              await time.increaseTo(this.afterClosingTime);
            });

            it('burns all the remaining tokens', async function () {
              await this.crowdsale.burnRemaining({ from: thirdParty });
              expect(await this.token.balanceOf(this.crowdsale.address)).to.be.bignumber.equal(new BN(0));
            });
          });
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeOhlayCrowdsale,
};
