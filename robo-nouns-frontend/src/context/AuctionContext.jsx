import { createContext, useContext, useEffect, useState } from "react"
import { useContract } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import deployments from "../../../robo-nouns-contracts/assets/deployments.json"
import newAbi from "./abi.json"

const AuctionContext = createContext()

export function useAuction() {
    return useContext(AuctionContext)
}

export function AuctionProvider({ children }) {
    let length = 4
    const [nouns, setNouns] = useState(Array.from({ length: 4 }, () => null))
    const [lastTokenBlock, setLastTokenBlock] = useState(0)
    const [globalStartTime, setGlobalStartTime] = useState(0)
    const [priceDecayInterval, setPriceDecayInterval] = useState(0)
    const [reservePrice, setReservePrice] = useState("")
    const [currMintPrice, setCurrMintPrice] = useState("")
    const [targetPrice, setTargetPrice] = useState("")
    const auctionContractAddress = deployments.RoboNounsVRGDA.address

    const providerUrl =
        "https://goerli.infura.io/v3/ec36f80cbd0e4bdd826ccb9e8f533a9d"
    const provider = new ethers.providers.JsonRpcProvider(providerUrl)

    const auctionContractABI = newAbi.abi
    const contract = new ethers.Contract(
        auctionContractAddress,
        auctionContractABI,
        provider
    )

    const fetchContractData = async () => {
        try {
            const lastTokenBlock = await contract.lastTokenBlock()
            setLastTokenBlock(lastTokenBlock.toNumber())

            const currVRGDAPrice = await contract.getCurrentVRGDAPrice()
            const maxPrice =
                reservePrice > currVRGDAPrice ? reservePrice : currVRGDAPrice
            setCurrMintPrice(ethers.utils.formatEther(maxPrice))

            const nounData = await contract.fetchNextNoun()

            if (
                nounData &&
                (!nouns[0] || nounData.blockNumber !== nouns[0].blockNumber)
            ) {
                let initialNouns = []
                for (let i = 1; i <= 3; i++) {
                    const noun = await contract.fetchNoun(
                        (nounData.blockNumber - i).toString()
                    )
                    initialNouns.push(noun || null)
                }
                setNouns([nounData, ...initialNouns])
            }
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
        const fetchInitialNouns = async () => {
            try {
                let initialNouns = []
                for (let i = 1; i <= 4; i++) {
                    const noun = await contract.fetchNoun(
                        (nouns[0]?.blockNumber - i).toString()
                    )
                    initialNouns.push(noun)
                }
                setNouns(initialNouns.reverse())
            } catch (error) {
                console.error("Error fetching initial nouns:", error)
            }
        }

        fetchInitialNouns()
    }, []) // Run this when nouns updates

    useEffect(() => {
        const interval = setInterval(() => {
            fetchContractData()
            console.log("currMintPrice", currMintPrice)
            console.log("reservePrice", reservePrice)
            console.log("lastTokenBlock", lastTokenBlock)
            console.log("currBlockNumber", nouns[0]?.blockNumber.toString())
        }, 1000)
        return () => clearInterval(interval)
    }, [fetchContractData])

    const auctionData = {
        auctionContractAddress,
        contract,
        lastTokenBlock,
        nouns,
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
