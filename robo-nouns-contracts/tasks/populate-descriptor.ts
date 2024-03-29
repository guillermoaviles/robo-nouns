import { task, types } from "hardhat/config"
import RoboData from "../assets/image-data-robo.json"
import { dataToDescriptorInput } from "./utils"
import deployments from "../assets/deployments.json"

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
                console.log("Adding backgrounds and palettes...")
                // await descriptorContract.addManyBackgrounds(bgcolors)
                // await delay(2)
                // console.log("Backgrounds added.")

                // await descriptorContract.setPalette(
                //     0,
                //     `0x000000${palette.join("")}`
                // )
                // await delay(2)

                // await descriptorContract.addBodies(
                //     bodiesPage.encodedCompressed,
                //     bodiesPage.originalLength,
                //     bodiesPage.itemCount,
                //     options
                // )
                // await delay(2)

                // await descriptorContract.addHeads(
                //     headsPage.encodedCompressed,
                //     headsPage.originalLength,
                //     headsPage.itemCount,
                //     options
                // )
                // await delay(2)

                // console.log("Adding glasses...")
                // await descriptorContract.addGlasses(
                //     glassesPage.encodedCompressed,
                //     glassesPage.originalLength,
                //     glassesPage.itemCount,
                //     options
                // )
                // await delay(2)
                // console.log("Glasses added.")

                console.log("Adding accessories...")
                await descriptorContract.addAccessories(
                    accessoriesPage.encodedCompressed,
                    accessoriesPage.originalLength,
                    accessoriesPage.itemCount
                )
                console.log("Accessories added.")

                console.log(
                    "Descriptor populated with palettes and accessories."
                )
            } catch (e) {
                console.log(e)
            }
        }
    )
