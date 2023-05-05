import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run, network, config } from "hardhat"
import { chunkArray } from "../utils/chunkArray"
import saveDeployment from "../utils/saveDeployment"
import * as nounsData from "../assets/big-noun-image-data.json"

export default async function () {
    const contractName: string = "RoboNounsDescriptor"

    const roboNounsDescriptorFactory: ContractFactory =
        await ethers.getContractFactory(contractName)
    const roboNounsDescriptor: Contract =
        await roboNounsDescriptorFactory.deploy()

    await roboNounsDescriptor.deployed()
    console.log(contractName + " deployed to:", roboNounsDescriptor.address)

    const chunkSize = 10
    try {
        console.log("Adding Nouns Data to the descriptor...")
        await roboNounsDescriptor.addManyBackgrounds(nounsData.bgcolors)
        await roboNounsDescriptor.addManyColorsToPalette("0", nounsData.palette)

        // accessories
        const accessoriesChunks = chunkArray(
            nounsData.images.accessories.map((item) => item.data),
            chunkSize
        )
        for (const chunk of accessoriesChunks) {
            await roboNounsDescriptor.addManyAccessories(chunk)
        }

        // bodies
        const bodiesChunks = chunkArray(
            nounsData.images.bodies.map((item) => item.data),
            chunkSize
        )
        for (const chunk of bodiesChunks) {
            await roboNounsDescriptor.addManyBodies(chunk)
        }

        // glasses
        const glassesChunks = chunkArray(
            nounsData.images.glasses.map((item) => item.data),
            chunkSize
        )
        for (const chunk of glassesChunks) {
            await roboNounsDescriptor.addManyGlasses(chunk)
        }

        // heads
        const headsChunks = chunkArray(
            nounsData.images.heads.map((item) => item.data),
            chunkSize
        )
        for (const chunk of headsChunks) {
            await roboNounsDescriptor.addManyHeads(chunk)
        }
        console.log("Nouns Data added to the descriptor successfully!")
    } catch (error) {
        console.error("Error adding Nouns Data to the contract:", error)
    }

    saveDeployment(
        contractName,
        roboNounsDescriptor.address,
        roboNounsDescriptor.interface.format("json")
    )

    if (network.config.chainId != 31337 && network.config.chainId != 1337) {
        await setTimeout(async () => {
            await run("verify:verify", {
                address: roboNounsDescriptor.address,
            })
        }, 1000 * 30) // 30 secs
    }
}
