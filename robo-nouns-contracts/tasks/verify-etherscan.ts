import { task, types } from "hardhat/config"
import { ContractName, DeployedContract } from "./types"

task("verify-etherscan", "Verify the Solidity contracts on Etherscan")
    .addParam(
        "contracts",
        "Contract objects from the deployment",
        undefined,
        types.json
    )
    .setAction(
        async (
            {
                contracts,
            }: { contracts: Record<ContractName, DeployedContract> },
            hre
        ) => {
            for (const [, contract] of Object.entries(contracts)) {
                console.log(`verifying ${contract.name}...`)
                try {
                    const code = await contract.instance?.provider.getCode(
                        contract.address
                    )
                    if (code === "0x") {
                        console.log(
                            `${contract.name} contract deployment has not completed. waiting to verify...`
                        )
                        await contract.instance?.deployed()
                    }
                    await hre.run("verify:verify", {
                        ...contract,
                    })
                } catch ({ message }) {
                    if (
                        (message as string).includes("Reason: Already Verified")
                    ) {
                        continue
                    }
                    console.error(message)
                }
            }
        }
    )
