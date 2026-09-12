import React from 'react';
import { motion } from 'framer-motion';

/**
 * Byte Mascot - Animated AI holographic prism companion
 * Props:
 * - mood: 'idle' | 'happy' | 'thinking' | 'scholar' | 'speaking' | 'excited'
 * - size: 'sm' | 'md' | 'lg' | 'xl'
 * - isSpeaking: boolean
 */
export const ByteMascot = ({ 
  mood = 'idle', 
  size = 'md', 
  isSpeaking = false,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const currentMood = isSpeaking ? 'speaking' : mood;

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size] || sizeMap.md} ${className}`}>
      {/* Ambient Pulsing Aura */}
      <motion.div
        animate={{
          scale: currentMood === 'thinking' ? [1, 1.25, 1] : currentMood === 'excited' ? [1, 1.35, 1] : [1, 1.15, 1],
          opacity: currentMood === 'speaking' ? [0.4, 0.8, 0.4] : [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: currentMood === 'thinking' ? 1.2 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#00A878] via-[#80edd0] to-[#C8F3E4] blur-md -z-10"
      />

      {/* Main Floating Mascot SVG */}
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,168,120,0.35)]"
        animate={{
          y: currentMood === 'excited' ? [-3, 3, -3] : currentMood === 'thinking' ? [-1, 2, -1] : [-2, 2, -2],
          rotate: currentMood === 'thinking' ? [-2, 2, -2] : [0, 0, 0]
        }}
        transition={{
          duration: currentMood === 'excited' ? 0.8 : 2.4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="byteBodyGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#004D40" />
            <stop offset="45%" stopColor="#006B57" />
            <stop offset="100%" stopColor="#003F36" />
          </linearGradient>

          <linearGradient id="bytePrismFacet" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00A878" />
            <stop offset="100%" stopColor="#004D40" />
          </linearGradient>

          <linearGradient id="byteScreenGrad" x1="25" y1="30" x2="75" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a231f" />
            <stop offset="100%" stopColor="#001814" />
          </linearGradient>

          <linearGradient id="byteGemGrad" x1="50" y1="2" x2="50" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C8F3E4" />
            <stop offset="50%" stopColor="#00A878" />
            <stop offset="100%" stopColor="#006B57" />
          </linearGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Top Antenna / Floating Energy Core */}
        <motion.g
          animate={{
            y: [-1, 2, -1],
            scale: currentMood === 'thinking' ? [1, 1.2, 1] : [1, 1.05, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Connector stem */}
          <path d="M50 16 L50 24" stroke="#80edd0" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          {/* Crown crystal star */}
          <polygon
            points="50,4 54,12 62,12 56,17 58,25 50,20 42,25 44,17 38,12 46,12"
            fill="url(#byteGemGrad)"
            stroke="#C8F3E4"
            strokeWidth="0.8"
            filter="url(#neonGlow)"
          />
        </motion.g>

        {/* Head Chassis / Hex Prism Shape */}
        <path
          d="M 32 25 L 68 25 C 78 25, 84 32, 85 42 L 85 64 C 85 76, 76 83, 64 84 L 36 84 C 24 83, 15 76, 15 64 L 15 42 C 16 32, 22 25, 32 25 Z"
          fill="url(#byteBodyGrad)"
          stroke="#00A878"
          strokeWidth="1.5"
        />

        {/* Subtle geometric chamfer accents */}
        <path d="M 20 32 L 32 26 L 68 26 L 80 32" stroke="#C8F3E4" strokeWidth="1" opacity="0.35" fill="none" />
        <path d="M 18 64 L 32 82 L 68 82 L 82 64" stroke="#00A878" strokeWidth="1" opacity="0.4" fill="none" />

        {/* Glossy LED Visor Screen */}
        <rect
          x="22"
          y="32"
          width="56"
          height="42"
          rx="12"
          fill="url(#byteScreenGrad)"
          stroke="#00A878"
          strokeWidth="1"
        />

        {/* Visor Scanline / Gloss Reflection */}
        <path
          d="M 24 35 Q 50 42 76 35"
          stroke="#C8F3E4"
          strokeWidth="1"
          opacity="0.25"
          fill="none"
        />

        {/* Mascot Eyes - Dynamic based on mood */}
        {currentMood === 'scholar' ? (
          /* Professor Glasses & Smart Eyes */
          <g>
            {/* Glasses frame */}
            <circle cx="38" cy="50" r="9" stroke="#C8F3E4" strokeWidth="1.5" fill="none" />
            <circle cx="62" cy="50" r="9" stroke="#C8F3E4" strokeWidth="1.5" fill="none" />
            <path d="M 47 50 L 53 50" stroke="#C8F3E4" strokeWidth="1.5" />
            {/* Glowing pupils */}
            <circle cx="38" cy="50" r="4.5" fill="#80edd0" filter="url(#neonGlow)" />
            <circle cx="62" cy="50" r="4.5" fill="#80edd0" filter="url(#neonGlow)" />
            <circle cx="36" cy="48" r="1.5" fill="#FFFFFF" />
            <circle cx="60" cy="48" r="1.5" fill="#FFFFFF" />
          </g>
        ) : currentMood === 'happy' || currentMood === 'excited' ? (
          /* Happy curved anime eyes */
          <g>
            <motion.path
              d="M 33 52 Q 39 42 45 52"
              stroke="#80edd0"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              filter="url(#neonGlow)"
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.path
              d="M 55 52 Q 61 42 67 52"
              stroke="#80edd0"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              filter="url(#neonGlow)"
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Rosy holographic cheeks */}
            <circle cx="30" cy="58" r="3" fill="#00A878" opacity="0.6" />
            <circle cx="70" cy="58" r="3" fill="#00A878" opacity="0.6" />
          </g>
        ) : currentMood === 'thinking' ? (
          /* Thinking rotating rings & squint */
          <g>
            <motion.circle
              cx="38"
              cy="50"
              r="6"
              stroke="#C8F3E4"
              strokeWidth="2"
              strokeDasharray="4 3"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <circle cx="38" cy="50" r="2.5" fill="#80edd0" />
            
            <motion.circle
              cx="62"
              cy="50"
              r="6"
              stroke="#C8F3E4"
              strokeWidth="2"
              strokeDasharray="4 3"
              fill="none"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <circle cx="62" cy="50" r="2.5" fill="#80edd0" />
          </g>
        ) : currentMood === 'speaking' ? (
          /* Speaking active eyes + audio wave */
          <g>
            <circle cx="38" cy="48" r="5" fill="#80edd0" filter="url(#neonGlow)" />
            <circle cx="62" cy="48" r="5" fill="#80edd0" filter="url(#neonGlow)" />
            <circle cx="36.5" cy="46.5" r="1.5" fill="#FFFFFF" />
            <circle cx="60.5" cy="46.5" r="1.5" fill="#FFFFFF" />
          </g>
        ) : (
          /* Default Alert / Blinking Eyes */
          <g>
            <motion.ellipse
              cx="38"
              cy="50"
              rx="5"
              ry="6"
              fill="#80edd0"
              filter="url(#neonGlow)"
              animate={{
                scaleY: [1, 1, 0.1, 1, 1]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                times: [0, 0.85, 0.9, 0.95, 1]
              }}
            />
            <circle cx="36" cy="48" r="1.8" fill="#FFFFFF" />

            <motion.ellipse
              cx="62"
              cy="50"
              rx="5"
              ry="6"
              fill="#80edd0"
              filter="url(#neonGlow)"
              animate={{
                scaleY: [1, 1, 0.1, 1, 1]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                times: [0, 0.85, 0.9, 0.95, 1]
              }}
            />
            <circle cx="60" cy="48" r="1.8" fill="#FFFFFF" />
          </g>
        )}

        {/* Mouth / Voice Waveform */}
        {currentMood === 'speaking' ? (
          /* Active Voice Equalizer Mouth */
          <g>
            <motion.line x1="42" y1="62" x2="42" y2="68" stroke="#C8F3E4" strokeWidth="2.5" strokeLinecap="round" animate={{ y1: [62, 60, 62], y2: [68, 70, 68] }} transition={{ duration: 0.3, repeat: Infinity }} />
            <motion.line x1="47" y1="60" x2="47" y2="70" stroke="#80edd0" strokeWidth="2.5" strokeLinecap="round" animate={{ y1: [60, 58, 60], y2: [70, 72, 70] }} transition={{ duration: 0.25, repeat: Infinity }} />
            <motion.line x1="53" y1="61" x2="53" y2="69" stroke="#80edd0" strokeWidth="2.5" strokeLinecap="round" animate={{ y1: [61, 59, 61], y2: [69, 71, 69] }} transition={{ duration: 0.35, repeat: Infinity }} />
            <motion.line x1="58" y1="63" x2="58" y2="67" stroke="#C8F3E4" strokeWidth="2.5" strokeLinecap="round" animate={{ y1: [63, 61, 63], y2: [67, 69, 67] }} transition={{ duration: 0.28, repeat: Infinity }} />
          </g>
        ) : currentMood === 'happy' || currentMood === 'excited' ? (
          /* Cute Open Smile */
          <path
            d="M 44 62 Q 50 68 56 62"
            stroke="#80edd0"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#006B57"
          />
        ) : (
          /* Gentle calm smile line */
          <path
            d="M 45 64 Q 50 67 55 64"
            stroke="#00A878"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Floating Side Ear Antenna Nodes */}
        <circle cx="12" cy="50" r="3.5" fill="#00A878" stroke="#C8F3E4" strokeWidth="1" />
        <circle cx="88" cy="50" r="3.5" fill="#00A878" stroke="#C8F3E4" strokeWidth="1" />
      </motion.svg>
    </div>
  );
};

export default ByteMascot;
