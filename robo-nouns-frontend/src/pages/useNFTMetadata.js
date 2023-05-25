import { useEffect, useState } from "react";
import { useAuction } from "../../src/context/AuctionContext";
import { ethers } from "ethers";
import { useContract, useContractRead } from "@thirdweb-dev/react";

export function useNFTMetadata() {
    const { addNounData, setMinMintPrice, setCurrMintPrice, setTargetMintPrice } = useAuction();
    const [roboNoun, setRoboNoun] = useState("");
    const { contract } = useContract("0x255414e3d2cf6D316776b5E1dD1e66925144232D");

    const nounData = async () => {
        const nounMeta = await contract?.call("fetchNextNoun")
        const newRoboNoun = nounMeta ? `data:image/svg+xml;base64,${nounMeta.svg}` : "";
        addNounData(nounMeta);
        setRoboNoun(newRoboNoun);
    }

    const priceInfo = async () => {
        const currentPrice = await contract?.call("getCurrentVRGDAPrice");
        const minPrice = await contract?.call("reservePrice");
        const targetPrice = await contract?.call("targetPrice");
        const minMintPrice = ethers.utils.formatEther(minPrice);
        const currMintPrice = ethers.utils.formatEther(currentPrice);
        const targetMintPrice = ethers.utils.formatEther(targetPrice);
        setMinMintPrice(minMintPrice);
        setCurrMintPrice(currMintPrice);
        setTargetMintPrice(targetMintPrice);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            nounData()
            priceInfo()
        }, 1000);

        return () => clearInterval(interval);
    }, [roboNoun, contract]);

    return roboNoun;
}
