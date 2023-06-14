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

	const providerUrl =
		"https://eth-goerli.g.alchemy.com/v2/8kIFZ8iBRuBDAQqIH73BfPB8ESBwbIUt";
	const provider = new ethers.providers.JsonRpcProvider(providerUrl);

	const auctionContractAddress = "0xE867f3E7e85f25385DA2355c73271426a5aCc193";

	const auctionContractABI = JSON.parse(
		'[{"inputs":[{"internalType":"uint256","name":"_reservePrice","type":"uint256"},{"internalType":"int256","name":"_targetPrice","type":"int256"},{"internalType":"int256","name":"_priceDecayPercent","type":"int256"},{"internalType":"int256","name":"_perTimeUnit","type":"int256"},{"internalType":"uint256","name":"_updateInterval","type":"uint256"},{"internalType":"address","name":"_token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"perTimeUnit","type":"uint256"}],"name":"AuctionPerTimeUnitUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"int256","name":"priceDecayPercent","type":"int256"}],"name":"AuctionPriceDecayPercentUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reservePrice","type":"uint256"}],"name":"AuctionReservePriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AuctionSettled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"int256","name":"targetPrice","type":"int256"}],"name":"AuctionTargetPriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"updateInterval","type":"uint256"}],"name":"AuctionUpdateIntervalUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"uint256","name":"expectedBlockNumber","type":"uint256"}],"name":"buyNow","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"decayConstant","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fetchNextNoun","outputs":[{"internalType":"uint256","name":"nounId","type":"uint256"},{"components":[{"internalType":"uint48","name":"background","type":"uint48"},{"internalType":"uint48","name":"body","type":"uint48"},{"internalType":"uint48","name":"accessory","type":"uint48"},{"internalType":"uint48","name":"head","type":"uint48"},{"internalType":"uint48","name":"glasses","type":"uint48"}],"internalType":"struct INounsSeeder.Seed","name":"seed","type":"tuple"},{"internalType":"string","name":"svg","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentVRGDAPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastTokenBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nounsDAO","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"perTimeUnit","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reservePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"roboNounsToken","outputs":[{"internalType":"contract RoboNounsToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_perTimeUnit","type":"uint256"}],"name":"setPerTimeUnit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"_priceDecayPercent","type":"int256"}],"name":"setPriceDecayPercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reservePrice","type":"uint256"}],"name":"setReservePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"_targetPrice","type":"int256"}],"name":"setTargetPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_updateInterval","type":"uint256"}],"name":"setUpdateInterval","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"targetPrice","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"updateInterval","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
	);

	const contract = new ethers.Contract(
		auctionContractAddress,
		auctionContractABI,
		provider
	);

	const fetchNFTMetadata = async () => {
		try {
			const nounMeta = await contract.fetchNextNoun();
			addNounData(nounMeta);

			const currentPrice = await contract.getCurrentVRGDAPrice();
			const minPrice = await contract.reservePrice();
			const targetPrice = await contract.targetPrice();
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
