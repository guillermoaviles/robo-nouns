import Image from "next/image"
import { useAuction } from "../../context/AuctionContext"

export default function NounImg() {
    const { nounNFTMeta } = useAuction()
    
    return (
        <div className="flex w-full lg:w-1/2">
            <div className="w-full relative">
                <div className="md:h-0 w-full">
                    <Image
                        src={`data:image/svg+xml;base64,${nounNFTMeta[0]?.svg}`}
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
