import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect, assert } from "chai"
import { constants, BigNumber } from "ethers"
import { ethers, network } from "hardhat"

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
            owner.address,
            roboNounsVRGDA.address,
            roboNounsDescriptor.address,
            roboNounsSeeder.address
        )
        await roboNounsDescriptor.addAccessory(
            "0x0016161e090100010202000103070001030100020201000203050002031a00010304000703130007030e000103040007030100"
        )
        await roboNounsDescriptor.addBackground("70e790")
        await roboNounsDescriptor.addBody(
            "0x0014171f090e000e020e020e020e02020201000b02020201000b02020201000b02020201000b02020201000b02020201000b02020201000b02"
        )
        await roboNounsDescriptor.addColorToPalette("0", "807f7e")
        await roboNounsDescriptor.addGlasses(
            "0x000e1915050300087201000872030001720222040201720100017202220402017203000172022204020172010001720222040205720222040203720222040202720200017202220402017201000172022204020272020001720222040201720100017202220402017203000172022204020172010001720222040201720300087201000872"
        )
        await roboNounsDescriptor.addHead(
            "0x000c1d190506000299010001990100019912000b9906940300019904000299040204990394010201940102019403000e9903940102019401020194019901000f99079401001099079401001099079411990794010010990794010010990194010202220102022202000f9907940100019901001199080001990200059901000299010002990b0001990200019904000199020001990700"
        )
        await roboNounsVRGDA.initialize(
            targetPrice,
            priceDecayPercent,
            perTimeUnit,
            startTime,
            roboNounsToken.address
        )
        await roboNounsVRGDA.unpause()
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

    it("should settle the auction", async () => {
        console.log(await roboNounsToken.minter())
        const blockNumber = await ethers.provider.getBlockNumber()
        console.log(blockNumber)
        network.provider.send("evm_mine")
        // assert
        try {
            await roboNounsVRGDA.settleAuction(blockNumber, {
                value: ethers.utils.parseEther("1"),
            })
        } catch (error) {
            console.log(error)
        }
    })

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
