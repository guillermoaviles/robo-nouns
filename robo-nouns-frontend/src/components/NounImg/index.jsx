import { useContract, useContractRead } from "@thirdweb-dev/react"
import { ethers } from 'ethers';
import Image from "next/image"
import { useState, useEffect } from "react"
import { useAuction } from "../../context/AuctionContext"
import addresses from "../../utils/addresses.json"

export default function NounImg() {
    const { contract } = useContract(
        // "0xaF71644feEAf6439015D57631f59f8e0E0F91C67"  // old contract
        // "0x073Fc7132FFb6f8FD1904B34F87943E46dF18139"  // old
        "0xA75E74a5109Ed8221070142D15cEBfFe9642F489"
    )
    const [roboNoun, setRoboNoun] = useState("")
    const { addNounData, nounNFTMeta } = useAuction()
    const contractAddress = '0xA75E74a5109Ed8221070142D15cEBfFe9642F489';
    const contractAbi = addresses.RoboNounsVRGDA.abi;
    console.log('contractAbi', contractAbi);

    const provider = new ethers.providers.JsonRpcProvider(
        // "https://polygon-mumbai.g.alchemy.com/v2/SYsE_zQSuhVCH3bio3ltnI_a8Ze_wN94"  // Polygon Mumbai
        "http://localhost:8545"

    )
    const signer = provider.getSigner();

    const nounData = async () => {
        // const nounMeta = await contract?.call("fetchNextNoun")
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        const nounMeta = await contract.fetchNextNoun();
        const newRoboNoun = nounMeta
            ? `data:image/svg+xml;base64,${nounMeta.svg}`
            : ""
        console.log('nounMeta', nounMeta);
        setRoboNoun(newRoboNoun)
        addNounData(nounMeta)
        // AuctionContext.setValue(nounMeta); // push new original data to AuctionContext
    }

    useEffect(() => {
        const interval = setInterval(() => {
            nounData()
        }, 1000)

        return () => clearInterval(interval)
    }, [roboNoun, contract])

    return (
        <div className="flex w-full lg:w-1/2">
            <div className="w-full relative">
                <div className="md:h-0 w-full">
                    <Image
                        src={roboNoun}
                        alt="Noun Image"
                        className="md:absolute top-0 left-0 w-full md:h-full"
                        width={300}
                        height={300}
                    />
                </div>
            </div>
        </div>
    )
}
