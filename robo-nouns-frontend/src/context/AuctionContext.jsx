import { createContext, useContext, useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const AuctionContext = createContext();

export function useAuction() {
	return useContext(AuctionContext);
}

export function AuctionProvider({ children }) {
	const [nounNFTMeta, setNounNFTMeta] = useState([]);
	const [minMintPrice, setMinMintPrice] = useState("");
	const [currMintPrice, setCurrMintPrice] = useState("");
	const [targetMintPrice, setTargetMintPrice] = useState("");

	const { contract } = useContract(
		"0x402CF8456F05D111ABEe84F4209334Ba37729479"
	);

	const fetchNFTMetadata = async () => {
		try {
			const nounMeta = await contract?.call("fetchNextNoun");
			const newRoboNoun = nounMeta
				? `data:image/svg+xml;base64,${nounMeta.svg}`
				: "";
			addNounData(nounMeta);

			const currentPrice = await contract?.call("getCurrentVRGDAPrice");
			const minPrice = await contract?.call("reservePrice");
			const targetPrice = await contract?.call("targetPrice");
			const minMintPrice = minPrice ? ethers.utils.formatEther(minPrice) : "";
			const currMintPrice = currentPrice
				? ethers.utils.formatEther(currentPrice)
				: "";
			const targetMintPrice = targetPrice
				? ethers.utils.formatEther(targetPrice)
				: "";

			setMinMintPrice(minMintPrice);
			setCurrMintPrice(currMintPrice);
			setTargetMintPrice(targetMintPrice);
		} catch (error) {
			console.error("Error fetching NFT metadata and price info:", error);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			fetchNFTMetadata();
		}, 1000);
		return () => clearInterval(interval);
	}, [nounNFTMeta, contract]);

	const addNounData = (newNoun) => {
		const isDuplicate = nounNFTMeta
			? nounNFTMeta.some((noun) => noun?.hash === newNoun?.hash)
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
		minMintPrice,
		setMinMintPrice,
		currMintPrice,
		setCurrMintPrice,
		targetMintPrice,
		setTargetMintPrice,
	};

	return (
		<AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
	);
}
