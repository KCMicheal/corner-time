import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DigitalDisplay } from "./components/DigitalDisplay";
import { Controls } from "./components/Controls";
import {
  getLocationData,
  type LocationData,
  type Currency,
} from "./utils/currency";

export default function App() {
  const [mode, setMode] = useState<"clock" | "timer" | "stopwatch">("clock");
  const [isRunning, setIsRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25 * 60); // 25 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | undefined>(
    undefined
  );
  const [currency, setCurrency] = useState<Currency | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currencyPosition, setCurrencyPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: -50 });

  // Load saved currency position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem("currencyPosition");
    if (savedPosition) {
      try {
        setCurrencyPosition(JSON.parse(savedPosition));
      } catch (error) {
        console.warn("Failed to parse saved currency position:", error);
      }
    }
  }, []);

  // Get user location and currency on component mount
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const data = await getLocationData();
        setLocationData(data);
        setCurrency(data.currency);
      } catch (error) {
        console.error("Failed to fetch location data:", error);
        // Fallback to default currency
        setCurrency({ code: "USD", symbol: "$", name: "US Dollar" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  const toggleMode = () => {
    if (mode === "clock") {
      setMode("timer");
      setTimeRemaining(timerDuration);
    } else if (mode === "timer") {
      setMode("stopwatch");
      setTimeRemaining(0);
    } else {
      setMode("clock");
    }
    setIsRunning(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle currency position changes
  const handleCurrencyPositionChange = (position: { x: number; y: number }) => {
    setCurrencyPosition(position);
    localStorage.setItem("currencyPosition", JSON.stringify(position));
  };

  if (isLoading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center w-full min-h-screen bg-black text-blue-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
        />
        <motion.p
          className="mt-4 text-blue-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontFamily: "Technology-Italic, monospace" }}
        >
          Detecting your location...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full min-h-screen bg-black text-blue-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl p-6">
        <DigitalDisplay
          mode={mode}
          isRunning={isRunning}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
          currency={currency}
          locationData={locationData}
          onCurrencyPositionChange={handleCurrencyPositionChange}
          savedCurrencyPosition={currencyPosition}
        />
        <Controls
          mode={mode}
          toggleMode={toggleMode}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          timerDuration={timerDuration}
          setTimerDuration={setTimerDuration}
          setTimeRemaining={setTimeRemaining}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />
      </div>
    </motion.div>
  );
}
