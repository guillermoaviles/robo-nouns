import { useState, useEffect } from "react";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(0);

  const globalStartTime = 1682310323

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = Math.floor((currentTime - globalStartTime) / 1000);
      const timeLeftOnTimer = 900 - (elapsedTime % 900);
      setTimeLeft(timeLeftOnTimer);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [globalStartTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="text-dark-gray md:text-3xl font-['PT Sans']">
      {minutes}:{seconds < 10 ? "0" + seconds : seconds}
    </span>
  );
}

export default CountdownTimer;
