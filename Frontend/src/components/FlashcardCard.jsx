import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCw, CheckCircle, HelpCircle, BookOpen } from 'lucide-react';

export const FlashcardCard = ({ card, index, total }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ y: -4 }}
        className={`cursor-pointer min-h-[260px] sm:min-h-[290px] rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between select-none ${
          isFlipped
            ? 'bg-[#003F36] text-white border-[#C8F3E4]/30 shadow-[0_20px_45px_rgba(0,63,54,0.18)]'
            : 'bg-white text-[#12352F] border-[rgba(0,63,54,0.08)] shadow-[0_12px_36px_rgba(0,64,54,0.06)] hover:border-[#00A878]/40'
        }`}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between text-xs font-bold">
          <span className={`px-2.5 py-1 rounded-full text-[10px] ${
            isFlipped 
              ? 'bg-[#C8F3E4]/20 text-[#C8F3E4]' 
              : 'bg-[#F7FBF9] text-[#60736E]'
          }`}>
            {card.difficulty || 'Concept'} · Card {index + 1} of {total}
          </span>

          <div className="flex items-center gap-1.5 opacity-70 text-[11px]">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Tap to {isFlipped ? 'see question' : 'reveal answer'}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="py-4">
          <div className="text-[11px] uppercase tracking-wider font-bold mb-2 opacity-60 flex items-center gap-1">
            {isFlipped ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-[#00A878]" />
                <span>✦ Answer & Explanation</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-3.5 h-3.5 text-[#00A878]" />
                <span>Question / Concept Prompt</span>
              </>
            )}
          </div>

          <p className="font-display font-semibold text-base sm:text-lg leading-relaxed">
            {isFlipped ? card.a : card.q}
          </p>
        </div>

        {/* Card Footer Reference */}
        <div className={`pt-3 border-t text-[11px] flex items-center justify-between ${
          isFlipped 
            ? 'border-[#C8F3E4]/15 text-[#C8F3E4]/80' 
            : 'border-[rgba(0,63,54,0.06)] text-[#60736E]'
        }`}>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#00A878]" />
            Reference: {card.ref || 'Page 3'}
          </span>
          <span className="font-medium">Paprism Recall</span>
        </div>
      </motion.div>
    </div>
  );
};

export default FlashcardCard;
