import { task, types } from "hardhat/config"
import ImageData from "../assets/image-data.json"
import { dataToDescriptorInput } from "./utils"

task(
    "populate-descriptor",
    "Populates the Robo nouns descriptor with accessories"
)
    .addOptionalParam(
        "nftDescriptor",
        "The `NFTDescriptorV2` contract address",
        "0xb04CB6c52E73CF3e2753776030CE85a36549c9C2",
        types.string
    )
    .addOptionalParam(
        "nounsDescriptor",
        "The `NounsDescriptorV2` contract address",
        "0xa195ACcEB1945163160CD5703Ed43E4f78176a54",
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

            const { bgcolors, palette, images } = ImageData
            const { accessories } = images

            const accessoriesPage = dataToDescriptorInput(
                accessories.map(({ data }) => data)
            )

            await descriptorContract.addManyBackgrounds(bgcolors)
            await descriptorContract.setPalette(
                0,
                `0x000000${palette.join("")}`
            )

            await descriptorContract.addAccessories(
                accessoriesPage.encodedCompressed,
                accessoriesPage.originalLength,
                accessoriesPage.itemCount,
                options
            )

            console.log("Descriptor populated with palettes and accessories.")
        }
    )
