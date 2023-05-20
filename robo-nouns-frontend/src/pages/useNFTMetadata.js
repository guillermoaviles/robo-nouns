import { useEffect, useState } from "react";
import { useAuction } from "../../context/AuctionContext";
import { ethers } from "ethers";
import addresses from "../../utils/addresses.json";

const contractAddress = "0xA75E74a5109Ed8221070142D15cEBfFe9642F489";
const contractAbi = addresses.RoboNounsVRGDA.abi;

export function useNFTMetadata() {
  const { addNounData } = useAuction();
  const [roboNoun, setRoboNoun] = useState("");

  useEffect(() => {
    async function fetchNFTMetadata() {
      const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      
      const nounMeta = await contract.fetchNextNoun();
      const newRoboNoun = nounMeta
        ? `data:image/svg+xml;base64,${nounMeta.svg}`
        : "";
      
      setRoboNoun(newRoboNoun);
      addNounData(nounMeta);
    }

    const interval = setInterval(fetchNFTMetadata, 1000);
    return () => clearInterval(interval);
  }, [addNounData]);

  return roboNoun;
}
