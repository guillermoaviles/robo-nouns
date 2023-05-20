import { task, types } from "hardhat/config"

task("fetch", "Calls fetchNextNoun on RoboNounsVRGDA")
    .addOptionalParam(
        "vrgda",
        "The `RoboNounsVRGDA` contract address",
        "0x687bB6c57915aa2529EfC7D2a26668855e022fAE",
        types.string
    )
    .setAction(async ({ vrgda }, { ethers, network }) => {
        const VRGDAFactory = await ethers.getContractFactory("RoboNounsVRGDA")
        const roboNounsVRGDA = VRGDAFactory.attach(vrgda)

        const res = await roboNounsVRGDA.fetchNextNoun()
        console.log(res)
        console.log(JSON.stringify(res, null, 2))
    })
