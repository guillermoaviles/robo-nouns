import { useAuction } from "@/context/AuctionContext"
import { useState, useEffect } from "react"

function CountdownTimer() {
    const { contract } = useAuction()
    const [globalStartTime, setGlobalStartTime] = useState(0)
    const [priceDecayInterval, setPriceDecayInterval] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    useEffect(() => {
        async function fetchStartTime() {
            const startTime = await contract.startTime()
            setGlobalStartTime(startTime.toNumber())
        }

        async function fetchPriceDecayInterval() {
            const priceDecayInterval = await contract.priceDecayInterval()
            setPriceDecayInterval(priceDecayInterval.toNumber())
        }

        fetchStartTime()
        fetchPriceDecayInterval()
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = Math.floor(new Date().getTime() / 1000)
            const elapsedTime = Math.floor(currentTime - globalStartTime)

            const timeLeftOnTimer =
                priceDecayInterval - (elapsedTime % priceDecayInterval)
            setTimeLeft(timeLeftOnTimer)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [globalStartTime, priceDecayInterval, contract])

    return (
        <span className="text-dark-gray md:text-3xl font-['PT Sans']">
            {minutes}:{seconds < 10 ? "0" + seconds : seconds}
        </span>
    )
}

export default CountdownTimer
