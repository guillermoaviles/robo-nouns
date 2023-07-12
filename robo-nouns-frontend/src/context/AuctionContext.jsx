import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react"
import { ethers } from "ethers"
import deployments from "../../../robo-nouns-contracts/assets/deployments.json"
import newAbi from "./abi.json"

const AuctionContext = createContext()

export function useAuction() {
    return useContext(AuctionContext)
}

export function AuctionProvider({ children }) {
    let length = 4;
    const [nounNFTMeta, setNounNFTMeta] = useState("")
    const [nounTwo, setNounTwo] = useState("")
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
        "https://eth-goerli.g.alchemy.com/v2/8kIFZ8iBRuBDAQqIH73BfPB8ESBwbIUt"
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
            setNounNFTMeta(nounMeta)

            const nounTwo = await contract.fetchNoun(
                nounNFTMeta.blockNumber.toNumber() - 1
            )
            setNounTwo(nounTwo)

            const nounThree = await contract.fetchNoun(
                nounNFTMeta.blockNumber.toNumber() - 2
            )
            setNounThree(nounThree)

            const nounFour = await contract.fetchNoun(
                nounNFTMeta.blockNumber.toNumber() - 3
            )
            setNounFour(nounFour)

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
        }, 1000)
        return () => clearInterval(interval)
    }, [nounNFTMeta])


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
