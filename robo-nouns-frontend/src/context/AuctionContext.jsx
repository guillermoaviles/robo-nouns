import { createContext, useContext, useEffect, useState } from "react"
import { ethers } from "ethers"
import deployments from "../../../robo-nouns-contracts/assets/deployments.json"
import newAbi from "./abi.json"

const AuctionContext = createContext()

export function useAuction() {
    return useContext(AuctionContext)
}

export function AuctionProvider({ children }) {
    let length = 4
    const [nouns, setNouns] = useState(Array.from({ length }, () => null))
    const [lastTokenBlock, setLastTokenBlock] = useState(0)
    const [globalStartTime, setGlobalStartTime] = useState(0)
    const [priceDecayInterval, setPriceDecayInterval] = useState(0)
    const [reservePrice, setReservePrice] = useState("")
    const [currMintPrice, setCurrMintPrice] = useState("")
    const [targetPrice, setTargetPrice] = useState("")
    const [initialFetchComplete, setInitialFetchComplete] = useState(false)

    const auctionContractAddress = deployments.RoboNounsVRGDA.address

    const providerUrl =
        "https://eth-goerli.g.alchemy.com/v2/8kIFZ8iBRuBDAQqIH73BfPB8ESBwbIUt"
    const provider = new ethers.providers.JsonRpcProvider(providerUrl)

    const auctionContractABI = newAbi.abi
    const contract = new ethers.Contract(
        auctionContractAddress,
        auctionContractABI,
        provider
    )

    //   useEffect(() => {
    //     // This only needs to run once - these values are constant
    //     const setInitialValues = async () => {
    //       const startTime = await contract.startTime();
    //       setGlobalStartTime(startTime.toNumber());

    //       const priceDecayInterval = await contract.priceDecayInterval();
    //       setPriceDecayInterval(priceDecayInterval.toNumber());

    //       const reservePrice = await contract.reservePrice();
    //       setReservePrice(ethers.utils.formatEther(reservePrice));

    //       const targetPrice = await contract.targetPrice();
    //       setTargetPrice(ethers.utils.formatEther(targetPrice));
    //     };

    //     setInitialValues();
    //   }, []);

    useEffect(() => {
        // defining a function inside useEffect to use async/await
        const setInitialValues = async () => {
            try {
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

                const latestNoun = await contract.fetchNextNoun()
                let initialNouns = [latestNoun]
                let lastKnownBlock = latestNoun.blockNumber.toNumber() // using BigNumber's toNumber method to get actual number

                for (let i = 1; i < 4; i++) {
                    const noun = await contract.fetchNoun(
                        (lastKnownBlock - i).toString()
                    )
                    // Check if the noun is already in the initialNouns array
                    if (
                        !initialNouns.some(
                            (n) =>
                                n.blockNumber.toNumber() ===
                                noun.blockNumber.toNumber()
                        )
                    ) {
                        // using BigNumber's toNumber method to get actual number
                        initialNouns.push(noun)
                    }
                }

                setNouns(initialNouns)
                // this helps to indicate that initial fetch is complete
                // so that another useEffect that's dependent on <initialFetchComplete> can run
                setInitialFetchComplete(true)
            } catch (error) {
                console.error("Error fetching initial nouns:", error)
            }
        }
        if (!initialFetchComplete) {
            setInitialValues()
        }
    }, [initialFetchComplete])

    const addNounData = (newNoun) => {
        const isDuplicate = nouns
            ? nouns.some(
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
            const updatedNouns = [newNoun, ...nouns]
            if (updatedNouns.length > length) {
                updatedNouns.pop()
            }
            setNouns(updatedNouns)
        }
    }

    useEffect(() => {
        const fetchNFTMetadata = async () => {
            try {
                const lastTokenBlock = await contract.lastTokenBlock()
                setLastTokenBlock(lastTokenBlock.toNumber())

                const nounMeta = await contract.fetchNextNoun()
                addNounData(nounMeta)

                const currVRGDAPrice = (
                    await contract.getCurrentVRGDAPrice()
                ).toString()
                const currMintPrice =
                    reservePrice > currVRGDAPrice
                        ? reservePrice
                        : currVRGDAPrice
                setCurrMintPrice(ethers.utils.formatEther(currMintPrice))
            } catch (error) {
                console.error(
                    "Error fetching NFT metadata and price info:",
                    error
                )
            }
        }

        const interval = setInterval(() => {
            fetchNFTMetadata()
            console.log("nouns", nouns)
        }, 1000)

        return () => clearInterval(interval)
    }, [
        initialFetchComplete,
        nouns,
        currMintPrice,
        reservePrice,
        lastTokenBlock,
        addNounData,
    ])

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
