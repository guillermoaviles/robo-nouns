import { promises as fs } from "fs"
import path from "path"
import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

const DESTINATION = path.join(__dirname, "../utils/addresses.json")

async function main() {
    const contractName: string = "RoboNounsVRGDA"
    let owner: SignerWithAddress
    let addresses: SignerWithAddress[]
    ;[owner, ...addresses] = await ethers.getSigners()

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

    let targetPrice: string = "150000000000000000"
    let priceDecayPercent: string = "310000000000000000"
    let perTimeUnit: string = "24000000000000000000"
    let startTime: number = 1682392703
    let roboNounsTokenAddress = "0x05fEF56441EB5fdB781B35C51ee57B868190468c"

    await setTimeout(async () => {
        await run("verify:verify", {
            address: roboNounsVRGDA.address,
        })
    }, 1000 * 30) // 30 sec

    const roboNounsVRGDAOwner = roboNounsVRGDA.connect(owner)
    await roboNounsVRGDAOwner.initialize(
        targetPrice,
        priceDecayPercent,
        perTimeUnit,
        startTime,
        roboNounsTokenAddress
    )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
