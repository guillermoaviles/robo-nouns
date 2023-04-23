import React, { useState, useEffect } from "react";

const TimeLeft = ({ updateInterval, onReset }) => {
  const [timeLeft, setTimeLeft] = useState(updateInterval);

  useEffect(() => {
    let intervalId;

    if (timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1000);
      }, 1000);
    } else {
      onReset();
    }

    return () => clearInterval(intervalId);
  }, [timeLeft, onReset, updateInterval]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${
      minutes > 0 ? minutes + "m " : ""
    }${seconds}s`;
  };

  return <span className="text-dark-gray text-3xl font-['PT Sans']">{formatTime(timeLeft)}</span>;
};

export default TimeLeft