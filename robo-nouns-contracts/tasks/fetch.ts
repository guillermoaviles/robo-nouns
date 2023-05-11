import { task, types } from "hardhat/config"

task("fetch", "Calls fetchNextNoun on RoboNounsVRGDA")
    .addOptionalParam(
        "vrgda",
        "The `RoboNounsVRGDA` contract address",
        "0xc981ec845488b8479539e6B22dc808Fb824dB00a",
        types.string
    )
    .setAction(async ({ vrgda }, { ethers, network }) => {
        const VRGDAFactory = await ethers.getContractFactory("RoboNounsVRGDA")
        const roboNounsVRGDA = VRGDAFactory.attach(vrgda)

        const res = await roboNounsVRGDA.fetchNextNoun()
        console.log(JSON.stringify(res, null, 2))
    })
