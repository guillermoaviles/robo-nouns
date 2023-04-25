import { promises as fs } from "fs"
import path from "path"
import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run } from "hardhat"

const DESTINATION = path.join(__dirname, "../utils/addresses.json")

async function main() {
    const contractName: string = "RoboNounsDescriptor"

    const roboNounsDescriptorFactory: ContractFactory =
        await ethers.getContractFactory(contractName)
    const roboNounsDescriptor: Contract =
        await roboNounsDescriptorFactory.deploy()

    await roboNounsDescriptor.deployed()
    console.log(contractName + " deployed to:", roboNounsDescriptor.address)

    let contractAddresses
    try {
        const fileContent = await fs.readFile(DESTINATION, "utf8")
        contractAddresses = JSON.parse(fileContent)
    } catch (error) {
        console.error("Error reading the JSON file:", error)
        contractAddresses = {}
    }

    await fs.writeFile(DESTINATION, JSON.stringify(contractAddresses))
    console.log(contractName + "Saved to addresses.json")

    await setTimeout(async () => {
        await run("verify:verify", {
            address: roboNounsDescriptor.address,
        })
    }, 1000 * 60) // 45 secs
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
