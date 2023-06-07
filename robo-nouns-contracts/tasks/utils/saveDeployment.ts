import { promises as fs } from "fs"
import path from "path"

const DESTINATION = path.join(__dirname, "../utils/deployments.json")

export default async function (chain: number, name: string, address: string) {
    let deployments
    try {
        const fileContent = await fs.readFile(DESTINATION, "utf8")
        deployments = JSON.parse(fileContent)
    } catch (error) {
        console.error("Error reading the JSON file:", error)
        deployments = {}
    }

    // This line will always add or update the contract information
    deployments[name] = {
        chain: chain,
        address: address,
    }
    await fs.writeFile(DESTINATION, JSON.stringify(deployments))
}
