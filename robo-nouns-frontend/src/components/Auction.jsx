import React, { useState, useEffect } from "react"
import moment from "moment"
import AuctionPrice from "./AuctionPrice"
import AuctionPriceRange from "./AuctionPriceRange"
import BuyNow from "./BuyNow"
import Timer from "./Timer"
import NounImg from "./NounImg"
import { useAuction } from "@/context/AuctionContext.jsx"

const Auction = () => {
    const { nounNFTMeta, currMintPrice } = useAuction()
    const [flexDirection, setFlexDirection] = useState("row")

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1040) {
                setFlexDirection("column")
            } else {
                setFlexDirection("row")
            }
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <div className="bg-nouns-lime mx-auto mt-2">
            <div className="flex flex-wrap justify-center">
                <div className="flex md:w-full lg:w-1/2">
                    <NounImg />
                </div>
                <div
                    className={`flex xlg:w-1/2 xlg:bg-nouns-lime items-center pt-6 md:pt-0 pb-0 md:min-h-[520px] md:min-w-[520px] ${
                        flexDirection === "column" ? "bg-dark-gray w-full" : ""
                    }`}
                    style={{
                        flexDirection: flexDirection,
                    }}
                >
                    <div>
                        <div className="mb-2">
                            <div className="flex flex-col mb-0">
                                <div className="w-full">
                                    <div className="w-auto">
                                        <h4
                                            className={`text-dark-gray mt-1 text-lg font-bold ${
                                                flexDirection === "column"
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                        >
                                            {moment().format("MMMM Do, YYYY")}
                                        </h4>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="font-press">
                                        <h1
                                            className={`text-dark-gray text-2xl md:text-4xl mt-2 ${
                                                flexDirection === "column"
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                        >
                                            Robo Noun{" "}
                                            {nounNFTMeta[0]?.nounId?.toNumber() ||
                                                "0"}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row mb-0">
                                <div className="border-r-[#79809c49] w-full lg:w-1/3">
                                    <div className="px-0 flex flex-row justify-between md:justify-normal items-center md:block">
                                        <h4
                                            className={`text-dark-gray text-lg font-bold ${
                                                flexDirection === "column"
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                        >
                                            Current price
                                        </h4>
                                        <AuctionPrice />
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 pl-0">
                                    <div className="md:px-10 flex flex-row justify-between md:justify-normal md:block items-center">
                                        <div className=" w-full">
                                            <div className="flex items-center">
                                                <h4
                                                    className={`text-dark-gray mb-0 md:mb-1 text-lg font-bold ${
                                                        flexDirection ===
                                                        "column"
                                                            ? "text-white"
                                                            : ""
                                                    }`}
                                                >
                                                    Price drops in
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="flex mt-1 font-bold">
                                            <Timer
                                                updateInterval={900000}
                                                onReset={() =>
                                                    console.log("Timer reset")
                                                }
                                            />
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
                                                        <BuyNow
                                                            nft={nounNFTMeta[0]}
                                                            currMintPrice={
                                                                currMintPrice
                                                            }
                                                            nftNo={0}
                                                        />
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
