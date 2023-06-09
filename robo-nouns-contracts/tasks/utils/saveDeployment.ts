import { promises as fs } from "fs"
import path from "path"

const DESTINATION = path.join(__dirname, "../../assets/deployments.json")

export default async function (
    chain: number,
    name: string,
    address: string,
    abi: string | object
) {
    let deployments
    try {
        const fileContent = await fs.readFile(DESTINATION, "utf8")
        deployments = JSON.parse(fileContent)
    } catch (error) {
        console.error("Error reading the JSON file:", error)
        deployments = {}
    }

    // This line will always add or update the contract information
    if (!deployments[name]) {
        deployments[name] = {}
    }
    deployments[name].address = address
    deployments[name].abi = typeof abi === "string" ? JSON.parse(abi) : abi

    await fs.writeFile(DESTINATION, JSON.stringify(deployments))
}
