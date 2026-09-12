import React from 'react';

/**
 * Paprism Brand Logo Component
 * Geometric prism 'P' icon with faceted emerald & teal layers + typography
 */
export const PaprismLogo = ({ 
  size = 'md', 
  showTagline = true, 
  variant = 'dark', // 'dark' (for light background) | 'light' (for dark background)
  className = '' 
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Faceted Geometric Prism 'P' Icon */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${iconSizes[size] || iconSizes.md}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,168,120,0.3)]"
        >
          <defs>
            <linearGradient id="prismStem" x1="6" y1="4" x2="16" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#003F36" />
              <stop offset="100%" stopColor="#006B57" />
            </linearGradient>
            <linearGradient id="prismLoopTop" x1="12" y1="4" x2="34" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00A878" />
              <stop offset="100%" stopColor="#006B57" />
            </linearGradient>
            <linearGradient id="prismLoopFacet" x1="18" y1="8" x2="34" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#80edd0" />
              <stop offset="50%" stopColor="#00A878" />
              <stop offset="100%" stopColor="#003F36" />
            </linearGradient>
            <linearGradient id="prismInner" x1="16" y1="12" x2="26" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C8F3E4" />
              <stop offset="100%" stopColor="#80edd0" />
            </linearGradient>
          </defs>

          {/* Left Vertical Spine / Stem of 'P' */}
          <path
            d="M 8 6 C 8 4.5 9.5 3.5 11 4 L 16 6 L 16 34 C 16 35.5 14.5 36.5 13 36 L 8 34 Z"
            fill="url(#prismStem)"
          />

          {/* Outer Curved Loop / Diamond Facet of 'P' */}
          <path
            d="M 16 5 L 28 5 C 34 5 37 9 37 15 C 37 21 33 25 27 25 L 16 25 Z"
            fill="url(#prismLoopTop)"
          />

          {/* Refraction Diagonal Facet Overlay */}
          <path
            d="M 16 5 L 32 12 L 28 25 L 16 25 Z"
            fill="url(#prismLoopFacet)"
            opacity="0.9"
          />

          {/* Inner Negative Space / Light Core */}
          <polygon
            points="18,10 26,10 28,15 24,20 18,20"
            fill="url(#prismInner)"
          />

          {/* Glowing Optical Sparkle Dot */}
          <circle cx="31" cy="7" r="2" fill="#C8F3E4" className="animate-pulse" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span
          className={`font-display font-extrabold tracking-tight leading-none ${
            isLight ? 'text-white' : 'text-[#003F36]'
          } ${textSizes[size] || textSizes.md}`}
        >
          Paprism
        </span>
        {showTagline && (
          <span
            className={`text-[8.5px] font-bold uppercase tracking-[0.22em] mt-0.5 leading-tight ${
              isLight ? 'text-[#C8F3E4]/75' : 'text-[#60736E]'
            }`}
          >
            READ. REFRACT. REVEAL.
          </span>
        )}
      </div>
    </div>
  );
};

export default PaprismLogo;
