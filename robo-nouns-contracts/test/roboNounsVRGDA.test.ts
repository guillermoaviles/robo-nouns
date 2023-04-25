import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect, assert } from "chai"
import { constants, BigNumber } from "ethers"
import { ethers } from "hardhat"

// eslint-disable-next-line node/no-missing-import
import type {
    RoboNounsVRGDA,
    RoboNounsVRGDA__factory,
    RoboNounsDescriptor,
    RoboNounsDescriptor__factory,
    RoboNounsToken,
    RoboNounsToken__factory,
    RoboNounsSeeder,
    RoboNounsSeeder__factory,
} from "../typechain-types"

describe("RoboNounsVRGDA", () => {
    let roboNounsVRGDA: RoboNounsVRGDA
    let roboNounsVRGDAFactory: RoboNounsVRGDA__factory

    let roboNounsSeeder: RoboNounsSeeder
    let roboNounsSeederFactory: RoboNounsSeeder__factory

    let roboNounsDescriptor: RoboNounsDescriptor
    let roboNounsDescriptorFactory: RoboNounsDescriptor__factory

    let roboNounsToken: RoboNounsToken
    let roboNounsTokenFactory: RoboNounsToken__factory

    let owner: SignerWithAddress
    let addresses: SignerWithAddress[]

    let targetPrice: string = "150000000000000000"
    let priceDecayPercent: string = "310000000000000000"
    let perTimeUnit: string = "24000000000000000000"
    let startTime: number = 1682392703

    // hooks
    before(async () => {
        ;[owner, ...addresses] = await ethers.getSigners()
        roboNounsVRGDAFactory = (await ethers.getContractFactory(
            "RoboNounsVRGDA"
        )) as RoboNounsVRGDA__factory
        roboNounsSeederFactory = (await ethers.getContractFactory(
            "RoboNounsSeeder"
        )) as RoboNounsSeeder__factory
        roboNounsDescriptorFactory = (await ethers.getContractFactory(
            "RoboNounsDescriptor"
        )) as RoboNounsDescriptor__factory
        roboNounsTokenFactory = (await ethers.getContractFactory(
            "RoboNounsToken"
        )) as RoboNounsToken__factory
    })

    beforeEach(async () => {
        roboNounsVRGDA = await roboNounsVRGDAFactory.deploy()
        roboNounsSeeder = await roboNounsSeederFactory.deploy()
        roboNounsDescriptor = await roboNounsDescriptorFactory.deploy()
        roboNounsToken = await roboNounsTokenFactory.deploy(
            roboNounsVRGDA.address,
            roboNounsDescriptor.address,
            roboNounsSeeder.address
        )
        roboNounsVRGDA.initialize(
            targetPrice,
            priceDecayPercent,
            perTimeUnit,
            startTime,
            roboNounsToken.address
        )
    })

    // fixtures
    // async function transferFixture() {
    //     return await fooToken.transfer(addresses[0].address, constants.Two)
    // }

    // tests
    it("the token name should be correct", async () => {
        // expect
        expect(await roboNounsVRGDA.targetPrice()).to.equal(targetPrice)
    })

    // it("the token symbol should be correct", async () => {
    //     // assert
    //     assert.equal(
    //         await fooToken.symbol(),
    //         "FOO",
    //         "The token symbol must be valid."
    //     )
    // })

    // it("the token decimal should be correct", async () => {
    //     expect(await fooToken.decimals()).to.equal(BigNumber.from(1))
    // })

    // it("the token supply should be correct", async () => {
    //     expect(await fooToken.totalSupply()).to.equal(10n ** 18n)
    // })

    // it("reverts when transferring tokens to the zero address", async () => {
    //     // Conditions that trigger a require statement can be precisely tested
    //     await expect(
    //         fooToken.transfer(constants.AddressZero, constants.One)
    //     ).to.be.revertedWith("ERC20: transfer to the zero address")
    // })

    // it("emits a Transfer event on successful transfers", async () => {
    //     const from: SignerWithAddress = owner
    //     const to: SignerWithAddress = addresses[0]
    //     const value: BigNumber = constants.One

    //     await expect(fooToken.transfer(to.address, value))
    //         .to.emit(fooToken, "Transfer")
    //         .withArgs(from.address, to.address, value)
    // })

    // it("token balance successfully changed", async () => {
    //     const from: SignerWithAddress = owner
    //     const to: SignerWithAddress = addresses[0]
    //     const value: BigNumber = constants.Two

    //     await expect(loadFixture(transferFixture)).to.changeTokenBalances(
    //         fooToken,
    //         [from, to],
    //         [-value, value]
    //     )
    // })
})
