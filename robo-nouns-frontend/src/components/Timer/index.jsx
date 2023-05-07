// import React, { useState, useEffect } from "react";

// const TimeLeft = ({ updateInterval, onReset }) => {
//   const [timeLeft, setTimeLeft] = useState(updateInterval);

//   useEffect(() => {
//     let intervalId;

//     if (timeLeft > 0) {
//       intervalId = setInterval(() => {
//         setTimeLeft(timeLeft - 1000);
//       }, 1000);
//     } else {
//       onReset();
//     }

//     return () => clearInterval(intervalId);
//   }, [timeLeft, onReset, updateInterval]);

//   const formatTime = (ms) => {
//     const seconds = Math.floor(ms / 1000) % 60;
//     const minutes = Math.floor(ms / (1000 * 60)) % 60;
//     const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
//     const days = Math.floor(ms / (1000 * 60 * 60 * 24));

//     return `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${
//       minutes > 0 ? minutes + "m " : ""
//     }${seconds}s`;
//   };

//   return <span className="text-dark-gray text-3xl font-['PT Sans']">{formatTime(timeLeft)}</span>;
// };

// export default TimeLeft

// import React, { useState, useEffect } from 'react';

// const TimeLeft = () => {
//   const [timeLeft, setTimeLeft] = useState(0);

//   useEffect(() => {
//     const countDownDate = new Date(1682310323 * 1000 + 15 * 60 * 1000).getTime();

//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = countDownDate - now;

//       if (distance < 0) {
//         clearInterval(interval);
//         setTimeLeft(0);
//       } else {
//         setTimeLeft(distance);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

//   return (
//     <div>
//       <h1>Countdown Timer</h1>
//       {timeLeft > 0 ? (
//         <h2>
//           {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
//         </h2>
//       ) : (
//         <h2>Timer has ended!</h2>
//       )}
//     </div>
//   );
// };

// export default TimeLeft;

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
    <span className="text-dark-gray text-3xl font-['PT Sans']">
      {minutes}:{seconds < 10 ? "0" + seconds : seconds}
    </span>
  );
}

export default CountdownTimer;
