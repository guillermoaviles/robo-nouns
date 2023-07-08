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
    const [nounNFTMeta, setNounNFTMeta] = useState(
        Array.from({ length }, () => null)
    )
    const [nounTwo, setNounTwo] = useState("")
    // const [prevNouns, setPrevNouns] = useState({
    //     nounTwo: "",
    //     nounThree: "",
    //     nounFour: "",
    // })
    const [nounThree, setNounThree] = useState("")
    const [nounFour, setNounFour] = useState("")
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

    const fetchNFTMetadata = async () => {
        try {
            const lastTokenBlock = await contract.lastTokenBlock()
            setLastTokenBlock(lastTokenBlock.toNumber())

            const nounMeta = await contract.fetchNextNoun()
            addNounData(nounMeta)

            const nounTwo = await contract.fetchNoun(
                nounNFTMeta[0]?.blockNumber.toNumber() - 1
            )
            setNounTwo(nounTwo)

            const nounThree = await contract.fetchNoun(
                nounNFTMeta[0]?.blockNumber.toNumber() - 2
            )
            setNounThree(nounThree)

            const nounFour = await contract.fetchNoun(
                nounNFTMeta[0]?.blockNumber.toNumber() - 3
            )
            setNounFour(nounFour)

            const currVRGDAPrice = await contract.getCurrentVRGDAPrice()
            const maxPrice =
                reservePrice > currVRGDAPrice ? reservePrice : currVRGDAPrice
            setCurrMintPrice(ethers.utils.formatEther(maxPrice))

            const nounMeta = await contract.fetchNextNoun()
            addNounData(nounMeta)
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
    }, [])

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

    // const updateNounTwo = (newNounTwo) => {
    //     setPrevNouns((prevNouns) => ({
    //         ...prevNouns,
    //         nounTwo: newNounTwo,
    //     }))
    // }

    // const updateNounThree = (newNounThree) => {
    //     setPrevNouns((prevNouns) => ({
    //         ...prevNouns,
    //         nounThree: newNounThree,
    //     }))
    // }

    // const updateNounFour = (newNounFour) => {
    //     setPrevNouns((prevNouns) => ({
    //         ...prevNouns,
    //         nounFour: newNounFour,
    //     }))
    // }

    const auctionData = {
        auctionContractAddress,
        contract,
        lastTokenBlock,
        nounNFTMeta,
        nounTwo,
        nounThree,
        nounFour,
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
