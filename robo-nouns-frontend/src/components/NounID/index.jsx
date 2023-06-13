import { useContract, useContractRead } from "@thirdweb-dev/react";

export default function NounID() {
	const { contract } = useContract(
		"0x87f9088D7341cDbd28B0Cda390B31C3c5FD9412F"
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
