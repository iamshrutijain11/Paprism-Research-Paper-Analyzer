import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Clock, FileText, ArrowRight, Quote, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const FloatingPaperCard = ({
  paper,
  delay = 0,
  floatDistance = 6,
  floatDuration = 5,
  isActive = false,
  onSelect,
}) => {
  const navigate = useNavigate();
  const { selectPaper } = useUser();

  const handleOpenPaper = (e) => {
    e.stopPropagation();
    selectPaper(paper.id);
    if (onSelect) onSelect(paper);
    navigate('/workspace');
  };

  return (
    <motion.div
      // Continuous weightless anti-gravity floating loop
      animate={{
        y: [-floatDistance, floatDistance, -floatDistance],
      }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
      whileHover={{
        y: -10,
        scale: 1.015,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      onClick={handleOpenPaper}
      className={`group relative cursor-pointer rounded-2xl bg-white/90 backdrop-blur-md p-6 border transition-all duration-300 ${
        isActive
          ? 'border-[#00A878] shadow-[0_12px_36px_rgba(0,168,120,0.15)] ring-2 ring-[#00A878]/20'
          : 'border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.06)] hover:border-[#00A878]/40 hover:shadow-[0_16px_36px_rgba(0,64,54,0.12)]'
      }`}
    >
      {/* Top Bar: Category Pill & AI Ready Motif */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <span className="text-[11px] font-semibold text-[#60736E] bg-[#F7FBF9] px-2.5 py-1 rounded-md border border-[rgba(0,63,54,0.06)]">
          {paper.category || 'Computer Science'}
        </span>

        {/* ✦ AI Ready Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C8F3E4] text-[#006B57] font-semibold text-xs border border-[#00A878]/20 shadow-sm">
          <span className="text-[#00A878] font-bold text-xs">✦</span>
          <span>AI Ready</span>
        </div>
      </div>

      {/* Title with Editorial Heading Style */}
      <h3 className="font-display font-bold text-[#12352F] group-hover:text-[#006B57] text-lg leading-snug tracking-tight mb-2 transition-colors duration-200 line-clamp-2">
        {paper.title}
      </h3>

      {/* Authors & Year */}
      <p className="text-xs text-[#60736E] mb-3 line-clamp-1 font-medium">
        {paper.authors}
      </p>

      {/* Simplified TL;DR preview */}
      <div className="p-3 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.05)] text-xs text-[#12352F]/90 leading-relaxed mb-4 line-clamp-3">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#006B57] mb-1">
          <Sparkles className="w-3 h-3 text-[#00A878]" />
          <span>✦ Simplified Insight</span>
        </div>
        {paper.simpleSummary || paper.abstract}
      </div>

      {/* Bottom Metadata & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-[rgba(0,63,54,0.06)] text-xs">
        <div className="flex items-center gap-3 text-[#60736E]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#00A878]" />
            {paper.readingTime || '5 min read'}
          </span>
          <span className="flex items-center gap-1">
            <Quote className="w-3.5 h-3.5 text-[#60736E]/70" />
            {paper.citations || 'Top 1%'}
          </span>
        </div>

        {/* Read Simplified Button */}
        <button
          onClick={handleOpenPaper}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003F36] group-hover:bg-[#00A878] text-white font-medium text-xs shadow-sm transition-all duration-200 group-hover:translate-x-0.5"
        >
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ambient Zero-G Glow hint on card corners */}
      <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-[#C8F3E4]/30 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default FloatingPaperCard;
