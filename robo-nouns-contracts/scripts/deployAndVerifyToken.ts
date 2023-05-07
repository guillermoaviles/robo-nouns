import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run, network } from "hardhat"
import saveDeployment from "../utils/saveDeployment"
import contracts from "../utils/addresses.json"
import { RoboNounsToken, RoboNounsToken__factory } from "../typechain-types"

export default async function () {
    const [owner] = await ethers.getSigners()
    const contractName: string = "RoboNounsToken"

    const roboNounsTokenConstructorArgs: [string, string, string, string] = [
        owner.address,
        contracts.RoboNounsVRGDA.address,
        contracts.RoboNounsSeeder.address,
        contracts.RoboNounsDescriptor.address,
    ]

    const roboNounsTokenFactory: RoboNounsToken__factory =
        (await ethers.getContractFactory(
            contractName
        )) as RoboNounsToken__factory
    const roboNounsToken: RoboNounsToken = await roboNounsTokenFactory.deploy(
        ...roboNounsTokenConstructorArgs
    )

    await roboNounsToken.deployed()
    console.log(contractName + " deployed to:", roboNounsToken.address)

    saveDeployment(
        contractName,
        roboNounsToken.address,
        roboNounsToken.interface.format("json")
    )

    if (network.config.chainId !== 31337 && network.config.chainId !== 1337) {
        await setTimeout(async () => {
            await run("verify:verify", {
                address: roboNounsToken.address,
                constructorArguments: roboNounsTokenConstructorArgs,
            })
        }, 1000 * 30) // 30 secs
    }
}
