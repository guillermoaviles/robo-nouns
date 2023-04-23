import { createContext, useContext, useState } from "react"

const AuctionContext = createContext()

export function useAuction() {
    return useContext(AuctionContext)
}

export function AuctionProvider({ children }) {
    const [nounNFTMeta, setNounNFTMeta] = useState([])
    const [minMintPrice, setMinMintPrice] = useState("")
    const [currMintPrice, setCurrMintPrice] = useState("")
    const [targetMintPrice, setTargetMintPrice] = useState("")

    const addNounData = (newNoun) => {
        // Check if the new object has a different hash value from the existing ones
        const isDuplicate = nounNFTMeta
            ? nounNFTMeta.some((noun) => noun.hash === newNoun.hash)
            : false
        if (!isDuplicate) {
            // Add the new object to the beginning of the array
            const updatedNounNFTMeta = [newNoun, ...nounNFTMeta]
            // Remove the oldest object if there are already 3 objects in the array
            if (updatedNounNFTMeta.length > 4) {
                updatedNounNFTMeta.pop()
            }
            setNounNFTMeta(updatedNounNFTMeta)
        }
    }

    const value = {
        addNounData,
        nounNFTMeta,
        setNounNFTMeta,
        minMintPrice,
        setMinMintPrice,
        currMintPrice,
        setCurrMintPrice,
        targetMintPrice,
        setTargetMintPrice,
    }

    return (
        <AuctionContext.Provider value={value}>
            {children}
        </AuctionContext.Provider>
    )
}
