import { promises as fs } from "fs"
import path from "path"
import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run } from "hardhat"

const DESTINATION = path.join(__dirname, "../utils/addresses.json")

async function main() {
    const contractName: string = "RoboNounsVRGDA"

    const roboNounsVRGDAFactory: ContractFactory =
        await ethers.getContractFactory(contractName)
    const roboNounsVRGDA: Contract = await roboNounsVRGDAFactory.deploy()

    await roboNounsVRGDA.deployed()
    console.log(contractName + " deployed to:", roboNounsVRGDA.address)

    let contractAddresses
    try {
        const fileContent = await fs.readFile(DESTINATION, "utf8")
        contractAddresses = JSON.parse(fileContent)
    } catch (error) {
        console.error("Error reading the JSON file:", error)
        contractAddresses = {}
    }

    // This line will always add or update the contract information
    contractAddresses[contractName] = {
        address: roboNounsVRGDA.address,
        abi: roboNounsVRGDA.interface.format("json"),
    }

    await fs.writeFile(DESTINATION, JSON.stringify(contractAddresses))
    console.log(contractName + "Saved to addresses.json")

    await setTimeout(async () => {
        await run("verify:verify", {
            address: roboNounsVRGDA.address,
        })
    }, 1000 * 45) // 45 sec
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
