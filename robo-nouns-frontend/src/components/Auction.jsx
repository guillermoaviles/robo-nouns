import React from "react";
import moment from "moment";
import AuctionPrice from "./AuctionPrice";
import AuctionPriceRange from "./AuctionPriceRange";
import BuyNow from "./BuyNow";
import Timer from "./Timer";
import NounImg from "./NounImg";
import { useAuction } from "@/context/AuctionContext.jsx";

const Auction = () => {
  const { nounNFTMeta, currMintPrice } = useAuction();

  return (
    <div className="container mx-auto mt-2 pb-10">
      <div className="flex flex-col lg:flex-row items-center">
        <NounImg nounNFTMeta={nounNFTMeta} />
        <div className="w-full lg:w-1/2 lg:ml-6 mt-4 lg:mt-0">
          <div className="border-t-[#79809c49] p-4">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex items-center mb-2 lg:mb-0">
                <h4 className="text-dark-gray text-lg font-bold">Current price:</h4>
                <AuctionPrice />
              </div>
              <div className="flex items-center">
                <h4 className="text-dark-gray text-lg font-bold">Price drops in:</h4>
                <div className="ml-2">
                  <Timer
                    updateInterval={900000}
                    onReset={() => console.log("Timer reset")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col space-y-10">
              <AuctionPriceRange />
              <div className="w-[160px]">
                <BuyNow nft={nounNFTMeta[0]} currMintPrice={currMintPrice} nftNo={0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
