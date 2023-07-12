import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import deployments from "../../../robo-nouns-contracts/assets/deployments.json";
import newAbi from "./abi.json";

const AuctionContext = createContext();

export function useAuction() {
  return useContext(AuctionContext);
}

export function AuctionProvider({ children }) {
  const length = 4;
  const [auctionData, setAuctionData] = useState({
    nounOne: null,
    nounTwo: null,
    nounThree: null,
    nounFour: null,
    lastTokenBlock: 0,
    globalStartTime: 0,
    priceDecayInterval: 0,
    reservePrice: "",
    currMintPrice: "",
    targetPrice: ""
  });

  const auctionContractAddress = deployments.RoboNounsVRGDA.address;
  const providerUrl =
    "https://eth-goerli.g.alchemy.com/v2/8kIFZ8iBRuBDAQqIH73BfPB8ESBwbIUt";
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const auctionContractABI = newAbi.abi;
  const contract = new ethers.Contract(
    auctionContractAddress,
    auctionContractABI,
    provider
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastTokenBlock = await contract.lastTokenBlock();
        const nounOne = await contract.fetchNextNoun();
        const nounTwo = nounOne ? await contract.fetchNoun(nounOne.blockNumber.toNumber() - 1) : null;
        const nounThree = nounOne ? await contract.fetchNoun(nounOne.blockNumber.toNumber() - 2) : null;
        const nounFour = nounOne ? await contract.fetchNoun(nounOne.blockNumber.toNumber() - 3) : null;
        const currVRGDAPrice = await contract.getCurrentVRGDAPrice();
        const startTime = await contract.startTime();
        const priceDecayInterval = await contract.priceDecayInterval();
        const reservePrice = await contract.reservePrice();
        const targetPrice = await contract.targetPrice();

        setAuctionData({
          nounOne,
          nounTwo,
          nounThree,
          nounFour,
          lastTokenBlock: lastTokenBlock.toNumber(),
          globalStartTime: startTime.toNumber(),
          priceDecayInterval: priceDecayInterval.toNumber(),
          reservePrice: ethers.utils.formatEther(reservePrice),
          currMintPrice: ethers.utils.formatEther(
            reservePrice > currVRGDAPrice ? reservePrice : currVRGDAPrice
          ),
          targetPrice: ethers.utils.formatEther(targetPrice)
        });
      } catch (error) {
        console.error("Error fetching NFT metadata and price info:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuctionContext.Provider value={auctionData}>
      {children}
    </AuctionContext.Provider>
  );
}
