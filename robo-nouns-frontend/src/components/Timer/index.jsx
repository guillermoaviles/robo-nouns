import { useAuction } from "@/context/AuctionContext"
import { useState, useEffect } from "react"

function CountdownTimer() {
    const { globalStartTime, priceDecayInterval } = useAuction()
    const [timeLeft, setTimeLeft] = useState(0)
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = Math.floor(new Date().getTime() / 1000)
            const elapsedTime =
                globalStartTime && Math.floor(currentTime - globalStartTime)
            const timeLeftOnTimer =
                priceDecayInterval &&
                priceDecayInterval - (elapsedTime % priceDecayInterval)
            setTimeLeft(timeLeftOnTimer)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [globalStartTime, priceDecayInterval])

    return (
        <span className="text-dark-gray md:text-3xl font-['PT Sans']">
            {minutes}:{seconds < 10 ? "0" + seconds : seconds}
        </span>
    )
}

export default CountdownTimer
