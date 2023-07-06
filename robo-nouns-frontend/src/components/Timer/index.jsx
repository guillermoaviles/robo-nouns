import React, { useState, useEffect } from "react";
import { useAuction } from "@/context/AuctionContext";

function CountdownTimer() {
  const { globalStartTime, priceDecayInterval } = useAuction();
  const [timeLeft, setTimeLeft] = useState(0);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const [flexDirection, setFlexDirection] = useState("row");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setFlexDirection("column");
      } else {
        setFlexDirection("row");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const elapsedTime =
        globalStartTime && Math.floor(currentTime - globalStartTime);
      const timeLeftOnTimer =
        priceDecayInterval &&
        priceDecayInterval - (elapsedTime % priceDecayInterval);
      setTimeLeft(timeLeftOnTimer);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [globalStartTime, priceDecayInterval]);

  return (
    <span
      className={`text-dark-gray md:text-3xl font-['PT Sans'] ${
        flexDirection === "column" ? "text-white" : ""
      }`}
    >
      {minutes}:{seconds < 10 ? "0" + seconds : seconds}
    </span>
  );
}

export default CountdownTimer;
