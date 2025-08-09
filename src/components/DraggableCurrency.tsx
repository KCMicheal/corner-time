import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Currency } from "../utils/currency";

interface DraggableCurrencyProps {
  currency: Currency;
  isRunning: boolean;
  isCompleted: boolean;
  timeRemaining: number;
  onPositionChange: (position: { x: number; y: number }) => void;
  savedPosition?: { x: number; y: number };
}

export const DraggableCurrency: React.FC<DraggableCurrencyProps> = ({
  currency,
  isRunning,
  isCompleted,
  timeRemaining,
  onPositionChange,
  savedPosition = { x: 0, y: -50 }, // Default position above timer
}) => {
  const [showStartSymbol, setShowStartSymbol] = useState(false);
  const [showNegativeSymbol, setShowNegativeSymbol] = useState(false);
  const [showPositiveSymbol, setShowPositiveSymbol] = useState(false);
  const [showSimplePositive, setShowSimplePositive] = useState(false);
  const [position, setPosition] = useState(savedPosition);
  const [isDragging, setIsDragging] = useState(false);

  // Use refs to track animation states without causing re-renders
  const hasShownStart = useRef(false);
  const isCurrentlyRunning = useRef(false);

  // Show positive symbol when timer starts
  //   useEffect(() => {
  //     if (isRunning && !hasShownStart.current && timeRemaining > 0) {
  //       hasShownStart.current = true;
  //       setShowStartSymbol(true);
  //       const timer = setTimeout(() => {
  //         setShowStartSymbol(false);
  //       }, 1500);
  //       return () => clearTimeout(timer);
  //     }
  //   }, [isRunning, timeRemaining]);

  // Show negative symbol during countdown
  useEffect(() => {
    if (
      isRunning &&
      timeRemaining > 0 &&
      !showStartSymbol &&
      !showPositiveSymbol
    ) {
      const interval = setInterval(() => {
        // Show negative symbol more frequently for motivation
        if (timeRemaining % 3 === 0) {
          setShowSimplePositive(true);
          setTimeout(() => setShowSimplePositive(false), 800);
        } else {
          setShowNegativeSymbol(true);
          setTimeout(() => setShowNegativeSymbol(false), 600);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, timeRemaining, showStartSymbol, showPositiveSymbol]);

  // Show positive symbol on completion
  useEffect(() => {
    if (isCompleted) {
      setShowPositiveSymbol(true);
      const timer = setTimeout(() => {
        setShowPositiveSymbol(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  // Reset all symbols when timer stops
  useEffect(() => {
    if (!isRunning) {
      setShowStartSymbol(false);
      setShowNegativeSymbol(false);
      setShowSimplePositive(false);
      setShowPositiveSymbol(false);
      hasShownStart.current = false;
      isCurrentlyRunning.current = false;
    } else {
      isCurrentlyRunning.current = true;
    }
  }, [isRunning]);

  // Custom draggable implementation using mouse events
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingState(true);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingState) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };

      // Add bounds checking to keep within reasonable area
      const maxX = 600; // Adjust based on your timer width
      const maxY = 300; // Adjust based on your timer height
      const minX = -500;
      const minY = -200;

      const boundedPosition = {
        x: Math.max(minX, Math.min(maxX, newPosition.x)),
        y: Math.max(minY, Math.min(maxY, newPosition.y)),
      };

      setPosition(boundedPosition);
    }
  };

  const handleMouseUp = () => {
    if (isDraggingState) {
      setIsDraggingState(false);
      setIsDragging(false);
      onPositionChange(position);
    }
  };

  useEffect(() => {
    if (isDraggingState) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDraggingState, dragOffset, position]);

  return (
    <div
      className="absolute top-0 left-0 z-30 cursor-move"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      <AnimatePresence>
        {showStartSymbol && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1.2, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-green-500 text-3xl font-bold"
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
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-red-500 text-2xl font-bold"
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            -{currency.symbol}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSimplePositive &&
          !showStartSymbol &&
          !showPositiveSymbol &&
          !showNegativeSymbol && (
            <motion.div
              key="simple-positive"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-green-500 text-2xl font-bold"
              style={{ fontFamily: "Technology-Italic, monospace" }}
            >
              +{currency.symbol}
            </motion.div>
          )}
      </AnimatePresence>

      <AnimatePresence>
        {showPositiveSymbol && (
          <motion.div
            key="positive"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1.2, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-green-500 text-3xl font-bold"
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            <div className="flex items-center gap-2">
              <span>+{currency.symbol}</span>
              <span className="text-sm">Complete!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show currency indicator when not animating */}
      {!showStartSymbol &&
        !showNegativeSymbol &&
        !showPositiveSymbol &&
        !showSimplePositive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isDragging ? 0.3 : 0.7 }}
            className="text-blue-400 text-sm"
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            {currency.code} • {currency.name}
          </motion.div>
        )}
    </div>
  );
};
