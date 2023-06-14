import { useContract, useContractRead } from "@thirdweb-dev/react";

export default function NounID() {
	const { contract } = useContract(
		"0xE867f3E7e85f25385DA2355c73271426a5aCc193"
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
