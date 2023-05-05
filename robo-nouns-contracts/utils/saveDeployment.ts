import { promises as fs } from "fs"
import path from "path"
import { ContractInterface } from "ethers"

const DESTINATION = path.join(__dirname, "../utils/addresses.json")

export default async function (
    name: string,
    address: string,
    abi: ContractInterface
) {
    let contractAddresses
    try {
        const fileContent = await fs.readFile(DESTINATION, "utf8")
        contractAddresses = JSON.parse(fileContent)
    } catch (error) {
        console.error("Error reading the JSON file:", error)
        contractAddresses = {}
    }

    // This line will always add or update the contract information
    contractAddresses[name] = {
        address: address,
        abi: abi,
    }
    await fs.writeFile(DESTINATION, JSON.stringify(contractAddresses))
    console.log(name + "Saved to addresses.json")
}
