import { useAuction } from "@/context/AuctionContext.jsx"

export default function AuctionDetails() {
    const { currMintPrice } = useAuction()

    return (
        <div className="w-fit md:w-full">
            <h2 className="text-[#1C2228] md:text-3xl font-['PT Sans']">
                Ξ{currMintPrice || "0.00"}
            </h2>
        </div>
    )
}
