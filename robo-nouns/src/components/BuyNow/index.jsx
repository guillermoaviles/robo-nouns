import {
    useContract,
    useContractWrite,
    useContractRead,
} from "@thirdweb-dev/react"
import { useEffect, useState } from "react"
const { ethers } = require("ethers")

export default function BuyNow({ nft, currMintPrice, nftNo }) {
    const [parentBlockHash, setParentBlockHash] = useState("");
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
        "https://eth-goerli.g.alchemy.com/v2/BgA6XZL6TubsjQaFB0Yupu0yB6_oqDM8"
    )

    // lilnouns sandox Goerli contract address
    const { contract } = useContract(
        "0xaF71644feEAf6439015D57631f59f8e0E0F91C67"
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
            setParentBlockHash(ethers.utils.hexlify(parentBlock.hash))
            const parentBlockMinusOne = await provider.getBlock(parseInt(`${parentBlock?.number - 1}`))
            setParentBlockHashMinusOne(ethers.utils.hexlify(parentBlockMinusOne.hash))
            const parentBlockMinusTwo = await provider.getBlock(parseInt(`${parentBlock?.number - 2}`))
            setParentBlockHashMinusTwo(ethers.utils.hexlify(parentBlockMinusTwo.hash))
            const parentBlockMinusThree = await provider.getBlock(parseInt(`${parentBlock?.number - 3}`))
            setParentBlockHashMinusThree(ethers.utils.hexlify(parentBlockMinusThree.hash))
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
                className="Buy_bidBtn__O3Zyw btn btn-primary hover:bg-slate-800"
                onClick={call}
            >
                Buy Now
            </button>
        </div>
    )
}
