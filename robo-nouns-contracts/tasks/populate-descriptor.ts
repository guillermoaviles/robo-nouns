import { task, types } from "hardhat/config"
import ImageData from "../assets/image-data.json"
import TestImageData from "../assets/image-data-robo.json"
import { dataToDescriptorInput } from "./utils"
import accessoriesData from "../assets/descriptor_v2/accessoriesPage.json"
import bodiesData from "../assets/descriptor_v2/bodiesPage.json"
import paletteData from "../assets/descriptor_v2/paletteAndBackgrounds.json"
import * as deployments from "./utils/deployments.json"

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
                gasLimit: network.name === "hardhat" ? 30000000 : undefined,
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

            const { bgcolors, palette, images } = TestImageData
            const { accessories } = images

            const accessoriesPage = dataToDescriptorInput(
                accessories.map(({ data }) => data)
            )
            try {
                await descriptorContract.addBackground(bgcolors[0])
                await descriptorContract.setPalette(0, paletteData.paletteValue)
                // await descriptorContract.setPalette(
                //     0,
                //     `0x000000${palette.join("")}`
                // )

                await descriptorContract.addBodies(
                    bodiesData.bodiesCompressed,
                    bodiesData.bodiesLength,
                    bodiesData.bodiesCount
                )

                await descriptorContract.addAccessories(
                    accessoriesData.accessoriesCompressed,
                    accessoriesData.accessoriesLength,
                    accessoriesData.accessoriesCount,
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
