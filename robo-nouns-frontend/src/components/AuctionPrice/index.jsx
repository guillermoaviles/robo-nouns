import { useContract, useContractRead } from "@thirdweb-dev/react"
import { ethers, utils } from "ethers"
import { useAuction } from "@/context/AuctionContext.jsx"
import { useEffect } from "react"

export default function AuctionDetails() {
    const { setMinMintPrice, setCurrMintPrice, setTargetMintPrice } =
        useAuction()

    const { contract } = useContract(
        "0xaF71644feEAf6439015D57631f59f8e0E0F91C67"
    )
    const { data: currentPrice, isLoading: loadingCurr } = useContractRead(
        contract,
        "getCurrentVRGDAPrice"
    )
    const { data: minPrice, isLoading: loadingMin } = useContractRead(
        contract,
        "reservePrice"
    )
    const { data: targetPrice, isLoading: loadingTarget } = useContractRead(
        contract,
        "targetPrice"
    )
    const minMintPrice = loadingMin ? "" : ethers.utils.formatEther(minPrice)
    const currMintPrice = loadingCurr ? "" : ethers.utils.formatEther(currentPrice)
    const targetMintPrice = loadingTarget ? "" : ethers.utils.formatEther(targetPrice)
    console.log('currMintPrice', currMintPrice)

    useEffect(() => {
        setMinMintPrice(minMintPrice)
        setCurrMintPrice(currMintPrice)
        setTargetMintPrice(targetMintPrice)
    }, [minMintPrice, currMintPrice, targetMintPrice])

    return (
        <div className="w-fit md:w-full">
            <h2 className="text-[#1C2228] text-3xl font-['PT Sans']">
                Ξ
                {currMintPrice > minMintPrice
                    ? Number(
                          utils.formatEther(currVRGDAPrice.toString())
                      ).toFixed(3)
                    : minMintPrice}
            </h2>
        </div>
    )
}
