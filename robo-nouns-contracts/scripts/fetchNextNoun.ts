import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import saveDeployment from "../utils/saveDeployment"
import contracts from "../utils/addresses.json"

async function main() {
    const contractName: string = "RoboNounsVRGDA"
    let owner: SignerWithAddress
    let addresses: SignerWithAddress[]
    ;[owner, ...addresses] = await ethers.getSigners()

    const roboNounsVRGDA: Contract = await ethers.getContractAt(
        contractName,
        contracts.RoboNounsVRGDA.address
    )

    console.log("Fetching next noun...")
    console.log(await roboNounsVRGDA.fetchNextNoun())

    saveDeployment(
        contractName,
        roboNounsVRGDA.address,
        roboNounsVRGDA.interface.format("json")
    )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
