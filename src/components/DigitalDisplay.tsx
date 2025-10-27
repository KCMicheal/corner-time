import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DraggableCurrency } from "./DraggableCurrency";
import type { Currency, LocationData } from "../utils/currency";

interface DigitalDisplayProps {
  mode: "clock" | "timer" | "stopwatch";
  isRunning: boolean;
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  currency?: Currency;
  locationData?: LocationData;
  onCurrencyPositionChange: (position: { x: number; y: number }) => void;
  savedCurrencyPosition?: { x: number; y: number };
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  mode,
  isRunning,
  timeRemaining,
  setTimeRemaining,
  currency,
  locationData,
  onCurrencyPositionChange,
  savedCurrencyPosition,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

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
            setIsCompleted(true);
            setShowCompletion(true);
            setTimeout(() => {
              setIsCompleted(false);
              setShowCompletion(false);
            }, 3000);
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
    <motion.div
      className="flex flex-col items-center justify-center p-10 mb-8 relative min-h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Location indicator */}
      {locationData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.8, y: 0 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-blue-300 text-sm"
          style={{ fontFamily: "Technology-Italic, monospace" }}
        >
          📍 {locationData.country}
        </motion.div>
      )}

      {/* Main display */}
      <motion.div
        className="relative"
        animate={showCompletion ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <div
          className="digital-display text-8xl md:text-9xl tracking-tighter text-blue-400 text-pretty bg-black p-12 rounded-md w-full text-center relative min-h-[200px] flex items-center justify-center"
          style={{
            textShadow: "0 0 10px #3B82F6, 0 0 20px #3B82F6",
            boxShadow: showCompletion
              ? "0 0 30px #10B981, 0 0 60px #10B981"
              : "0 0 20px #3B82F6, 0 0 40px #3B82F6",
              width: "800px"
          }}
        >
          {formatTimeDisplay()}

          {/* Draggable currency overlay */}
          {currency && mode === "timer" && (
            <DraggableCurrency
              currency={currency}
              isRunning={isRunning}
              isCompleted={isCompleted}
              timeRemaining={timeRemaining}
              onPositionChange={onCurrencyPositionChange}
              savedPosition={savedCurrencyPosition}
            />
          )}
        </div>
      </motion.div>

      {/* Mode indicator */}
      <motion.div
        className="mt-4 text-xl text-blue-400 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {mode === "clock"
          ? "Current Time"
          : mode === "timer"
          ? "Focus Timer"
          : "Stopwatch"}
      </motion.div>

      {/* Completion message */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500 text-4xl font-bold z-10"
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            FOCUS COMPLETE! 🎯
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
