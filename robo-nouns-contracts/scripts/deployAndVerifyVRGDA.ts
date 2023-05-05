import { Contract, ContractFactory } from "ethers"
import { ethers, tenderly, run, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import saveDeployment from "../utils/saveDeployment"

export default async function () {
    const contractName: string = "RoboNounsVRGDA"
    let owner: SignerWithAddress
    let addresses: SignerWithAddress[]
    ;[owner, ...addresses] = await ethers.getSigners()

    const roboNounsVRGDAFactory: ContractFactory =
        await ethers.getContractFactory(contractName)
    const roboNounsVRGDA: Contract = await roboNounsVRGDAFactory.deploy()

    await roboNounsVRGDA.deployed()
    console.log(contractName + " deployed to:", roboNounsVRGDA.address)

    saveDeployment(
        contractName,
        roboNounsVRGDA.address,
        roboNounsVRGDA.interface.format("json")
    )

    let targetPrice: string = "150000000000000000" // 0.15 ETH 15 * 10e16
    let priceDecayPercent: string = "310000000000000000" // 31% 31 * 10e16
    let perTimeUnit: string = "24000000000000000000" // 24 hours 24 * 10e18
    let startTime: number = 1682392703 // 2023-09-22 00:00:00 UTC
    let roboNounsTokenAddress = "0x05fEF56441EB5fdB781B35C51ee57B868190468c"

    if (network.config.chainId !== 31337 && network.config.chainId !== 1337) {
        await setTimeout(async () => {
            await run("verify:verify", {
                address: roboNounsVRGDA.address,
            })
        }, 1000 * 30) // 30 sec
    }

    const roboNounsVRGDAOwner = roboNounsVRGDA.connect(owner)
    await roboNounsVRGDAOwner.initialize(
        targetPrice,
        priceDecayPercent,
        perTimeUnit,
        startTime,
        roboNounsTokenAddress
    )
}
