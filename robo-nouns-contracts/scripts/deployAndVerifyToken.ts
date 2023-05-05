import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run, network } from "hardhat"
import saveDeployment from "../utils/saveDeployment"

export default async function () {
    const [owner] = await ethers.getSigners()
    const roboNounsVRGDAAddress = "0xCae6421243E1aFead0A11A7c5a245Ac8D701a5fe"
    const roboNounsSeederAddress = "0x132BD12EF94803c16F74CfCa603E7459d0a1311f"
    const roboNounsDescriptorAddress =
        "0xCae6421243E1aFead0A11A7c5a245Ac8D701a5fe"
    const contractName: string = "RoboNounsToken"

    const roboNounsTokenConstructorArgs: Array<
        string | number | Array<string | number>
    > = [
        owner.address,
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
