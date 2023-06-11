import { task, types } from "hardhat/config"
import { BigNumber, Contract as EthersContract } from "ethers"
import { ContractName, DeployedContract } from "./types"
import saveDeployedContract from "./utils/saveDeployment"

interface Contract {
    name?: string
    address?: string
    args?: (string | number | BigNumber | (() => string | undefined))[]
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
        // const NOUNS_ART_GOERLI = "0xf786148F2B31d12A9B0795EBF39c3a0330760da4"
        // const NOUNS_DESCRIPTOR_GOERLI =
        //     "0xB6D0AF8C27930E13005Bf447d54be8235724a102"

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
                args: [
                    expectedRoboNounsArtAddress,
                    // NOUNS_ART_GOERLI,
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
                args: [
                    () => contracts.NounsDescriptorV2.instance?.address,
                    () => contracts.Inflator.instance?.address,
                ],
            },
            RoboNounsSeeder: { name: "RoboNounsSeeder" },
            RoboNounsToken: {
                name: "RoboNounsToken",
                args: [
                    expectedVRGDAAddress,
                    () => contracts.NounsDescriptorV2.instance?.address,
                    // NOUNS_DESCRIPTOR_GOERLI,
                    () => contracts.RoboNounsSeeder.instance?.address,
                ],
            },
            RoboNounsVRGDA: {
                name: "RoboNounsVRGDA",
                args: [
                    ethers.utils.parseEther("0.05"), // reservePrice = 0.05 ETH = "50000000000000000"
                    ethers.utils.parseEther("0.15"), // targetPrice = 0.15 ETH = "150000000000000000"
                    "31", // priceDecayPercent = 31%
                    "96", // perTimeUnit = 96 Nouns per day or 1 Noun per 15 minutes
                    "300", // updateInterval = 5 minutes (time to recalculate VRGDA price)
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
                ...(contract.args?.map((a) =>
                    typeof a === "function" ? a() : a
                ) ?? [])
            )

            contract.address = deployedContract.address

            if (contract.waitForConfirmation) {
                await deployedContract.deployed()
            }

            contracts[name as ContractName].instance = deployedContract
            contracts[name as ContractName].address = deployedContract.address
            console.log(
                `${name} deployment saved and deployed to ${deployedContract.address}`
            )

            await saveDeployedContract(
                network.chainId,
                name,
                deployedContract.address
            )
            await delay(5)
        }

        // if (network.name !== "localhost") {
        //     console.log(
        //         "Waiting 1 minute before verifying contracts on Etherscan"
        //     )
        //     await delay(30)

        //     console.log("Verifying contracts on Etherscan...")
        //     await run("verify-etherscan", {
        //         contracts,
        //     })
        //     console.log("Verify complete.")
        // }

        return contracts
    }
)
