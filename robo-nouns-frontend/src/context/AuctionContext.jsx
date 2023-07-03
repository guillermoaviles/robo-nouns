import { createContext, useContext, useEffect, useState } from "react"
import { useContract } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import vrgdaAbi from "../utils/vrgdaAbi.json"

const AuctionContext = createContext()

export function useAuction() {
    return useContext(AuctionContext)
}

export function AuctionProvider({ children }) {
    let length = 4
    const [nounNFTMeta, setNounNFTMeta] = useState(
        Array.from({ length }, () => null)
    )
    const [lastTokenBlock, setLastTokenBlock] = useState(0)
    const [reservePrice, setReservePrice] = useState("")
    const [currMintPrice, setCurrMintPrice] = useState("")
    const [targetPrice, setTargetPrice] = useState("")

    const providerUrl =
        "https://eth-goerli.g.alchemy.com/v2/8kIFZ8iBRuBDAQqIH73BfPB8ESBwbIUt"
    const provider = new ethers.providers.JsonRpcProvider(providerUrl)

    const auctionContractAddress = "0x632385261472Aa60b429E00f1941dE2280935aA3"
    const auctionContractABI = vrgdaAbi.abi
    const contract = new ethers.Contract(
        auctionContractAddress,
        auctionContractABI,
        provider
    )

    const fetchNFTMetadata = async () => {
        try {
            const lastTokenBlock = await contract.lastTokenBlock()
            setLastTokenBlock(lastTokenBlock.toNumber())

            const nounMeta = await contract.fetchNextNoun()
            addNounData(nounMeta)

            const reservePrice = await contract.reservePrice()
            const currVRGDAPrice = await contract.getCurrentVRGDAPrice()
            const maxPrice = reservePrice.gt(currVRGDAPrice)
                ? reservePrice
                : currVRGDAPrice
            setCurrMintPrice(ethers.utils.formatEther(maxPrice))

            const targetPrice = await contract.targetPrice()
            setTargetPrice(ethers.utils.formatEther(targetPrice))
        } catch (error) {
            console.error("Error fetching NFT metadata and price info:", error)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchNFTMetadata()
            console.log(currMintPrice)
            console.log(reservePrice)
            console.log(lastTokenBlock)
        }, 1000)
        return () => clearInterval(interval)
    }, [nounNFTMeta])

    const addNounData = (newNoun) => {
        const isDuplicate = nounNFTMeta
            ? nounNFTMeta.some(
                  (noun) =>
                      noun &&
                      newNoun &&
                      noun.blockNumber &&
                      newNoun.blockNumber &&
                      noun.blockNumber.toNumber() ===
                          newNoun.blockNumber.toNumber()
              )
            : false
        if (!isDuplicate) {
            const updatedNounNFTMeta = [newNoun, ...nounNFTMeta]
            if (updatedNounNFTMeta.length > length) {
                updatedNounNFTMeta.pop()
            }
            setNounNFTMeta(updatedNounNFTMeta)
        }
    }

    const auctionData = {
        contract,
        lastTokenBlock,
        nounNFTMeta,
        setNounNFTMeta,
        reservePrice,
        currMintPrice,
        targetPrice,
    }

    return (
        <AuctionContext.Provider value={auctionData}>
            {children}
        </AuctionContext.Provider>
    )
}
