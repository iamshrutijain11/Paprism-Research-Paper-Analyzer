import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PixelTransition = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = '#00A878',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const totalPixels = gridSize * gridSize;
  const pixels = Array.from({ length: totalPixels });

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl cursor-pointer ${className}`}
    >
      {/* Base / First Content */}
      <div className="w-full h-full">
        {firstContent}
      </div>

      {/* Second Content (Revealed on hover/transition) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-10 w-full h-full bg-[#003F36] text-white p-6 flex flex-col justify-between"
      >
        {secondContent}
      </motion.div>

      {/* Pixel Grid Matrix Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`
        }}
      >
        {pixels.map((_, i) => {
          // Calculate staggered delay based on distance or random pattern
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          const delay = (row + col) * 0.02 + Math.random() * 0.04;

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: isHovered ? [0, 0.9, 0] : 0,
                scale: isHovered ? [0.6, 1.05, 0] : 0
              }}
              transition={{
                duration: 0.45,
                delay: isHovered ? delay : 0,
                ease: 'easeInOut'
              }}
              style={{
                backgroundColor: i % 2 === 0 ? '#C8F3E4' : pixelColor
              }}
              className="w-full h-full border-[0.5px] border-[#003F36]/10"
            />
          );
        })}
      </div>
    </div>
  );
};

export default PixelTransition;
