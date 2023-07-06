import React from "react"
import { useAuction } from "@/context/AuctionContext.jsx"

const PriceBlock: React.FC<{
    bgColor: string
    isActive: boolean
}> = (props) => {
    const { bgColor, isActive } = props
    return (
        <>
            <div
                style={{
                    border: isActive ? "2px solid #000" : "none",
                }}
                className={`md:w-[30px] md:h-[30px] w-[21px] h-[21px] ${bgColor}`}
            ></div>
        </>
    )
}

export default function AuctionPriceRange() {
    const { reservePrice, currMintPrice, targetPrice } = useAuction()

    const maxPrice = targetPrice * 2
    const numPriceBlocks = 15
    const currMintPricePercentage = parseFloat(currMintPrice) / maxPrice
    const activeIndex = Math.floor(currMintPricePercentage * numPriceBlocks)

    const colorsClassNames = [
        "bg-[#FF638D]",
        "bg-[#FF638D]",
        "bg-[#FF638D]",
        "bg-[#FF9564]",
        "bg-[#FFB946]",
        "bg-[#FFCB37]",
        "bg-[#FFEF17]",
        "bg-[#FFEF17]",
        "bg-[#FFEF17]",
        "bg-[#C6D254]",
        "bg-[#8FB78E]",
        "bg-[#5D9DC3]",
        "bg-[#2B83F6]",
        "bg-[#2B83F6]",
        "bg-[#2B83F6]",
    ]

    return (
        <>
            <div className="inline-block relative w-full">
                <div className="flex lg:justify-between justify-start lg:space-x-0 md:space-x-32 space-x-24 text-dark-gray">
                    <h4 className="text-base -mb-2">
                        Ξ{reservePrice || "0.00"}
                    </h4>
                    <h4 className="text-base -mb-2">Ξ{targetPrice || ""}</h4>
                    <h4 className="text-base -mb-2">Ξ{maxPrice || "0.00"}</h4>
                </div>
                <div className="flex flex-row items-center justify-start space-x-[3.7px] mt-[12px]">
                    {colorsClassNames.map((color, index) => {
                        return (
                            <PriceBlock
                                bgColor={color}
                                key={index}
                                isActive={index === activeIndex}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}
