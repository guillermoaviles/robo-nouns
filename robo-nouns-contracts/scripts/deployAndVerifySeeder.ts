import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run, network } from "hardhat"
import saveDeployment from "../utils/saveDeployment"

export default async function () {
    const contractName: string = "RoboNounsSeeder"

    const roboNounsSeederFactory: ContractFactory =
        await ethers.getContractFactory(contractName)
    const roboNounsSeeder: Contract = await roboNounsSeederFactory.deploy()

    await roboNounsSeeder.deployed()
    console.log(contractName + " deployed to:", roboNounsSeeder.address)

    saveDeployment(
        contractName,
        roboNounsSeeder.address,
        roboNounsSeeder.interface.format("json")
    )

    if (network.config.chainId !== 31337 && network.config.chainId !== 1337) {
        await setTimeout(async () => {
            await run("verify:verify", {
                address: roboNounsSeeder.address,
            })
        }, 1000 * 30) // 30 sec
    }
}
