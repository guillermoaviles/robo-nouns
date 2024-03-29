import { task } from "hardhat/config"
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
            address: library.address,
            instance: library,
            constructorArguments: [],
            libraries: {},
        }
        await delay(5)

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
        await delay(5)

        const nounsDescriptorFactory = await ethers.getContractFactory(
            "NounsDescriptorV2",
            {
                libraries: {
                    NFTDescriptorV2: library.address,
                },
            }
        )

        const nounsDescriptor = await nounsDescriptorFactory.deploy(
            expectedRoboNounsArtAddress,
            renderer.address
        )
        contracts.NounsDescriptorV2 = {
            name: "NounsDescriptorV2",
            address: nounsDescriptor.address,
            constructorArguments: [
                expectedRoboNounsArtAddress,
                renderer.address,
            ],
            instance: nounsDescriptor,
            libraries: {
                NFTDescriptorV2: library.address,
            },
        }
        await delay(5)

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
        await delay(5)

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
        await delay(5)

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
        await delay(5)

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
        await delay(5)

        // VRGDA values
        const reservePrice = ethers.utils.parseEther("0.015") // 0.015 ETH == 15000000000000000 wei
        const targetPrice = ethers.utils.parseEther("0.075") // 0.075 ETH == 75000000000000000 wei
        const priceDecayPercent = "31" + "0000000000000000" // priceDecayPercent = 31% or 0.31 * 1e18 = "310000000000000000"
        const perTimeUnit = "2" + "000000000000000000" // perTimeUnit = 2 nouns per 12 hours or 2 * 1e18 = "2000000000000000000"
        const updateInterval = "600" // updateInterval = 10 minutes
        const targetSaleInterval = "86400" // targetSaleInterval = 24 hours

        const roboNounsVRGDA = await (
            await ethers.getContractFactory("RoboNounsVRGDA", deployer)
        ).deploy(
            reservePrice,
            targetPrice,
            priceDecayPercent,
            perTimeUnit,
            updateInterval,
            targetSaleInterval,
            contracts.RoboNounsToken.address
        )
        contracts.RoboNounsVRGDA = {
            name: "RoboNounsVRGDA",
            address: roboNounsVRGDA.address,
            constructorArguments: [
                reservePrice.toString(),
                targetPrice.toString(),
                priceDecayPercent,
                perTimeUnit,
                updateInterval,
                targetSaleInterval,
                contracts.RoboNounsToken.address,
            ],
            instance: roboNounsVRGDA,
            libraries: {},
        }
        await delay(5)

        console.log("Waiting for contracts to be deployed")
        for (const c of Object.values<DeployedContract>(contracts)) {
            console.log(`Waiting for ${c.name} to be deployed`)
            await c.instance.deployTransaction.wait()
            c.address = c.instance.address
            try {
                await saveDeployedContract(
                    network.chainId,
                    c.name,
                    c.address,
                    c.instance.interface.format("json")
                )
                console.log("Saved deployed contract")
            } catch (e) {
                console.log("Error saving deployed contract: ", e)
            }
            console.log(`${c.name} deployed to: ${c.address}`)
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
