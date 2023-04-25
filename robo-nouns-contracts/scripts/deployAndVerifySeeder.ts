import { promises as fs } from "fs"
import path from "path"
import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run } from "hardhat"

const DESTINATION = path.join(__dirname, "../utils/addresses.json")

async function main() {
    const contractName: string = "RoboNounsSeeder"

    const roboNounsSeederFactory: ContractFactory =
        await ethers.getContractFactory(contractName)
    const roboNounsSeeder: Contract = await roboNounsSeederFactory.deploy()

    await roboNounsSeeder.deployed()
    console.log(contractName + " deployed to:", roboNounsSeeder.address)

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
        address: roboNounsSeeder.address,
        abi: roboNounsSeeder.interface.format("json"),
    }
    await fs.writeFile(DESTINATION, JSON.stringify(contractAddresses))
    console.log(contractName + "Saved to addresses.json")

    await setTimeout(async () => {
        await run("verify:verify", {
            address: roboNounsSeeder.address,
        })
    }, 1000 * 45) // 45 sec
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
