import { useAuction } from "@/context/AuctionContext";

export default function NounID() {
    const { nounNFTMeta } = useAuction();

	return (
		<div className="font-londrina">
			<h1 className="text-[#1C2228] text-7xl mt-2">
				Robo Noun {nounNFTMeta && nounNFTMeta[0].nounId.toNumber()}
			</h1>
		</div>
	);
}