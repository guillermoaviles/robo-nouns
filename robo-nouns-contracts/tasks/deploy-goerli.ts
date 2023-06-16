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
        // const NOUNS_DESCRIPTOR_MAINNET =
        //     "0x6229c811d04501523c6058bfaac29c91bb586268"
        // const NOUNS_ART_MAINNET = "0x48A7C62e2560d1336869D6550841222942768C49"
        // const NOUNS_ART_GOERLI = "0xf786148F2B31d12A9B0795EBF39c3a0330760da4"
        // const NOUNS_DESCRIPTOR_GOERLI =
        //     "0xB6D0AF8C27930E13005Bf447d54be8235724a102"
        // const NOUNS_INFLATOR = "0xa2acee85Cd81c42BcAa1FeFA8eD2516b68872Dbe"

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
                    () => contracts.RoboNounsSeeder.instance?.address,
                ],
            },
            RoboNounsVRGDA: {
                name: "RoboNounsVRGDA",
                args: [
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
            await delay(3)
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
