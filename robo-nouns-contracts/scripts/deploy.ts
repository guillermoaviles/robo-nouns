// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, network } from "hardhat"
import deployDescriptor from "../scripts/deployAndVerifyDescriptor"
import deploySeeder from "../scripts/deployAndVerifySeeder"
import deployToken from "../scripts/deployAndVerifyToken"
import deployVRGDA from "../scripts/deployAndVerifyVRGDA"

async function main() {
    try {
        console.log("Deploying contracts... on " + network.name + " network")
        await deployDescriptor()
        await deploySeeder()
        await deployToken()
        await deployVRGDA()
        console.log("Contracts deployed successfully!")
    } catch (error) {
        console.error(error)
        process.exitCode = 1
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
