import { ethers, utils } from "ethers"
import { useAuction } from "@/context/AuctionContext.jsx"

export default function AuctionDetails() {
    const { currMintPrice, minMintPrice } = useAuction()

    return (
        <div className="w-fit md:w-full">
            <h2 className="text-[#1C2228] text-3xl font-['PT Sans']">
                Ξ
                {currMintPrice > minMintPrice
                    ? Number(
                          utils.formatEther(currMintPrice.toString())
                      ).toFixed(3)
                    : minMintPrice}
            </h2>
        </div>
    )
}
