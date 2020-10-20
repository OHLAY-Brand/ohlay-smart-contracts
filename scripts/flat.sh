#!/usr/bin/env bash

npx truffle-flattener contracts/token/OhlayToken.sol > dist/OhlayToken.dist.sol
npx truffle-flattener contracts/crowdsale/OhlayCrowdsale.sol > dist/OhlayCrowdsale.dist.sol
npx truffle-flattener contracts/timelock/OhlayTimelock.sol > dist/OhlayTimelock.dist.sol
