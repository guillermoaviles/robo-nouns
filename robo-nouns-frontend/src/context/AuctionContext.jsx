import { createContext, useContext, useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import vrgdaAbi from "../utils/vrgdaAbi.json"

const AuctionContext = createContext();

export function useAuction() {
  return useContext(AuctionContext);
}

export function AuctionProvider({ children }) {
  const [nounNFTMeta, setNounNFTMeta] = useState([]);
  const [reservePrice, setReservePrice] = useState("");
  const [currMintPrice, setCurrMintPrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  //   const { contract } = useContract(
  //     "0xC78A732E2f0f48B32aE26EFD2d39c6c9328ccDb5"
  //   );

  const providerUrl =
    "https://eth-goerli.g.alchemy.com/v2/8kIFZ8iBRuBDAQqIH73BfPB8ESBwbIUt";
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  const auctionContractAddress = "0xC78A732E2f0f48B32aE26EFD2d39c6c9328ccDb5";

  const auctionContractABI = vrgdaAbi.abi;

  const contract = new ethers.Contract(
    auctionContractAddress,
    auctionContractABI,
    provider
  );

  const fetchNFTMetadata = async () => {
    try {
      //   const nounMeta = await contract?.call("fetchNextNoun");
      const nounMeta = await contract.fetchNextNoun();
      addNounData(nounMeta);

      // setReservePrice
      // const resPrice = await contract?.call("reservePrice");
      const resPrice = await contract.reservePrice();
      setReservePrice(resPrice ? ethers.utils.formatEther(resPrice) : "");

      // setCurrMintPrice
      // const currVRGDAPrice = await contract?.call("getCurrentVRGDAPrice");
      const currVRGDAPrice = await contract.getCurrentVRGDAPrice();
      const currentVRGDAPrice = currVRGDAPrice
        ? ethers.utils.formatEther(currVRGDAPrice)
        : "";

      if (currentVRGDAPrice < reservePrice) {
        setCurrMintPrice(reservePrice);
      } else {
        setCurrMintPrice(currentVRGDAPrice);
      }

      // setTargetMintPrice
      // const tgtPrice = await contract?.call("targetPrice");
      const tgtPrice = await contract.targetPrice();
      setTargetPrice(tgtPrice ? ethers.utils.formatEther(tgtPrice) : "");
    } catch (error) {
      console.error("Error fetching NFT metadata and price info:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNFTMetadata();
    //   console.log("currMintPrice", currMintPrice);
    //   console.log("reservePrice", reservePrice);
    }, 1000);
    return () => clearInterval(interval);
  }, [nounNFTMeta, contract]);

  const addNounData = (newNoun) => {
    // console.log("newNoun", newNoun);
    const isDuplicate = nounNFTMeta
      ? nounNFTMeta.some(
          (noun) =>
            noun?.blockNumber.toNumber() === newNoun?.blockNumber.toNumber()
        )
      : false;
    if (!isDuplicate) {
      const updatedNounNFTMeta = [newNoun, ...nounNFTMeta];
      if (updatedNounNFTMeta.length > 4) {
        updatedNounNFTMeta.pop();
      }
      setNounNFTMeta(updatedNounNFTMeta);
    }
  };

  const value = {
    addNounData,
    nounNFTMeta,
    setNounNFTMeta,
    reservePrice,
    setReservePrice,
    currMintPrice,
    setCurrMintPrice,
    targetPrice,
    setTargetPrice,
  };

  return (
    <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
  );
}
