import React, { useState, useEffect } from "react";
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
  savedPosition = { x: 0, y: -50 },
}) => {
  const [showPositiveSignal, setShowPositiveSignal] = useState(false);
  const [showNegativeSignal, setShowNegativeSignal] = useState(false);
  const [position, setPosition] = useState(savedPosition);

  // Animation pulse every second depending on running/paused state
  useEffect(() => {
    if (isCompleted || timeRemaining === 0) return;
    const interval = setInterval(() => {
      if (isRunning) {
        setShowPositiveSignal(true);
        setShowNegativeSignal(false);
        setTimeout(() => setShowPositiveSignal(false), 600);
      } else {
        setShowNegativeSignal(true);
        setShowPositiveSignal(false);
        setTimeout(() => setShowNegativeSignal(false), 600);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isCompleted]);

  // Reset all signals when timer stops or completes
  useEffect(() => {
    if (timeRemaining === 0 || isCompleted) {
      setShowPositiveSignal(false);
      setShowNegativeSignal(false);
    }
  }, [timeRemaining, isCompleted]);

  // Draggable logic
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingState(true);
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

      // Bounds checking
      const maxX = 750;
      const maxY = 300;
      const minX = -50;
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
        {showPositiveSignal && (
          <motion.div
            key="positive"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-green-500 text-3xl font-bold"
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            +{currency.symbol}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNegativeSignal && (
          <motion.div
            key="negative"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-red-500 text-3xl font-bold"
            style={{ fontFamily: "Technology-Italic, monospace" }}
          >
            -{currency.symbol}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Show currency indicator when not animating */}
      {/* {!showPositiveSignal && !showNegativeSignal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isDraggingState ? 0.3 : 0.7 }}
          className="text-blue-400 text-sm"
          style={{ fontFamily: "Technology-Italic, monospace" }}
        >
          {currency.code} • {currency.name}
        </motion.div>
      )} */}
    </div>
  );
};
