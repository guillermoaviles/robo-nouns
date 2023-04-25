import { promises as fs } from "fs"
import path from "path"
import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run } from "hardhat"
// import addresses from "../utils/addresses.json"

const DESTINATION = path.join(__dirname, "../utils/addresses.json")

async function main() {
    const roboNounsVRGDAAddress = "0xCae6421243E1aFead0A11A7c5a245Ac8D701a5fe"
    const roboNounsSeederAddress = "0x132BD12EF94803c16F74CfCa603E7459d0a1311f"
    const roboNounsDescriptorAddress =
        "0xCae6421243E1aFead0A11A7c5a245Ac8D701a5fe"
    const contractName: string = "RoboNounsToken"

    const roboNounsTokenConstructorArgs: Array<
        string | number | Array<string | number>
    > = [
        roboNounsVRGDAAddress,
        roboNounsSeederAddress,
        roboNounsDescriptorAddress,
    ]

    const roboNounsTokenFactory: ContractFactory =
        await ethers.getContractFactory(contractName)
    const roboNounsToken: Contract = await roboNounsTokenFactory.deploy(
        ...roboNounsTokenConstructorArgs
    )

    await roboNounsToken.deployed()
    console.log(contractName + " deployed to:", roboNounsToken.address)

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
        address: roboNounsToken.address,
        abi: roboNounsToken.interface.format("json"),
    }
    await fs.writeFile(DESTINATION, JSON.stringify(contractAddresses))
    console.log(contractName + "Saved to addresses.json")

    await setTimeout(async () => {
        await run("verify:verify", {
            address: roboNounsToken.address,
            constructorArguments: roboNounsTokenConstructorArgs,
        })
    }, 1000 * 45) // 45 secs
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
