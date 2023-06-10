import { useContract, useContractRead } from "@thirdweb-dev/react";

export default function NounID() {
	const { contract } = useContract(
		"0x402CF8456F05D111ABEe84F4209334Ba37729479"
	);
	const { data: nextNoun } = useContractRead(contract, "fetchNextNoun");

	return (
		<div className="font-londrina">
			<h1 className="text-[#1C2228] text-7xl mt-2">
				Robo Noun {nextNoun && nextNoun.nounId.toNumber()}
			</h1>
		</div>
	);
}
