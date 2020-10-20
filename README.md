# Ohlay Smart Contracts

[![Build Status](https://travis-ci.com/OHLAY-Brand/ohlay-smart-contracts.svg?branch=main)](https://travis-ci.com/OHLAY-Brand/ohlay-smart-contracts)
[![Coverage Status](https://coveralls.io/repos/github/OHLAY-Brand/ohlay-smart-contracts/badge.svg?branch=main)](https://coveralls.io/github/OHLAY-Brand/ohlay-smart-contracts?branch=main)
[![MIT licensed](https://img.shields.io/github/license/OHLAY-Brand/ohlay-smart-contracts.svg)](https://github.com/OHLAY-Brand/ohlay-smart-contracts/blob/master/LICENSE)

Smart Contracts for Ohlay Token and Crowdsale

* OHLAY Brand: [0x08caE08246E9e47ab20db3D87375094B1Ef3A533](https://etherscan.io/token/0x08cae08246e9e47ab20db3d87375094b1ef3a533)

* OHLAY Crowdsale: [0x764973a1DbB8a7Fe82Aa42DB606c8ea86b0BC48c](https://etherscan.io/address/0x764973a1dbb8a7fe82aa42db606c8ea86b0bc48c)

* Marketing Timelock: [0x92dc67f2C84063Df4D24f622078C4aB88BaD9Dc5](https://etherscan.io/address/0x92dc67f2c84063df4d24f622078c4ab88bad9dc5)
* Team Timelock: [0xDD75A0b4006f8e4Ce8B51b926d3875F7572D70bb](https://etherscan.io/address/0xdd75a0b4006f8e4ce8b51b926d3875f7572d70bb)


## Development


### Install dependencies

```bash
npm install
```


### Usage (using Truffle)

Open the Truffle console

```bash
npm run console
```


#### Compile

```bash
npm run compile
```


#### Test

```bash
npm run test
```


### Usage (using Buidler)

Open the Buidler console

```bash
npm run buidler:console
```


#### Compile

```bash
npm run buidler:compile
```


#### Test

```bash
npm run buidler:test
```


### Code Coverage

```bash
npm run coverage
```


## Linter

Use Solhint

```bash
npm run lint:sol
```

Use ESLint

```bash
npm run lint:js
```

Use ESLint and fix

```bash
npm run lint:fix
```


## Flattener

This allow to flatten the code into a single file

Edit `scripts/flat.sh` to add your contracts

```bash
npm run flat
```


## Analysis

Note: it is better to analyze the flattened code to have a bigger overview on the entire codebase. So run the flattener first.

### Describe

The `describe` command shows a summary of the contracts and methods in the files provided

```bash
npx surya describe dist/{contract-name}.dist.sol
```

### Dependencies

The `dependencies` command outputs the c3-linearization of a given contract's inheirtance graph. Contracts will be listed starting with most-derived, ie. if the same function is defined in more than one contract, the solidity compiler will use the definition in whichever contract is listed first.

```bash
npx surya dependencies {contract-name} dist/{contract-name}.dist.sol
```
### Generate Report

Edit `scripts/analyze.sh` to add your contracts

```bash
npm run analyze
```

The `inheritance` command outputs a DOT-formatted graph of the inheritance tree.

The `graph` command outputs a DOT-formatted graph of the control flow.

The `mdreport` command creates a markdown description report with tables comprising information about the system's files, contracts and their functions.

The `sol2uml` generates UML class diagram from Solidity contracts.


## License

Code released under the [MIT License](https://github.com/OHLAY-Brand/ohlay-smart-contracts/blob/master/LICENSE).
