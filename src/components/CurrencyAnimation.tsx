import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Currency } from "../utils/currency";

// Define 9 possible positions for the currency symbol
export type CurrencyPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface CurrencyAnimationProps {
  currency: Currency;
  isRunning: boolean;
  isCompleted: boolean;
  timeRemaining: number;
  position?: CurrencyPosition;
}

const positionStyles: Record<CurrencyPosition, string> = {
  "top-left": "-top-8 left-0",
  "top-center": "-top-8 left-1/2 transform -translate-x-1/2",
  "top-right": "-top-8 right-0",
  "middle-left": "top-1/2 -translate-y-1/2 left-0",
  "middle-center":
  "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  "middle-right": "top-1/2 -translate-y-1/2 right-0",
  "bottom-left": "-bottom-8 left-0",
  "bottom-center": "-bottom-8 left-1/2 transform -translate-x-1/2",
  "bottom-right": "-bottom-8 right-0",
};

export const CurrencyAnimation: React.FC<CurrencyAnimationProps> = ({
  currency,
  isRunning,
  isCompleted,
  timeRemaining,
  position = "top-center", // Default position
}) => {
  const [showStartSymbol, setShowStartSymbol] = React.useState(false);
  const [showNegativeSymbol, setShowNegativeSymbol] = React.useState(false);
  const [showPositiveSymbol, setShowPositiveSymbol] = React.useState(false);

  // Show positive symbol when timer starts
  React.useEffect(() => {
    if (isRunning && !showStartSymbol) {
      setShowStartSymbol(true);
      setTimeout(() => {
        setShowStartSymbol(false);
      }, 2000);
    }
  }, [isRunning]);

  // Show negative symbol during countdown
  React.useEffect(() => {
    if (isRunning && timeRemaining > 0 && !showStartSymbol) {
      const interval = setInterval(() => {
        setShowNegativeSymbol(true);
        setTimeout(() => setShowNegativeSymbol(false), 500);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, timeRemaining, showStartSymbol]);

  // Show positive symbol on completion
  React.useEffect(() => {
    if (isCompleted) {
      setShowPositiveSymbol(true);
      setTimeout(() => setShowPositiveSymbol(false), 2000);
    }
  }, [isCompleted]);

  return (
    <div className="relative">
      <AnimatePresence>
        {showStartSymbol && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1.2, y: -30 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute ${positionStyles[position]} text-green-500 text-3xl font-bold z-20`}
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            <div className="flex items-center gap-2">
              <span>+{currency.symbol}</span>
              <span className="text-sm">Start!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNegativeSymbol && !showStartSymbol && (
          <motion.div
            key="negative"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: -20 }}
            exit={{ opacity: 0, scale: 0.5, y: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute ${positionStyles[position]} text-red-500 text-2xl font-bold z-20`}
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            -{currency.symbol}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPositiveSymbol && (
          <motion.div
            key="positive"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1.2, y: -30 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute ${positionStyles[position]} text-green-500 text-3xl font-bold z-20`}
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            <div className="flex items-center gap-2">
              <span>+{currency.symbol}</span>
              <span className="text-sm">Complete!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Currency indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        className={`absolute ${positionStyles["bottom-center"]} text-blue-400 text-sm`}
        style={{ fontFamily: "Technology-Italic, monospace" }}
      >
        {currency.code} • {currency.name}
      </motion.div>
    </div>
  );
};
