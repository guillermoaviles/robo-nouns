import { useContract, useContractRead } from "@thirdweb-dev/react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useAuction } from "../../context/AuctionContext"

export default function NounImg() {
    const { contract } = useContract(
        "0xaF71644feEAf6439015D57631f59f8e0E0F91C67"
    )
    const [lilNoun, setLilNoun] = useState("")
    const { addNounData, nounNFTMeta } = useAuction()

    const nounData = async () => {
        const nounMeta = await contract?.call("fetchNextNoun")
        const newLilNoun = nounMeta
            ? `data:image/svg+xml;base64,${nounMeta.svg}`
            : ""
        setLilNoun(newLilNoun)
        addNounData(nounMeta)
        // AuctionContext.setValue(nounMeta); // push new original data to AuctionContext
    }

    useEffect(() => {
        const interval = setInterval(() => {
            nounData()
        }, 1000)

        return () => clearInterval(interval)
    }, [lilNoun, contract])

    return (
        <div className="flex w-full lg:w-1/2">
            <div className="w-full relative">
                <div className="md:h-0 w-full">
                    <Image
                        src={lilNoun}
                        alt="Noun Image"
                        className="md:absolute top-0 left-0 w-full md:h-full"
                        width={300}
                        height={300}
                    />
                </div>
            </div>
        </div>
    )
}
