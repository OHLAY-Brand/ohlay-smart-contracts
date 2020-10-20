const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeOhlayToken } = require('./behaviours/OhlayToken.behaviour');

const OhlayToken = artifacts.require('OhlayToken');

contract('OhlayToken', function ([owner, anotherAccount, recipient, thirdParty]) {
  const _name = 'OHLAY Brand';
  const _symbol = 'OHLAY';
  const _decimals = new BN(18);
  const _initialSupply = web3.utils.toWei(new BN(50000000), 'ether'); // 50 million tokens

  context('once deployed', function () {
    beforeEach(async function () {
      this.token = await OhlayToken.new({ from: owner });
    });

    it('owner balance should be equal to total supply', async function () {
      (await this.token.balanceOf(owner)).should.be.bignumber.equal(_initialSupply);
    });

    shouldBehaveLikeOhlayToken(
      [owner, anotherAccount, recipient, thirdParty],
      [_name, _symbol, _decimals, _initialSupply],
    );
  });
});
