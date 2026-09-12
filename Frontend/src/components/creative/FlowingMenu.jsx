import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles, FileText, MessageSquareCode, HelpCircle, Layers, BookOpen, ChevronRight } from 'lucide-react';

export const FlowingMenu = ({
  items = [
    {
      id: 'summary',
      text: 'AI Editorial Summary',
      tag: 'Multi-Level Synthesis',
      path: '/summary',
      icon: Sparkles,
      description: 'Beginner, Intermediate, and Technical syntheses with 01-04 structured breakdowns.'
    },
    {
      id: 'workspace',
      text: '3-Column Workspace',
      tag: 'Full-Screen Research',
      path: '/workspace',
      icon: FileText,
      description: 'Side-by-side reading, LaTeX math rendering, and synchronized AI citations.'
    },
    {
      id: 'chat',
      text: 'Grounded RAG Assistant',
      tag: 'Zero Hallucination',
      path: '/chat',
      icon: MessageSquareCode,
      description: 'Document-grounded conversational answers with clickable Page and Section badges.'
    },
    {
      id: 'quiz',
      text: 'Active Recall Quizzes',
      tag: 'Viva & Exam Prep',
      path: '/quiz',
      icon: HelpCircle,
      description: 'AI-generated multiple-choice questions with instant scoring and explanations.'
    },
    {
      id: 'flashcards',
      text: 'Revision Flashcards',
      tag: '3D Flip Learning',
      path: '/flashcards',
      icon: Layers,
      description: 'Interactive concept flip cards linked to exact paper coordinate references.'
    }
  ]
}) => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-[#003F36] dark:bg-[#06201b] rounded-3xl p-6 sm:p-10 border border-[#C8F3E4]/15 shadow-[0_20px_50px_rgba(0,63,54,0.25)] select-none transition-colors duration-300"
    >
      {/* Background glowing ambient light */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A878]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C8F3E4]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#C8F3E4]/15 mb-6 relative z-10 gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A878] bg-[#C8F3E4]/10 px-3 py-1 rounded-full border border-[#00A878]/30">
            ✦ Flowing Navigation
          </span>
          <h3 className="font-display font-bold text-2xl text-white mt-2">
            Explore Paprism Modules
          </h3>
        </div>
        <p className="text-xs text-[#C8F3E4]/70 max-w-xs sm:text-right">
          Hover across modules to inspect capabilities and jump directly into any AI workspace.
        </p>
      </div>

      {/* Floating Sleek Typographic Preview Tooltip (No Images) */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: Math.min(mousePos.x + 15, 600),
              y: mousePos.y - 70
            }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="pointer-events-none absolute z-30 hidden lg:block w-72 p-4 rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.45)] border border-[#C8F3E4]/30 bg-[#002a24]/95 backdrop-blur-xl text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-[#00A878] text-white flex items-center justify-center">
                <hoveredItem.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#80edd0]">
                {hoveredItem.tag}
              </span>
            </div>
            <h4 className="font-display font-bold text-sm text-white mb-1">
              {hoveredItem.text}
            </h4>
            <p className="text-xs text-[#C8F3E4]/80 leading-relaxed">
              {hoveredItem.description}
            </p>
            <div className="mt-2 pt-2 border-t border-[#C8F3E4]/10 flex items-center justify-between text-[10px] text-[#00A878] font-bold">
              <span>Click to Launch Module</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flowing Menu Tracks */}
      <div className="space-y-3 relative z-10">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl py-4 px-6 transition-all duration-300 border border-transparent hover:border-[#00A878]/40 hover:bg-[#C8F3E4]/10 flex items-center justify-between"
            >
              {/* Left track number & text with icon */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#00A878] font-bold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  0{index + 1}
                </span>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-[#00A878] text-[#C8F3E4] group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-display font-bold text-xl sm:text-2xl text-white/90 group-hover:text-[#C8F3E4] group-hover:translate-x-2 transition-all duration-300">
                    {item.text}
                  </span>
                </div>
              </div>

              {/* Right pill & arrow */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-[#C8F3E4]/15 text-[#C8F3E4] border border-[#C8F3E4]/20 group-hover:bg-[#00A878] group-hover:text-white transition-colors">
                  {item.tag}
                </span>

                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#00A878] text-white flex items-center justify-center transition-all group-hover:scale-110">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlowingMenu;
