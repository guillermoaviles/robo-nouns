import { task, types } from "hardhat/config"
import { BigNumber, Contract as EthersContract } from "ethers"
import { ContractName, DeployedContract } from "./types"
import saveDeployedContract from "./utils/saveDeployment"

interface Contract {
    name?: string
    address?: string
    constructorArguments?: (
        | string
        | number
        | BigNumber
        | (() => string | undefined)
    )[]
    instance?: EthersContract
    libraries?: () => Record<string, string>
    waitForConfirmation?: boolean
}

async function delay(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, 1000 * seconds))
}

task("deploy-goerli", "Deploy contracts to goerli").setAction(
    async (args, { ethers, run }) => {
        const network = await ethers.provider.getNetwork()
        const [deployer] = await ethers.getSigners()

        const nonce = await deployer.getTransactionCount()
        const NOUNS_ART_NONCE_OFFSET = 4
        const VRGDA_NONCE_OFFSET = 7

        console.log("deploying to chain: ", network.chainId)
        console.log("deploying addr: ", deployer.address)

        const expectedRoboNounsArtAddress = ethers.utils.getContractAddress({
            from: deployer.address,
            nonce: nonce + NOUNS_ART_NONCE_OFFSET,
        })

        const expectedVRGDAAddress = ethers.utils.getContractAddress({
            from: deployer.address,
            nonce: nonce + VRGDA_NONCE_OFFSET,
        })

        const contracts: Record<ContractName, Contract> = {
            NFTDescriptorV2: { name: "NFTDescriptorV2" },
            SVGRenderer: { name: "SVGRenderer" },
            NounsDescriptorV2: {
                name: "NounsDescriptorV2",
                constructorArguments: [
                    expectedRoboNounsArtAddress,
                    () => contracts.SVGRenderer.instance?.address,
                ],
                libraries: () => ({
                    NFTDescriptorV2: contracts.NFTDescriptorV2.instance
                        ?.address as string,
                }),
            },
            Inflator: { name: "Inflator" },
            NounsArt: {
                name: "NounsArt",
                constructorArguments: [
                    () => contracts.NounsDescriptorV2.instance?.address,
                    () => contracts.Inflator.instance?.address,
                ],
            },
            RoboNounsSeeder: { name: "RoboNounsSeeder" },
            RoboNounsToken: {
                name: "RoboNounsToken",
                constructorArguments: [
                    expectedVRGDAAddress,
                    () => contracts.NounsDescriptorV2.instance?.address,
                    () => contracts.RoboNounsSeeder.instance?.address,
                ],
            },
            RoboNounsVRGDA: {
                name: "RoboNounsVRGDA",
                constructorArguments: [
                    ethers.utils.parseEther("0.0001"), // reservePrice = 0.01 ETH = "100000000000000"
                    ethers.utils.parseEther("0.0015"), //  targetPrice = 0.15 ETH = "1500000000000000"
                    "31" + "0000000000000000", // priceDecayPercent = 31% or 0.31 * 1e18 = "310000000000000000"
                    "1" + "000000000000000000", // perTimeUnit = 1 nouns per 15 min or 1 * 1e18 = "1000000000000000000"
                    "300", // updateInterval = 5 minutes
                    "900", // targetSaleInterval = 15 minutes
                    () => contracts.RoboNounsToken.instance?.address,
                ],
                waitForConfirmation: true,
            },
        }

        for (const [name, contract] of Object.entries(contracts)) {
            const factory = await ethers.getContractFactory(name, {
                libraries: contract?.libraries?.(),
            })

            const deployedContract = await factory.deploy(
                ...(contract.constructorArguments?.map((a) =>
                    typeof a === "function" ? a() : a
                ) ?? [])
            )

            if (contract.waitForConfirmation) {
                await deployedContract.deployed()
            }

            contracts[name as ContractName].instance = deployedContract
            contracts[name as ContractName].address = deployedContract.address
            console.log(
                `${name} deployment saved and deployed to ${deployedContract.address}`
            )

            const abi = factory.interface.format('json');

            await saveDeployedContract(
                network.chainId,
                name,
                deployedContract.address,
                abi
            )
            await delay(3)
        }

        if (network.chainId !== 33137) {
            console.log(
                "Waiting 1 minute before verifying contracts on Etherscan"
            )
            await delay(60)

            console.log("Verifying contracts on Etherscan...")
            await run("verify-etherscan", {
                contracts,
            })
            console.log("Verify complete.")
        }

        return contracts
    }
)
