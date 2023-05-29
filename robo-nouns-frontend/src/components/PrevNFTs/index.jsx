import React from "react"
import { useAuction } from "@/context/AuctionContext.jsx"
import Image from "next/image"
import BuyNow from "../BuyNow"

const PrevNFTs = () => {
    const { nounNFTMeta, currMintPrice } = useAuction()
    
    return (
        <div className="w-full bg-dark-gray px-20">
            <h2 className="font-press text-center text-white text-2xl pt-4 md:pt-16">
                Last 3 blocks:
            </h2>
            <div className="flex flex-col md:flex-row p-6 justify-evenly">
                {nounNFTMeta &&
                    nounNFTMeta.slice(-3).map((nft, index) => (
                        <div key={index} className="py-6">
                            <Image
                                src={`data:image/svg+xml;base64,${nft?.svg}`}
                                alt={`NFT ${index}`}
                                width={212}
                                height={200}
                            />
                            <div className="justify-center mt-10">
                                <BuyNow nft={nft} currMintPrice={currMintPrice} nftNo={index + 1} />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default PrevNFTs
