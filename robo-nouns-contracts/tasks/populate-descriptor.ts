import { task, types } from "hardhat/config"
import ImageData from "../assets/image-data_old.json"
import RoboData from "../assets/image-data-robo.json"
import NounsData from "../assets/image-data-nouns.json"
import RoboDataNoHeads from "../assets/image-data-robo-no-heads.json"
import { dataToDescriptorInput } from "./utils"
import * as deployments from "../assets/deployments.json"

async function delay(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, 1000 * seconds))
}

task(
    "populate-descriptor",
    "Populates the Robo nouns descriptor with accessories"
)
    .addOptionalParam(
        "nftDescriptor",
        "The `NFTDescriptorV2` contract address",
        deployments.NFTDescriptorV2.address,
        types.string
    )
    .addOptionalParam(
        "nounsDescriptor",
        "The `NounsDescriptorV2` contract address",
        deployments.NounsDescriptorV2.address,
        types.string
    )
    .setAction(
        async ({ nftDescriptor, nounsDescriptor }, { ethers, network }) => {
            const options = {
                gasLimit:
                    network.name === "hardhat" || "localhost"
                        ? 30_000_000
                        : undefined,
            }

            const descriptorFactory = await ethers.getContractFactory(
                "NounsDescriptorV2",
                {
                    libraries: {
                        NFTDescriptorV2: nftDescriptor,
                    },
                }
            )

            const descriptorContract = descriptorFactory.attach(nounsDescriptor)

            const { bgcolors, palette, images } = RoboData
            const { bodies, accessories, heads, glasses } = images

            const bodiesPage = dataToDescriptorInput(
                bodies.map(({ data }) => data)
            )
            const headsPage = dataToDescriptorInput(
                heads.map(({ data }) => data)
            )
            const glassesPage = dataToDescriptorInput(
                glasses.map(({ data }) => data)
            )
            const accessoriesPage = dataToDescriptorInput(
                accessories.map(({ data }) => data)
            )

            try {
                await descriptorContract.addManyBackgrounds(bgcolors)
                await delay(2)

                await descriptorContract.setPalette(
                    0,
                    `0x000000${palette.join("")}`
                )
                await delay(2)

                await descriptorContract.addBodies(
                    bodiesPage.encodedCompressed,
                    bodiesPage.originalLength,
                    bodiesPage.itemCount,
                    options
                )
                await delay(2)

                await descriptorContract.addHeads(
                    headsPage.encodedCompressed,
                    headsPage.originalLength,
                    headsPage.itemCount,
                    options
                )
                await delay(2)

                await descriptorContract.addGlasses(
                    glassesPage.encodedCompressed,
                    glassesPage.originalLength,
                    glassesPage.itemCount,
                    options
                )
                await delay(2)

                await descriptorContract.addAccessories(
                    accessoriesPage.encodedCompressed,
                    accessoriesPage.originalLength,
                    accessoriesPage.itemCount,
                    options
                )

                console.log(
                    "Descriptor populated with palettes and accessories."
                )
            } catch (e) {
                console.log(e)
            }
        }
    )
