import { createContext, useContext, useEffect, useState } from "react"
import { useContract } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import deployments from "../../../robo-nouns-contracts/assets/deployments.json"

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
    const [globalStartTime, setGlobalStartTime] = useState(0)
    const [priceDecayInterval, setPriceDecayInterval] = useState(0)
    const [reservePrice, setReservePrice] = useState("")
    const [currMintPrice, setCurrMintPrice] = useState("")
    const [targetPrice, setTargetPrice] = useState("")
    const auctionContractAddress = deployments.RoboNounsVRGDA.address

    const providerUrl =
        "https://eth-goerli.g.alchemy.com/v2/8kIFZ8iBRuBDAQqIH73BfPB8ESBwbIUt"
    const provider = new ethers.providers.JsonRpcProvider(providerUrl)

    const auctionContractABI = deployments.RoboNounsVRGDA.abi
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

            const currVRGDAPrice = await contract.getCurrentVRGDAPrice()
            const maxPrice =
                reservePrice > currVRGDAPrice ? reservePrice : currVRGDAPrice
            setCurrMintPrice(ethers.utils.formatEther(maxPrice))
        } catch (error) {
            console.error("Error fetching NFT metadata and price info:", error)
        }
    }

    useEffect(() => {
        // this only need to run once - these values are constant
        const setInitialValues = async () => {
            const startTime = await contract.startTime()
            setGlobalStartTime(startTime.toNumber())

            const priceDecayInterval = await contract.priceDecayInterval()
            setPriceDecayInterval(priceDecayInterval.toNumber())

            const reservePrice = await contract.reservePrice()
            setReservePrice(ethers.utils.formatEther(reservePrice))

            const targetPrice = await contract.targetPrice()
            setTargetPrice(ethers.utils.formatEther(targetPrice))
        }

        setInitialValues()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            fetchNFTMetadata()
            console.log("currMintPrice", currMintPrice)
            console.log("reservePrice", reservePrice)
            console.log("lastTokenBlock", lastTokenBlock)
            console.log(
                "currBlockNumber",
                nounNFTMeta[0]?.blockNumber.toNumber()
            )
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
        auctionContractAddress,
        contract,
        lastTokenBlock,
        nounNFTMeta,
        setNounNFTMeta,
        reservePrice,
        globalStartTime,
        priceDecayInterval,
        currMintPrice,
        targetPrice,
    }

    return (
        <AuctionContext.Provider value={auctionData}>
            {children}
        </AuctionContext.Provider>
    )
}
