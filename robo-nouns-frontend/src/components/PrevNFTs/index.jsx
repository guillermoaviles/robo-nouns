import React from "react"
import { useAuction } from "@/context/AuctionContext.jsx"
import Image from "next/image"
import BuyNow from "../BuyNow"
import loadingNoun from "../../assets/loading-skull-noun.gif"

const PrevNFTs = () => {
    const { nounTwo, nounThree, nounFour, currMintPrice } = useAuction()

    return (
        <div className="w-full md:pt-0 pt-8 bg-dark-gray px-20">
            <h2 className="font-press text-center text-white text-2xl pt-4 md:pt-16">
                Last 3 blocks:
            </h2>
            <div className="flex flex-col md:flex-row p-6 justify-center">
                <div className="py-6">
                    <Image
                        className="bg-nouns-lime"
                        src={
                            nounTwo?.svg
                                ? `data:image/svg+xml;base64,${nounTwo?.svg}`
                                : loadingNoun
                        }
                        alt={`NFT`}
                        width={280}
                        height={200}
                    />
                    <div className="justify-center mt-10">
                        <BuyNow
                            nft={nounTwo}
                            currMintPrice={currMintPrice}
                            nftNo={0}
                        />
                    </div>
                </div>
                <div className="py-6">
                    <Image
                        className="bg-nouns-lime"
                        src={
                            nounThree?.svg
                                ? `data:image/svg+xml;base64,${nounThree?.svg}`
                                : loadingNoun
                        }
                        alt={`NFT`}
                        width={280}
                        height={200}
                    />
                    <div className="justify-center mt-10">
                        <BuyNow
                            nft={nounThree}
                            currMintPrice={currMintPrice}
                            nftNo={1}
                        />
                    </div>
                </div>
                <div className="py-6">
                    <Image
                        className="bg-nouns-lime"
                        src={
                            nounFour?.svg
                                ? `data:image/svg+xml;base64,${nounFour?.svg}`
                                : loadingNoun
                        }
                        alt={`NFT`}
                        width={280}
                        height={200}
                    />
                    <div className="justify-center mt-10">
                        <BuyNow
                            nft={nounFour}
                            currMintPrice={currMintPrice}
                            nftNo={2}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrevNFTs
