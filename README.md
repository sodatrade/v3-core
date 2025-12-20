# SodaTrade V3 Core

Core smart contracts for the SodaTrade V3 protocol.

## Overview

SodaTrade V3 is a concentrated liquidity AMM protocol deployed on XLayer, enabling more capital-efficient liquidity provision.

## Contracts

- `SodaTradeV3Factory` - Factory contract for creating V3 pools
- `SodaTradeV3Pool` - Pool contract implementing concentrated liquidity AMM
- `SodaTradeV3PoolDeployer` - Deployer contract for pool creation

## Deployed Addresses (XLayer Mainnet)

- **SodaTradeV3Factory**: `0xb76c7aBD3eB4B07eC14c5D7F9B265E8D37432e11`

## Local Development

### Prerequisites

- Node.js >= 10
- Yarn

### Install Dependencies

```bash
yarn
```

### Compile Contracts

```bash
yarn compile
```

### Run Tests

```bash
yarn test
```

### Deploy

```bash
yarn deploy:xlayer
```

## Licensing

The primary license for SodaTrade V3 Core is the Business Source License 1.1 (`BUSL-1.1`), see [`LICENSE`](./LICENSE). However, some files are dual licensed under `GPL-2.0-or-later`:

- All files in `contracts/interfaces/` may also be licensed under `GPL-2.0-or-later` (as indicated in their SPDX headers)
- Several files in `contracts/libraries/` may also be licensed under `GPL-2.0-or-later` (as indicated in their SPDX headers)

### Other Exceptions

- `contracts/libraries/FullMath.sol` is licensed under `MIT` (as indicated in its SPDX header)
- All files in `contracts/test` remain unlicensed (as indicated in their SPDX headers)
