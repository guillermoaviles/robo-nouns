import { ethers, utils } from "ethers";
import { useAuction } from "@/context/AuctionContext.jsx";

export default function AuctionDetails() {
  const { currMintPrice, minMintPrice } = useAuction();

  const formatPrice = (price) => {
    if (price) {
      const parsedPrice = ethers.utils.parseEther(price.toString());
      const formattedPrice = utils.formatEther(parsedPrice);
      return Number(formattedPrice).toFixed(3);
    }
    return "";
  };

  return (
    <div className="w-fit md:w-full">
      <h2 className="text-[#1C2228] md:text-3xl font-['PT Sans']">
        Ξ
        {currMintPrice > minMintPrice
          ? formatPrice(currMintPrice)
          : minMintPrice}
      </h2>
    </div>
  );
}
