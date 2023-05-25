import { useEffect, useState } from "react";
import { useAuction } from "../../src/context/AuctionContext";
import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";

const sdk = new ThirdwebSDK("mumbai");

export function useNFTMetadata() {
  const { addNounData, setMinMintPrice, setCurrMintPrice, setTargetMintPrice } = useAuction();
  const [roboNoun, setRoboNoun] = useState("");

  useEffect(() => {
    async function fetchNFTMetadata() {
      try {
        if (!sdk.isConnected()) {
          await sdk.connect(); // Connect to the network if not already connected
        }

        const contract = await sdk.getContract("0x255414e3d2cf6D316776b5E1dD1e66925144232D");
        const nounMeta = await contract.call("fetchNextNoun");
        const currentPrice = await contract.call("getCurrentVRGDAPrice");
        const minPrice = await contract.call("reservePrice");
        const targetPrice = await contract.call("targetPrice");
        const minMintPrice = ethers.utils.formatEther(minPrice);
        const currMintPrice = ethers.utils.formatEther(currentPrice);
        const targetMintPrice = ethers.utils.formatEther(targetPrice);

        const newRoboNoun = nounMeta ? `data:image/svg+xml;base64,${nounMeta.svg}` : "";
        setRoboNoun(newRoboNoun);
        addNounData(nounMeta);
        setMinMintPrice(minMintPrice);
        setCurrMintPrice(currMintPrice);
        setTargetMintPrice(targetMintPrice);
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
      }
    }

    const interval = setInterval(fetchNFTMetadata, 1000);
    return () => clearInterval(interval);
  }, [addNounData, setMinMintPrice, setCurrMintPrice, setTargetMintPrice]);

  return roboNoun;
}
