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
  // timestamp-based timing to remain accurate in background
  const [runStartMs, setRunStartMs] = useState<number | null>(null);
  const [baseRemaining, setBaseRemaining] = useState<number>(timerDuration); // for timer
  const [baseElapsed, setBaseElapsed] = useState<number>(0); // for stopwatch
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
      setBaseRemaining(timerDuration);
      setBaseElapsed(0);
      setRunStartMs(null);
    } else if (mode === "timer") {
      setMode("stopwatch");
      setTimeRemaining(0);
      setBaseElapsed(0);
      setRunStartMs(null);
    } else {
      setMode("clock");
      setRunStartMs(null);
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

  // Persist and restore core state
  useEffect(() => {
    const saved = localStorage.getItem("appState");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.mode) setMode(s.mode);
        if (typeof s.isRunning === "boolean") setIsRunning(s.isRunning);
        if (typeof s.timerDuration === "number")
          setTimerDuration(s.timerDuration);
        if (typeof s.baseRemaining === "number")
          setBaseRemaining(s.baseRemaining);
        if (typeof s.baseElapsed === "number") setBaseElapsed(s.baseElapsed);
        if (typeof s.runStartMs === "number") setRunStartMs(s.runStartMs);
      } catch (e) {
        console.warn("Failed to restore saved app state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "appState",
      JSON.stringify({
        mode,
        isRunning,
        timerDuration,
        baseRemaining,
        baseElapsed,
        runStartMs,
      })
    );
  }, [mode, isRunning, timerDuration, baseRemaining, baseElapsed, runStartMs]);

  // Keep time accurate using wall clock deltas (resists background throttling)
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (!isRunning || runStartMs == null) return;
      if (mode === "timer") {
        const elapsed = Math.floor((now - runStartMs) / 1000);
        const remaining = Math.max(0, baseRemaining - elapsed);
        setTimeRemaining(remaining);
        if (remaining === 0) {
          // auto-pause when complete
          setIsRunning(false);
          setRunStartMs(null);
          setBaseRemaining(0);
        }
      } else if (mode === "stopwatch") {
        const elapsed = Math.floor((now - runStartMs) / 1000);
        setTimeRemaining(baseElapsed + elapsed);
      }
    };
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [isRunning, mode, runStartMs, baseRemaining, baseElapsed]);

  // Start/stop bookkeeping based on isRunning transitions
  useEffect(() => {
    if (isRunning) {
      // starting/resuming
      setRunStartMs(Date.now());
      if (mode === "timer") {
        // ensure baseRemaining syncs with current displayed remaining
        setBaseRemaining((prev) =>
          prev !== timeRemaining ? timeRemaining : prev
        );
      } else if (mode === "stopwatch") {
        setBaseElapsed((prev) =>
          prev !== timeRemaining ? timeRemaining : prev
        );
      }
    } else {
      // pausing
      if (mode === "timer") {
        setBaseRemaining(timeRemaining);
      } else if (mode === "stopwatch") {
        setBaseElapsed(timeRemaining);
      }
      setRunStartMs(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // Keep timeRemaining in sync when user changes timerDuration while not running
  useEffect(() => {
    if (!isRunning && mode === "timer") {
      setTimeRemaining(timerDuration);
      setBaseRemaining(timerDuration);
    }
  }, [timerDuration, isRunning, mode]);

  // Warn before leaving if mid-session
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isRunning]);

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
