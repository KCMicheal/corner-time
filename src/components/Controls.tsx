import React, { useState } from "react";
import {
  ClockIcon,
  TimerIcon,
  TimerResetIcon,
  PlayIcon,
  PauseIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";

interface ControlsProps {
  mode: "clock" | "timer" | "stopwatch";
  toggleMode: () => void;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  timerDuration: number;
  setTimerDuration: React.Dispatch<React.SetStateAction<number>>;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  mode,
  toggleMode,
  isRunning,
  setIsRunning,
  timerDuration,
  setTimerDuration,
  setTimeRemaining,
  toggleFullscreen,
  isFullscreen,
}) => {
  const [customHours, setCustomHours] = useState("00");
  const [customMinutes, setCustomMinutes] = useState("25");
  const [customSeconds, setCustomSeconds] = useState("00");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === "timer") {
      setTimeRemaining(timerDuration);
    } else if (mode === "stopwatch") {
      setTimeRemaining(0);
    }
  };

  const handleTimerDurationChange = (minutes: number) => {
    const newDuration = minutes * 60;
    setTimerDuration(newDuration);
    if (!isRunning && mode === "timer") {
      setTimeRemaining(newDuration);
    }
    setShowCustomInput(false);
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseInt(customHours || "0") || 0;
    const minutes = parseInt(customMinutes || "0") || 0;
    const seconds = parseInt(customSeconds || "0") || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTimerDuration(totalSeconds);
    if (!isRunning && mode === "timer") {
      setTimeRemaining(totalSeconds);
    }
    setShowCustomInput(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    max: number
  ) => {
    let value = e.target.value.replace(/\D/g, "");
    // Allow typing freely (0-2 chars), clamp only if numeric exceeds max
    if (value === "") {
      setter("");
      return;
    }
    const numValue = parseInt(value, 10);
    if (!Number.isNaN(numValue) && numValue > max) {
      value = max.toString();
    }
    setter(value.slice(0, 2));
  };

  const toggleCustomInput = () => {
    setShowCustomInput(!showCustomInput);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={handleStartPause}
          className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg flex items-center justify-center transition-colors"
        >
          {isRunning ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
          <span className="ml-2">{isRunning ? "Pause" : "Start"}</span>
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg flex items-center justify-center transition-colors"
          disabled={mode === "clock"}
        >
          <TimerResetIcon size={24} />
          <span className="ml-2">Reset</span>
        </button>
        <button
          onClick={toggleMode}
          className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg flex items-center justify-center transition-colors"
        >
          {mode === "clock" ? (
            <TimerIcon size={24} />
          ) : mode === "timer" ? (
            <TimerIcon size={24} />
          ) : (
            <ClockIcon size={24} />
          )}
          <span className="ml-2">Mode</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg flex items-center justify-center transition-colors"
        >
          {isFullscreen ? (
            <MinimizeIcon size={24} />
          ) : (
            <MaximizeIcon size={24} />
          )}
        </button>
      </div>
      {mode === "timer" && !isRunning && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => handleTimerDurationChange(5)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg"
            >
              5min
            </button>
            <button
              onClick={() => handleTimerDurationChange(15)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg"
            >
              15min
            </button>
            <button
              onClick={() => handleTimerDurationChange(25)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg"
            >
              25min
            </button>
            <button
              onClick={() => handleTimerDurationChange(60)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg"
            >
              1hr
            </button>
            <button
              onClick={toggleCustomInput}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg"
            >
              Custom
            </button>
          </div>
          {showCustomInput && (
            <form
              onSubmit={handleCustomTimeSubmit}
              className="flex space-x-2 mt-2"
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={customHours}
                onChange={(e) => handleInputChange(e, setCustomHours, 99)}
                onBlur={(e) =>
                  setCustomHours(
                    (e.target.value || "0").toString().padStart(2, "0")
                  )
                }
                className="time-input digital-display text-xl"
                maxLength={2}
                placeholder="hh"
              />
              <span className="text-blue-300 text-xl">:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={customMinutes}
                onChange={(e) => handleInputChange(e, setCustomMinutes, 59)}
                onBlur={(e) =>
                  setCustomMinutes(
                    (e.target.value || "0").toString().padStart(2, "0")
                  )
                }
                className="time-input digital-display text-xl"
                maxLength={2}
                placeholder="mm"
              />
              <span className="text-blue-300 text-xl">:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={customSeconds}
                onChange={(e) => handleInputChange(e, setCustomSeconds, 59)}
                onBlur={(e) =>
                  setCustomSeconds(
                    (e.target.value || "0").toString().padStart(2, "0")
                  )
                }
                className="time-input digital-display text-xl"
                maxLength={2}
                placeholder="ss"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg"
              >
                Set
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
