import { task, types } from "hardhat/config"
import { BigNumber, Contract as EthersContract } from "ethers"
import { ContractName, DeployedContract } from "./types"
import saveDeployedContract from "./utils/saveDeployment"

async function delay(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, 1000 * seconds))
}

task("deploy-goerli", "Deploy contracts to goerli").setAction(
    async (args, { ethers, run }) => {
        const contracts: Record<ContractName, DeployedContract> = {} as Record<
            ContractName,
            DeployedContract
        >
        const network = await ethers.provider.getNetwork()
        const [deployer] = await ethers.getSigners()

        const nonce = await deployer.getTransactionCount()
        const NOUNS_ART_NONCE_OFFSET = 4
        const VRGDA_NONCE_OFFSET = 7
        const expectedRoboNounsArtAddress = ethers.utils.getContractAddress({
            from: deployer.address,
            nonce: nonce + NOUNS_ART_NONCE_OFFSET,
        })

        const expectedVRGDAAddress = ethers.utils.getContractAddress({
            from: deployer.address,
            nonce: nonce + VRGDA_NONCE_OFFSET,
        })

        console.log("Deploying contracts...")
        console.log("Deployer is: ", deployer.address)
        const library = await (
            await ethers.getContractFactory("NFTDescriptorV2", deployer)
        ).deploy()
        contracts.NFTDescriptorV2 = {
            name: "NFTDescriptorV2",
            address: library.address.toString(),
            instance: library,
            constructorArguments: [],
            libraries: {},
        }
        await delay(3)

        const renderer = await (
            await ethers.getContractFactory("SVGRenderer", deployer)
        ).deploy()
        contracts.SVGRenderer = {
            name: "SVGRenderer",
            address: renderer.address,
            instance: renderer,
            constructorArguments: [],
            libraries: {},
        }
        await delay(3)

        const nounsDescriptorFactory = await ethers.getContractFactory(
            "NounsDescriptorV2",
            {
                libraries: {
                    NFTDescriptorV2: library.address,
                },
            }
        )
        await delay(3)

        const nounsDescriptor = await nounsDescriptorFactory.deploy(
            expectedRoboNounsArtAddress,
            renderer.address
        )
        contracts.NounsDescriptorV2 = {
            name: "NounsDescriptorV2",
            address: nounsDescriptor.address,
            constructorArguments: [
                expectedRoboNounsArtAddress.toString(),
                renderer.address,
            ],
            instance: nounsDescriptor,
            libraries: {
                NFTDescriptorV2: library.address,
            },
        }
        await delay(3)

        const inflator = await (
            await ethers.getContractFactory("Inflator", deployer)
        ).deploy()
        contracts.Inflator = {
            name: "Inflator",
            address: inflator.address,
            instance: inflator,
            constructorArguments: [],
            libraries: {},
        }
        await delay(3)

        const art = await (
            await ethers.getContractFactory("NounsArt", deployer)
        ).deploy(nounsDescriptor.address, inflator.address)
        contracts.NounsArt = {
            name: "NounsArt",
            address: art.address,
            constructorArguments: [nounsDescriptor.address, inflator.address],
            instance: art,
            libraries: {},
        }
        await delay(3)

        const roboNounsSeeder = await (
            await ethers.getContractFactory("RoboNounsSeeder", deployer)
        ).deploy()
        contracts.RoboNounsSeeder = {
            name: "RoboNounsSeeder",
            address: roboNounsSeeder.address,
            constructorArguments: [],
            instance: roboNounsSeeder,
            libraries: {},
        }
        await delay(3)

        const roboNounsToken = await (
            await ethers.getContractFactory("RoboNounsToken", deployer)
        ).deploy(
            expectedVRGDAAddress,
            contracts.NounsDescriptorV2.address,
            contracts.RoboNounsSeeder.address
        )
        contracts.RoboNounsToken = {
            name: "RoboNounsToken",
            address: roboNounsToken.address,
            constructorArguments: [
                expectedVRGDAAddress,
                contracts.NounsDescriptorV2.address,
                contracts.RoboNounsSeeder.address,
            ],
            instance: roboNounsToken,
            libraries: {},
        }
        await delay(3)

        const roboNounsVRGDA = await (
            await ethers.getContractFactory("RoboNounsVRGDA", deployer)
        ).deploy(
            ethers.utils.parseEther("0.0001"),
            ethers.utils.parseEther("0.0015"),
            "31" + "0000000000000000",
            "1" + "000000000000000000",
            "300",
            "900",
            contracts.RoboNounsToken.address
        )
        contracts.RoboNounsVRGDA = {
            name: "RoboNounsVRGDA",
            address: roboNounsVRGDA.address,
            constructorArguments: [
                ethers.utils.parseEther("0.0001").toString(), // reservePrice = 0.01 ETH = "100000000000000"
                ethers.utils.parseEther("0.0015").toString(), //  targetPrice = 0.15 ETH = "1500000000000000"
                "31" + "0000000000000000", // priceDecayPercent = 31% or 0.31 * 1e18 = "310000000000000000"
                "1" + "000000000000000000", // perTimeUnit = 1 nouns per 15 min or 1 * 1e18 = "1000000000000000000"
                "300", // updateInterval = 5 minutes
                "900", // targetSaleInterval = 15 minutes
                contracts.RoboNounsToken.address,
            ],
            instance: roboNounsVRGDA,
            libraries: {},
        }

        console.log("Waiting for contracts to be deployed")
        for (const c of Object.values<DeployedContract>(contracts)) {
            console.log(`Waiting for ${c.name} to be deployed`)
            await c.instance.deployTransaction.wait()
            c.address = c.instance.address
            await delay(3)
            await saveDeployedContract(
                network.chainId,
                c.name,
                c.address,
                c.instance.interface.format("json")
            )
            console.log("Done")
        }

        console.log("Populating Descriptor...")
        await run("populate-descriptor", {
            nftDescriptor: contracts.NFTDescriptorV2.address,
            nounsDescriptor: contracts.NounsDescriptorV2.address,
        })
        console.log("Population complete.")

        if (network.chainId !== 33137) {
            console.log(
                "Waiting 45 sec before verifying contracts on Etherscan"
            )
            await delay(45)

            console.log("Verifying contracts on Etherscan...")
            await run("verify-etherscan", {
                contracts,
            })
            console.log("Verify complete.")
        }

        return contracts
    }
)
