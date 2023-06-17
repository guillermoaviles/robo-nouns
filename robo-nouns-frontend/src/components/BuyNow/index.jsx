import { useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function BuyNow({ nft, currMintPrice, nftNo }) {
	const [loading, setLoading] = useState(false);

	const { contract } = useContract(
		"0xC78A732E2f0f48B32aE26EFD2d39c6c9328ccDb5"
	);

	const call = async () => {
		setLoading(true);

		try {
			if (!contract) {
				throw new Error("Contract is undefined");
			}

			const args = [ethers.BigNumber.from(nft.blockNumber).toString()];
			const currMintPriceBigNumber = ethers.utils.parseEther(currMintPrice);
			const tx = await contract.call("buyNow", args, {
				value: currMintPriceBigNumber,
				gasLimit: 1000000,
			});

			console.info("settleAuction transaction sent:", tx.hash);
		} catch (err) {
			console.error("contract call failure", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="input-group">
			<svg
				className="cursor-pointer overflow-visible mx-auto"
				id="svg"
				width="160"
				height="60"
				viewBox="0, 0, 400,150">
				<a
					className="BuyBtn btn-primary hover:text-nouns-lime hover:scale-105 "
					onClick={call}>
					<g id="svgg">
						<path
							id="path0"
							d="M50.000 8.333 L 50.000 16.667 41.667 16.667 L 33.333 16.667 33.333 25.000 L 33.333 33.333 25.000 33.333 L 16.667 33.333 16.667 41.667 L 16.667 50.000 8.333 50.000 L 0.000 50.000 0.000 75.000 L 0.000 100.000 8.333 100.000 L 16.667 100.000 16.667 108.333 L 16.667 116.667 25.000 116.667 L 33.333 116.667 33.333 125.000 L 33.333 133.333 41.667 133.333 L 50.000 133.333 50.000 141.667 L 50.000 150.000 200.000 150.000 L 350.000 150.000 350.000 141.667 L 350.000 133.333 358.333 133.333 L 366.667 133.333 366.667 125.000 L 366.667 116.667 375.000 116.667 L 383.333 116.667 383.333 108.333 L 383.333 100.000 391.667 100.000 L 400.000 100.000 400.000 75.000 L 400.000 50.000 391.667 50.000 L 383.333 50.000 383.333 41.667 L 383.333 33.333 375.000 33.333 L 366.667 33.333 366.667 25.000 L 366.667 16.667 358.333 16.667 L 350.000 16.667 350.000 8.333 L 350.000 0.000 200.000 0.000 L 50.000 0.000 50.000 8.333 "
							stroke="none"
							fill="#000000"
							fill-rule="evenodd"></path>
						<path
							id="path1"
							d=""
							stroke="none"
							fill="#080404"
							fill-rule="evenodd"></path>
						<path
							id="path2"
							d=""
							stroke="none"
							fill="#080404"
							fill-rule="evenodd"></path>
						<path
							id="path3"
							d=""
							stroke="none"
							fill="#080404"
							fill-rule="evenodd"></path>
						<path
							id="path4"
							d=""
							stroke="none"
							fill="#080404"
							fill-rule="evenodd"></path>
						<text
							className="font-press text-4xl"
							x="205"
							y="78"
							fill="#FFFFFF"
							text-anchor="middle"
							alignment-baseline="middle">
							Buy Now
						</text>
					</g>
				</a>
			</svg>
		</div>
	);
}
