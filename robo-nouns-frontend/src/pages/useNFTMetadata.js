import { useEffect, useState } from "react";
import { useAuction } from "../../src/context/AuctionContext";
import { ethers } from "ethers";
import { useContract, useContractRead } from "@thirdweb-dev/react";

export function useNFTMetadata() {
  const { addNounData, setMinMintPrice, setCurrMintPrice, setTargetMintPrice } = useAuction();
  const [roboNoun, setRoboNoun] = useState("");
  const { contract } = useContract("0x255414e3d2cf6D316776b5E1dD1e66925144232D");

  const nounData = async () => {
    try {
      const nounMeta = await contract?.call("fetchNextNoun");
      const newRoboNoun = nounMeta ? `data:image/svg+xml;base64,${nounMeta.svg}` : "";
      addNounData(nounMeta);
      setRoboNoun(newRoboNoun);
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
    }
  };

  const priceInfo = async () => {
    try {
      const currentPrice = await contract?.call("getCurrentVRGDAPrice");
      const minPrice = await contract?.call("reservePrice");
      const targetPrice = await contract?.call("targetPrice");
      const minMintPrice = minPrice ? ethers.utils.formatEther(minPrice) : "";
      const currMintPrice = currentPrice ? ethers.utils.formatEther(currentPrice) : "";
      const targetMintPrice = targetPrice ? ethers.utils.formatEther(targetPrice) : "";
      console.log('targetMintPrice', targetMintPrice);
      setMinMintPrice(minMintPrice);
      setCurrMintPrice(currMintPrice);
      setTargetMintPrice(targetMintPrice);
    } catch (error) {
      console.error("Error fetching price info:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nounData();
      priceInfo();
    }, 1000);

    return () => clearInterval(interval);
  }, [roboNoun, contract]);

  return roboNoun;
}
