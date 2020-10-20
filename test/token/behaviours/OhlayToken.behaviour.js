const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');

const { shouldBehaveLikeERC20 } = require('./ERC20.behaviour');
const { shouldBehaveLikeERC20Burnable } = require('./ERC20Burnable.behaviour');

function shouldBehaveLikeOhlayToken (
  [owner, anotherAccount, recipient, thirdParty],
  [_name, _symbol, _decimals, _initialSupply],
) {
  context('OhlayToken behaviours', function () {
    context('like a ERC20', function () {
      shouldBehaveLikeERC20(_name, _symbol, _decimals, [owner, anotherAccount, recipient], _initialSupply);
    });

    context('like a ERC20Burnable', function () {
      shouldBehaveLikeERC20Burnable(owner, _initialSupply, [owner]);
    });

    context('like a TokenRecover', function () {
      beforeEach(async function () {
        this.instance = this.token;
      });

      shouldBehaveLikeTokenRecover([owner, thirdParty]);
    });
  });
}

module.exports = {
  shouldBehaveLikeOhlayToken,
};
