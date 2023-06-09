import Image from "next/image"
import { useAuction } from "../../context/AuctionContext"
import loadingNoun from "../../assets/loading-skull-noun.gif"

export default function NounImg() {
    const { nouns } = useAuction()

    return (
        <div className="flex w-full ml-auto lg:w-[520px]">
            <div className="w-full relative">
                <Image
                    src={
                        nouns[0]?.svg
                            ? `data:image/svg+xml;base64,${nouns[0]?.svg}`
                            : loadingNoun
                    }
                    alt="Noun Image"
                    className="md:w-1/2 lg:w-full mx-auto"
                    width={300}
                    height={300}
                />
            </div>
        </div>
    )
}
