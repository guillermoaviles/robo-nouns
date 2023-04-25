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
            <svg className="overflow-visible mx-auto" id="svg" width="160" height="60" viewBox="0, 0, 400,150">
                <a className="BuyBtn btn-primary hover:text-nouns-lime hover:scale-105 "
                    onClick={call} href="#">
                    <g id="svgg">
                        <path id="path0" d="M50.000 8.333 L 50.000 16.667 41.667 16.667 L 33.333 16.667 33.333 25.000 L 33.333 33.333 25.000 33.333 L 16.667 33.333 16.667 41.667 L 16.667 50.000 8.333 50.000 L 0.000 50.000 0.000 75.000 L 0.000 100.000 8.333 100.000 L 16.667 100.000 16.667 108.333 L 16.667 116.667 25.000 116.667 L 33.333 116.667 33.333 125.000 L 33.333 133.333 41.667 133.333 L 50.000 133.333 50.000 141.667 L 50.000 150.000 200.000 150.000 L 350.000 150.000 350.000 141.667 L 350.000 133.333 358.333 133.333 L 366.667 133.333 366.667 125.000 L 366.667 116.667 375.000 116.667 L 383.333 116.667 383.333 108.333 L 383.333 100.000 391.667 100.000 L 400.000 100.000 400.000 75.000 L 400.000 50.000 391.667 50.000 L 383.333 50.000 383.333 41.667 L 383.333 33.333 375.000 33.333 L 366.667 33.333 366.667 25.000 L 366.667 16.667 358.333 16.667 L 350.000 16.667 350.000 8.333 L 350.000 0.000 200.000 0.000 L 50.000 0.000 50.000 8.333 " stroke="none" fill="#000000" fill-rule="evenodd"></path>
                        <path id="path1" d="" stroke="none" fill="#080404" fill-rule="evenodd"></path>
                        <path id="path2" d="" stroke="none" fill="#080404" fill-rule="evenodd"></path>
                        <path id="path3" d="" stroke="none" fill="#080404" fill-rule="evenodd"></path>
                        <path id="path4" d="" stroke="none" fill="#080404" fill-rule="evenodd"></path>
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
            {/* <button
                type="button"
                className="BuyBtn btn-primary hover:text-nouns-lime hover:scale-105"
                onClick={call}
            >
                Buy Now
            </button> */}
        </div>
    )
}
