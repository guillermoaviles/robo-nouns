import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react"
import { useContract } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import deployments from "../../../robo-nouns-contracts/assets/deployments.json"
import newAbi from "./abi.json"

const AuctionContext = createContext()

export function useAuction() {
    return useContext(AuctionContext)
}

export function AuctionProvider({ children }) {
    const [nouns, setNouns] = useState(Array.from({ length: 4 }, () => null))
    const [lastTokenBlock, setLastTokenBlock] = useState(0)
    const [globalStartTime, setGlobalStartTime] = useState(0)
    const [priceDecayInterval, setPriceDecayInterval] = useState(0)
    const [reservePrice, setReservePrice] = useState("")
    const [currMintPrice, setCurrMintPrice] = useState("")
    const [targetPrice, setTargetPrice] = useState("")
    const [initialFetchComplete, setInitialFetchComplete] = useState(false)

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

    const fetchContractData = useCallback(async () => {
        try {
            const nextNounData = await contract.fetchNextNoun()

            // TODO: write a better check so newly fetched noun doesn't overwrite all the existing ones
            // Add a check whether the fetched noun already exists in the array
            if (
                nouns[0] === null ||
                (nextNounData.blockNumber !== nouns[0].blockNumber &&
                    !nouns.some(
                        (noun) =>
                            noun &&
                            noun.blockNumber === nextNounData.blockNumber
                    ))
            ) {
                setNouns((prevNouns) => [
                    nextNounData,
                    ...prevNouns.slice(0, 3),
                ])
            }
        } catch (error) {
            console.error("Error fetching NFT metadata and price info:", error)
        }
    }, [contract, nouns])

    // loading new state after minting
    useEffect(() => {
        const fetchNewAuctionState = async () => {
            const lastTokenBlock = await contract.lastTokenBlock()
            setLastTokenBlock(lastTokenBlock.toNumber())

            const currVRGDAPrice = await contract.getCurrentVRGDAPrice()
            const maxPrice =
                reservePrice > currVRGDAPrice ? reservePrice : currVRGDAPrice
            setCurrMintPrice(ethers.utils.formatEther(maxPrice))
        }

        fetchNewAuctionState()
    }, [nouns])

    // loading initial client state
    useEffect(() => {
        const setInitialValues = async () => {
            // this will later update but only after minting
            const lastTokenBlock = await contract.lastTokenBlock()
            setLastTokenBlock(lastTokenBlock.toNumber())

            // this only need to run once - these values are constant
            const startTime = await contract.startTime()
            setGlobalStartTime(startTime.toNumber())

            const priceDecayInterval = await contract.priceDecayInterval()
            setPriceDecayInterval(priceDecayInterval.toNumber())

            const reservePrice = await contract.reservePrice()
            setReservePrice(ethers.utils.formatEther(reservePrice))

            const targetPrice = await contract.targetPrice()
            setTargetPrice(ethers.utils.formatEther(targetPrice))

            // fetching initial nouns
            const fetchInitialNouns = async () => {
                try {
                    const latestNoun = await contract.fetchNextNoun()
                    let initialNouns = [latestNoun]

                    for (let i = 1; i < 4; i++) {
                        const noun = await contract.fetchNoun(
                            (latestNoun.blockNumber - i).toString()
                        )
                        // Check if the noun is already in the initialNouns array
                        if (
                            !initialNouns.some(
                                (n) => n.blockNumber === noun.blockNumber
                            )
                        ) {
                            initialNouns.push(noun)
                        }
                    }

                    setNouns(initialNouns)
                    setInitialFetchComplete(true)
                } catch (error) {
                    console.error("Error fetching initial nouns:", error)
                }
            }

            fetchInitialNouns()
        }

        setInitialValues()
    }, [])

    useEffect(() => {
        if (initialFetchComplete) {
            const interval = setInterval(() => {
                fetchContractData()
                console.log("currMintPrice", currMintPrice)
                console.log("reservePrice", reservePrice)
                console.log("lastTokenBlock", lastTokenBlock)
                console.log("currBlockNumber", nouns[0]?.blockNumber.toString())
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [fetchContractData, initialFetchComplete])

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
