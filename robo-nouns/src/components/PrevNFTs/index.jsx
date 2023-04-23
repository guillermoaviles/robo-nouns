import React from "react"
import { useAuction } from "@/context/AuctionContext.jsx"
import { ethers } from "ethers"
import Image from "next/image"
import BuyNow from "../BuyNow"

const PrevNFTs = () => {
    const { nounNFTMeta, currMintPrice } = useAuction()
    console.log('nounNFTMeta', nounNFTMeta)

    console.log('nounNFTMeta, currMintPrice', nounNFTMeta, currMintPrice)
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
                            <p className="pt-2 font-bold">
                                {/* Price: {ethers.utils.formatEther(nft.price)} */}
                            </p>
                            <BuyNow nft={nft} currMintPrice={currMintPrice} nftNo={index + 1}/>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default PrevNFTs
