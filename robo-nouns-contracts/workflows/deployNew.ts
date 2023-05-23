import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect, assert } from "chai"
import { constants, BigNumber } from "ethers"
import { ethers, network } from "hardhat"
import * as nounsData from "../assets/image-data.json"
import * as testData from "../assets/big-noun-image-data.json"
import * as newNounsData from "../assets/image-data-new.json"

import * as assessories from "../assets/descriptor_v2/accessoriesPage.json"
import * as bodies from "../assets/descriptor_v2/bodiesPage.json"
import * as paletteAndBg from "../assets/descriptor_v2/palettePage.json"
import * as heads from "../assets/descriptor_v2/headsPage.json"
import * as glasses from "../assets/descriptor_v2/glassesPage.json"

// eslint-disable-next-line node/no-missing-import
import {
    RoboNounsVRGDA,
    RoboNounsVRGDA__factory,
    RoboNounsDescriptor,
    RoboNounsDescriptor__factory,
    RoboNounsToken,
    RoboNounsToken__factory,
    RoboNounsSeeder,
    RoboNounsSeeder__factory,
    RoboNounsDescriptorV2,
    RoboNounsDescriptorV2__factory,
    INounsArt,
    ISVGRenderer,
    NounsArt,
    NounsArt__factory,
} from "../typechain-types"

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize))
    }
    return result
}

async function main() {
    let roboNounsVRGDA: RoboNounsVRGDA
    let roboNounsVRGDAFactory: RoboNounsVRGDA__factory

    let roboNounsSeeder: RoboNounsSeeder
    let roboNounsSeederFactory: RoboNounsSeeder__factory

    let roboNounsDescriptorV2: RoboNounsDescriptorV2
    let roboNounsDescriptorV2Factory: RoboNounsDescriptorV2__factory

    let roboNounsToken: RoboNounsToken
    let roboNounsTokenFactory: RoboNounsToken__factory

    let nounsArt: NounsArt
    let nounsArtFactory: NounsArt__factory

    let owner: SignerWithAddress
    let addresses: SignerWithAddress[]

    let targetPrice: string = "150000000000000000"
    let priceDecayPercent: string = "310000000000000000"
    let perTimeUnit: string = "24000000000000000000"
    let startTime: number = 1682392703

    const NounsrArtAddress: string =
        "0x48A7C62e2560d1336869D6550841222942768C49"
    const SVGRendererAddress: string =
        "0x81d94554A4b072BFcd850205f0c79e97c92aab56"
    const OpenSeaProxyRegistryAddress: string =
        "0xa5409ec958C83C3f309868babACA7c86DCB077c1"
    const NounsDaoTreasuryAddress: string =
        "0x0BC3807Ec262cB779b38D65b38158acC3bfedE10"

    // hooks
    ;[owner, ...addresses] = await ethers.getSigners()
    roboNounsVRGDAFactory = (await ethers.getContractFactory(
        "RoboNounsVRGDA"
    )) as RoboNounsVRGDA__factory
    roboNounsSeederFactory = (await ethers.getContractFactory(
        "RoboNounsSeeder"
    )) as RoboNounsSeeder__factory
    roboNounsDescriptorV2Factory = (await ethers.getContractFactory(
        "RoboNounsDescriptorV2"
    )) as RoboNounsDescriptorV2__factory
    roboNounsTokenFactory = (await ethers.getContractFactory(
        "RoboNounsToken"
    )) as RoboNounsToken__factory

    roboNounsVRGDA = await roboNounsVRGDAFactory.deploy()
    roboNounsSeeder = await roboNounsSeederFactory.deploy()
    
    roboNounsDescriptorV2 = await roboNounsDescriptorV2Factory.deploy(
        SVGRendererAddress,
        NounsrArtAddress
    )
    nounsArt = await nounsArtFactory.deploy(roboNounsDescriptorV2.address)
    roboNounsToken = await roboNounsTokenFactory.deploy(
        NounsDaoTreasuryAddress,
        roboNounsVRGDA.address,
        roboNounsDescriptorV2.address,
        roboNounsSeeder.address,
        OpenSeaProxyRegistryAddress
    )

    console.log(
        "RoboNounsDescriptor deployed to:",
        roboNounsDescriptorV2.address
    )
    console.log("RoboNounsSeeder deployed to:", roboNounsSeeder.address)
    console.log("RoboNounsToken deployed to:", roboNounsToken.address)
    console.log("RoboNounsVRGDA deployed to:", roboNounsVRGDA.address)

    try {
        console.log("Deploying art...")

        await roboNounsDescriptorV2.addAccessories(
            assessories.accessoriesCompressed,
            assessories.accessoriesLength,
            assessories.accessoriesLength
        )
        await roboNounsDescriptorV2.addBackground(newNounsData.bgcolors)
        await roboNounsDescriptorV2.addBodies(
            bodies.bodiesCompressed,
            bodies.bodiesLength,
            bodies.bodiesCount
        )
        await roboNounsDescriptorV2.setPalette("0", paletteAndBg.palette)

        console.log("Art deployed!")
    } catch (error) {
        console.error(error)
        process.exitCode = 1
    }

    console.log("Initializing VRGDA...")
    await roboNounsVRGDA.initialize(
        targetPrice,
        priceDecayPercent,
        perTimeUnit,
        startTime,
        roboNounsToken.address
    )

    console.log("Fetching next noun...")
    await roboNounsVRGDA.fetchNextNoun()
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
