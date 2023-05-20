import { task, types } from "hardhat/config"
import { Contract as EthersContract } from "ethers"
import { ContractName } from "./types"
import saveDeployedContract from "./utils/saveDeployment"

interface Contract {
    args?: (string | number | (() => string | undefined))[]
    instance?: EthersContract
    libraries?: () => Record<string, string>
    waitForConfirmation?: boolean
}

task("deploy-local", "Deploy contracts to hardhat").setAction(
    async (args, { ethers }) => {
        const network = await ethers.provider.getNetwork()
        if (network.chainId !== 31337) {
            console.log(
                `Invalid chain id. Expected 31337. Got: ${network.chainId}.`
            )
            return
        }

        const NOUNS_ART_NONCE_OFFSET = 4
        const VRGDA_NONCE_OFFSET = 7
        const NOUNS_DESCRIPTOR_MAINNET =
            "0x6229c811d04501523c6058bfaac29c91bb586268"
        const NOUNS_ART_MAINNET = "0x48A7C62e2560d1336869D6550841222942768C49"

        const [deployer] = await ethers.getSigners()

        console.log("deploying to chain: ", network.chainId)
        console.log("deploying addr: ", deployer.address)

        const nonce = await deployer.getTransactionCount()
        const expectedRoboNounsArtAddress = ethers.utils.getContractAddress({
            from: deployer.address,
            nonce: nonce + NOUNS_ART_NONCE_OFFSET,
        })

        const expectedVRGDAAddress = ethers.utils.getContractAddress({
            from: deployer.address,
            nonce: nonce + VRGDA_NONCE_OFFSET,
        })

        const contracts: Record<ContractName, Contract> = {
            NFTDescriptorV2: {},
            SVGRenderer: {},
            NounsDescriptorV2: {
                args: [
                    expectedRoboNounsArtAddress,
                    NOUNS_ART_MAINNET,
                    () => contracts.SVGRenderer.instance?.address,
                ],
                libraries: () => ({
                    NFTDescriptorV2: contracts.NFTDescriptorV2.instance
                        ?.address as string,
                }),
            },
            Inflator: {},
            NounsArt: {
                args: [
                    () => contracts.NounsDescriptorV2.instance?.address,
                    () => contracts.Inflator.instance?.address,
                ],
            },
            RoboNounsSeeder: {},
            RoboNounsToken: {
                args: [
                    expectedVRGDAAddress,
                    () => contracts.NounsDescriptorV2.instance?.address,
                    NOUNS_DESCRIPTOR_MAINNET,
                    () => contracts.RoboNounsSeeder.instance?.address,
                ],
            },
            RoboNounsVRGDA: {
                args: [
                    "150000000000000000", // 0.15 ETH
                    "100000000000000000", // 10%
                    "24000000000000000000", // 24 hours
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

            if (contract.waitForConfirmation) {
                await deployedContract.deployed()
            }

            contracts[name as ContractName].instance = deployedContract

            console.log(
                `${name} contract deployed to ${deployedContract.address}`
            )

            await saveDeployedContract(name, deployedContract.address)
        }

        return contracts
    }
)
