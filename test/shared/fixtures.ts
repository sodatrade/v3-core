import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeSodaTradeV3Pool } from '../../typechain/MockTimeSodaTradeV3Pool'
import { TestERC20 } from '../../typechain/TestERC20'
import { SodaTradeV3Factory } from '../../typechain/SodaTradeV3Factory'
import { TestSodaTradeV3Callee } from '../../typechain/TestSodaTradeV3Callee'
import { TestSodaTradeV3Router } from '../../typechain/TestSodaTradeV3Router'
import { MockTimeSodaTradeV3PoolDeployer } from '../../typechain/MockTimeSodaTradeV3PoolDeployer'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: SodaTradeV3Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory('SodaTradeV3Factory')
  const factory = (await factoryFactory.deploy()) as SodaTradeV3Factory
  return { factory }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestSodaTradeV3Callee
  swapTargetRouter: TestSodaTradeV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeSodaTradeV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeSodaTradeV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeSodaTradeV3PoolDeployer')
  const MockTimeSodaTradeV3PoolFactory = await ethers.getContractFactory('MockTimeSodaTradeV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestSodaTradeV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestSodaTradeV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestSodaTradeV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestSodaTradeV3Router

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer = (await MockTimeSodaTradeV3PoolDeployerFactory.deploy()) as MockTimeSodaTradeV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string
      return MockTimeSodaTradeV3PoolFactory.attach(poolAddress) as MockTimeSodaTradeV3Pool
    },
  }
}
