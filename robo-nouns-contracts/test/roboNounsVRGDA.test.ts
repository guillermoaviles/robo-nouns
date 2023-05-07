import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect, assert } from "chai"
import { constants, BigNumber } from "ethers"
import { ethers, network } from "hardhat"
import * as nounsData from "../assets/image-data.json"
import * as testData from "../assets/big-noun-image-data.json"

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
    // INounsDescriptor,
} from "../typechain-types"

describe("RoboNounsVRGDA", () => {
    function chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const result: T[][] = []
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize))
        }
        return result
    }

    let roboNounsVRGDA: RoboNounsVRGDA
    let roboNounsVRGDAFactory: RoboNounsVRGDA__factory

    let roboNounsSeeder: RoboNounsSeeder
    let roboNounsSeederFactory: RoboNounsSeeder__factory

    // let nounsDescriptor: INounsDescriptor
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
        // let nounsDescriptor = await ethers.getContractAt(
        //     "INounsDescriptor",
        //     "0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63"
        // )

        roboNounsVRGDA = await roboNounsVRGDAFactory.deploy()
        roboNounsSeeder = await roboNounsSeederFactory.deploy()
        roboNounsDescriptor = await roboNounsDescriptorFactory
            .deploy
            // nounsDescriptor.address
            ()
        roboNounsToken = await roboNounsTokenFactory.deploy(
            owner.address,
            roboNounsVRGDA.address,
            roboNounsDescriptor.address,
            // nounsDescriptor.address,
            roboNounsSeeder.address
        )
        const chunkSize = 10

        const accessoriesChunks = chunkArray(
            testData.images.accessories.map((item) => item.data),
            chunkSize
        )
        for (const chunk of accessoriesChunks) {
            await roboNounsDescriptor.addManyAccessories(chunk)
        }

        await roboNounsDescriptor.addManyBackgrounds(testData.bgcolors)

        const bodiesChunks = chunkArray(
            testData.images.bodies.map((item) => item.data),
            chunkSize
        )
        for (const chunk of bodiesChunks) {
            await roboNounsDescriptor.addManyBodies(chunk)
        }

        await roboNounsDescriptor.addManyColorsToPalette("0", testData.palette)

        const glassesChunks = chunkArray(
            testData.images.glasses.map((item) => item.data),
            chunkSize
        )
        for (const chunk of glassesChunks) {
            await roboNounsDescriptor.addManyGlasses(chunk)
        }

        const headsChunks = chunkArray(
            testData.images.heads.map((item) => item.data),
            chunkSize
        )
        for (const chunk of headsChunks) {
            await roboNounsDescriptor.addManyHeads(chunk)
        }
        await roboNounsVRGDA.initialize(
            targetPrice,
            priceDecayPercent,
            perTimeUnit,
            startTime,
            roboNounsToken.address
        )
    })

    beforeEach(async () => {})

    // fixtures
    async function settleAuctionFixture() {
        // return await roboNounsVRGDA.settleAuction(blockNumber, {
        //     value: ethers.utils.parseEther("1"),
        // })
    }

    // tests
    it("initialized data should be correct", async () => {
        expect(await roboNounsVRGDA.targetPrice()).to.equal(targetPrice)
        expect(await roboNounsVRGDA.perTimeUnit()).to.equal(perTimeUnit)
        expect(await roboNounsVRGDA.startTime()).to.equal(startTime)
        expect(await roboNounsVRGDA.roboNounsToken()).to.equal(
            roboNounsToken.address
        )
        expect(await roboNounsVRGDA.owner()).to.equal(owner.address)
    })

    it("should settle the auction and transfers token", async () => {
        const blockNumber = await ethers.provider.getBlockNumber()
        network.provider.send("evm_mine")
        // assert
        try {
            await roboNounsVRGDA.settleAuction(blockNumber, {
                value: ethers.utils.parseEther("1"),
            })
        } catch (error) {
            console.log(error)
        }

        expect(await roboNounsToken.ownerOf(0)).to.equal(owner.address)
    })

    it("should properly fetchNextNoun and render data", async () => {
        const blockNumber = await ethers.provider.getBlockNumber()
        network.provider.send("evm_mine")
        try {
            await roboNounsVRGDA.settleAuction(blockNumber, {
                value: ethers.utils.parseEther("1"),
            })
        } catch (error) {
            console.log(error)
        }
        network.provider.send("evm_mine")

        const { nounId, seed, svg, price, hash } =
            await roboNounsVRGDA.fetchNextNoun()
        console.log(nounId, seed, svg, price, hash)
    })

    // it("should properly mint next svg", async () => {
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
