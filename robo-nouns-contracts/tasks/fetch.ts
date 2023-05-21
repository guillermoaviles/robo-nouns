import { task, types } from "hardhat/config"
import * as deployments from "./utils/deployments.json"

task("fetch", "Calls fetchNextNoun on RoboNounsVRGDA")
    .addOptionalParam(
        "vrgda",
        "The `RoboNounsVRGDA` contract address",
        deployments.RoboNounsVRGDA.address,
        types.string
    )
    .setAction(async ({ vrgda }, { ethers, network }) => {
        const options = {
            gasLimit:
                network.name === "hardhat" || "localhost"
                    ? 15_000_000
                    : undefined,
        }
        const VRGDAFactory = await ethers.getContractFactory("RoboNounsVRGDA")
        const roboNounsVRGDA = VRGDAFactory.attach(vrgda)

        const res = await roboNounsVRGDA.fetchNextNoun(options)
        console.log(res)
        console.log(JSON.stringify(res, null, 2))
    })
