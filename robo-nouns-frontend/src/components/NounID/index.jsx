import { useContract, useContractRead } from "@thirdweb-dev/react"

export default function NounID() {
    const { contract } = useContract(
        "0xaF71644feEAf6439015D57631f59f8e0E0F91C67"
    )
    const { data: nextNoun } = useContractRead(contract, "fetchNextNoun");

    return (
        <div className="font-londrina">
            <h1 className="text-[#1C2228] text-7xl mt-2">
                Robo Noun {nextNoun && nextNoun.nounId.toNumber()}
            </h1>
        </div>
    )
}
