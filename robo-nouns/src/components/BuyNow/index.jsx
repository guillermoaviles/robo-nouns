import {
    useContract
} from "@thirdweb-dev/react"
import { useEffect, useState } from "react"
const { ethers } = require("ethers")

export default function BuyNow({ nft, currMintPrice, nftNo }) {
    const [parentBlockHash, setParentBlockNumber] = useState("");
    const [parentBlockHashMinusOne, setParentBlockHashMinusOne] = useState("");
    const [parentBlockHashMinusTwo, setParentBlockHashMinusTwo] = useState("");
    const [parentBlockHashMinusThree, setParentBlockHashMinusThree] = useState("");
    let prtBlockHash

    if (nftNo === 0) {
        prtBlockHash = parentBlockHash
    } else if (nftNo === 1) {
        prtBlockHash = parentBlockHashMinusOne
    } else if (nftNo === 2) {
        prtBlockHash = parentBlockHashMinusTwo
    } else if (nftNo === 3) {
        prtBlockHash = parentBlockHashMinusThree
    } 
    console.log('nft', nft)
    console.log('parentBlockHash', parentBlockHash);
    console.log('parentBlockHashMinusOne', parentBlockHashMinusOne);
    console.log('parentBlockHashMinusTwo', parentBlockHashMinusTwo);
    console.log('parentBlockHashMinusThree', parentBlockHashMinusThree);
    const expNounID = nft?.nounId;
    const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-mumbai.g.alchemy.com/v2/SYsE_zQSuhVCH3bio3ltnI_a8Ze_wN94"
    )

    
    const { contract } = useContract(
        // "0xaF71644feEAf6439015D57631f59f8e0E0F91C67"  // lilnouns sandox Goerli contract address
        "0x073Fc7132FFb6f8FD1904B34F87943E46dF18139"
    )

    const call = async () => {
        try {
            if (!contract) {
                throw new Error("Contract is undefined")
            }
            console.log('expNounID', expNounID);
            console.log('parentBlockHash', prtBlockHash);
            const price = ethers.utils.parseEther("0.0001")
            const args = [expNounID, prtBlockHash]
            const tx = await contract.call("settleAuction", args, {
                value: price,
                gasLimit: 1000000,
            })
            console.info("settleAuction transaction sent:", tx.hash)

            const receipt = await tx.wait()
            console.info(
                "settleAuction transaction confirmed:",
                receipt.transactionHash
            )
        } catch (err) {
            console.error("contract call failure", err)
        }
    }

    useEffect(() => {
        const fetchParentBlocks = async () => {
            const parentBlock = await provider.getBlock("latest")
            setParentBlockNumber(parseInt(parentBlock.number))
            const parentBlockMinusOne = parentBlockHash - 1;
            setParentBlockHashMinusOne(parentBlockMinusOne)
            const parentBlockMinusTwo = parentBlockMinusOne - 1;
            setParentBlockHashMinusTwo(parentBlockMinusTwo)
            const parentBlockMinusThree = parentBlockMinusTwo - 1;
            setParentBlockHashMinusThree(parentBlockMinusThree)
        }
    
        const intervalId = setInterval(async () => {
            await fetchParentBlocks()
        }, 1000)
    
        return () => {
            clearInterval(intervalId)
        }
    }, [parentBlockHash])

    return (
        <div className="input-group">
            <button
                type="button"
                className="BuyBtn btn-primary hover:text-nouns-lime hover:scale-105"
                onClick={call}
            >
                Buy Now
            </button>
        </div>
    )
}
