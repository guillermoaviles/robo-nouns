import { useEffect, useState } from "react";
import { useAuction } from "../../src/context/AuctionContext";
import { ethers } from "ethers";
import addresses from "../../src/utils/addresses.json";

const contractAddress = "0xA75E74a5109Ed8221070142D15cEBfFe9642F489";
const contractAbi = addresses.RoboNounsVRGDA.abi;

export function useNFTMetadata() {
    const { addNounData, 
            setMinMintPrice, 
            setCurrMintPrice, 
            setTargetMintPrice 
        } = useAuction();
        
    const [roboNoun, setRoboNoun] = useState("");

    useEffect(() => {
        async function fetchNFTMetadata() {
            const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);

            const nounMeta = await contract.fetchNextNoun();
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
            const newRoboNoun = nounMeta
                ? `data:image/svg+xml;base64,${nounMeta.svg}`
                : "";

            setRoboNoun(newRoboNoun);
            addNounData(nounMeta);
            setMinMintPrice(minMintPrice)
            setCurrMintPrice(currMintPrice)
            setTargetMintPrice(targetMintPrice)
        }

        const interval = setInterval(fetchNFTMetadata, 1000);
        return () => clearInterval(interval);
    }, [addNounData, setMinMintPrice, setCurrMintPrice, setTargetMintPrice ]);

    return roboNoun;
}
