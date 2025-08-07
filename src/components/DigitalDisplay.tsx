import React, { useEffect, useState } from 'react'
interface DigitalDisplayProps {
  mode: 'clock' | 'timer' | 'stopwatch'
  isRunning: boolean
  timeRemaining: number
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>
}
export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  mode,
  isRunning,
  timeRemaining,
  setTimeRemaining,
}) => {
 const [currentTime, setCurrentTime] = useState(new Date());
 useEffect(() => {
   let intervalId: number;
   if (mode === "clock") {
     // Update clock every second
     intervalId = window.setInterval(() => {
       setCurrentTime(new Date());
     }, 1000);
   } else if (isRunning) {
     // Handle timer countdown or stopwatch count up
     intervalId = window.setInterval(() => {
       setTimeRemaining((prev) => {
         if (mode === "timer" && prev <= 0) {
           return 0;
         }
         return mode === "timer" ? prev - 1 : prev + 1;
       });
     }, 1000);
   }
   return () => {
     if (intervalId) {
       clearInterval(intervalId);
     }
   };
 }, [mode, isRunning, setTimeRemaining]);

 const formatTimeDisplay = () => {
   if (mode === "clock") {
     const hours = currentTime.getHours().toString().padStart(2, "0");
     const minutes = currentTime.getMinutes().toString().padStart(2, "0");
     const seconds = currentTime.getSeconds().toString().padStart(2, "0");
     return `${hours} : ${minutes} : ${seconds}`;
   } else {
     // For timer and stopwatch
     const hours = Math.floor(timeRemaining / 3600)
       .toString()
       .padStart(2, "0");
     const minutes = Math.floor((timeRemaining % 3600) / 60)
       .toString()
       .padStart(2, "0");
     const seconds = Math.floor(timeRemaining % 60)
       .toString()
       .padStart(2, "0");
     return `${hours} : ${minutes} : ${seconds}`;
   }
 };

  return (
    <div className="flex flex-col items-center justify-center p-10 mb-8">
      <div
        className="digital-display text-8xl md:text-9xl tracking-wider text-blue-400 text-pretty bg-black p-12 rounded-md w-full text-center"
        style={{
          textShadow: "0 0 10px #3B82F6, 0 0 20px #3B82F6",
        }}
      >
        {formatTimeDisplay()}
      </div>
      <div className="mt-4 text-xl text-blue-400 uppercase tracking-widest">
        {mode === "clock"
          ? "Current Time"
          : mode === "timer"
          ? "Focus Timer"
          : "Stopwatch"}
      </div>
    </div>
  );
}