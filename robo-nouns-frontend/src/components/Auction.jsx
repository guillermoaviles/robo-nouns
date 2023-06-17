import React from "react"
import moment from "moment"
import AuctionPrice from "./AuctionPrice"
import AuctionPriceRange from "./AuctionPriceRange"
import BuyNow from "./BuyNow"
import Timer from "./Timer"
import NounImg from "./NounImg"
import { useAuction } from "@/context/AuctionContext.jsx"


const Auction = () => {
    const { nounNFTMeta, currMintPrice } = useAuction()


    return (
        <div className="container md:bg-nouns-lime mx-auto mt-2 md:pb-0 pb-10">
            <div className="flex flex-wrap md:mx-0 -mt-0">
                <NounImg />
                <div className="flex w-full lg:w-1/2 md:bg-nouns-lime items-center md:mx-auto pt-6 md:pt-0 pb-0 md:min-h-[520px]">
                    <div>
                        <div className="mb-2">
                            <div className="flex flex-col mb-0">
                                <div className="w-full">
                                    <div className="w-auto">
                                        <h4 className="text-dark-gray mt-1 text-lg font-bold">
                                            {moment().format("MMMM Do, YYYY")}
                                        </h4>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="font-press">
                                        <h1 className="text-dark-gray text-2xl md:text-4xl mt-2">
                                            Robo Noun {nounNFTMeta && nounNFTMeta[0]?.nounId.toNumber()}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row mb-0">
                                <div className="border-r-[#79809c49] w-full lg:w-1/3">
                                    <div className="px-0 flex flex-row justify-between md:justify-normal items-center md:block">
                                        <h4 className="text-dark-gray text-lg font-bold">
                                            Current price
                                        </h4>
                                        <AuctionPrice />
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 pl-0">
                                    <div className="md:px-10 flex flex-row justify-between md:justify-normal md:block items-center">
                                        <div className=" w-full">
                                            <div className="flex items-center">
                                                <h4 className="text-dark-gray mb-0 md:mb-1 text-lg font-bold">
                                                    Price drops in
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="flex mt-1 font-bold">
                                            <Timer updateInterval={900000} onReset={() => console.log("Timer reset")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex flex-col">
                                <div className="w-full">
                                    <div className="flex flex-col space-y-10">
                                        <div className="space-y-2">
                                            <div className="col-lg-12">
                                                <div className="flex flex-col space-y-10">
                                                    <AuctionPriceRange />
                                                    <div className="w-[160px]">
                                                        <BuyNow nft={nounNFTMeta[0]} currMintPrice={currMintPrice} nftNo={0}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auction
