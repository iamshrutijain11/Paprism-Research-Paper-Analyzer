import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronLeft, ChevronRight, FileText, ArrowRight, Eye } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const DomeGallery = () => {
  const navigate = useNavigate();
  const { papers, selectPaper } = useUser();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  const totalItems = papers.length;
  const radius = 340; // 3D Dome distance
  const angleStep = 360 / Math.max(totalItems, 4);

  const handleNext = () => {
    setRotationAngle(prev => prev - angleStep);
    setActiveIdx(prev => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setRotationAngle(prev => prev + angleStep);
    setActiveIdx(prev => (prev - 1 + totalItems) % totalItems);
  };

  const handleCardClick = (paperId) => {
    selectPaper(paperId);
    navigate('/workspace');
  };

  // Drag controls
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    setRotationAngle(prev => prev + dx * 0.4);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#F7FBF9] to-white rounded-3xl p-6 sm:p-10 border border-[rgba(0,63,54,0.08)] shadow-[0_12px_40px_rgba(0,64,54,0.05)] select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[rgba(0,63,54,0.06)]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A878] bg-[#C8F3E4] px-3 py-1 rounded-full border border-[#00A878]/30">
            ✦ 3D Dome Gallery
          </span>
          <h3 className="font-display font-bold text-2xl text-[#12352F] mt-2">
            Curved Paper Dome Showcase
          </h3>
          <p className="text-xs text-[#60736E] mt-0.5">
            Drag to spin the 3D research sphere or click any document to open its workspace.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-white hover:bg-[#C8F3E4] text-[#003F36] border border-[rgba(0,63,54,0.1)] shadow-xs transition-colors cursor-pointer"
            title="Rotate Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-[#003F36] hover:bg-[#005045] text-white shadow-xs transition-colors cursor-pointer"
            title="Rotate Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Dome Stage */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[460px] flex items-center justify-center cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{ perspective: '1200px' }}
      >
        {/* Central Ambient Ring */}
        <div className="absolute w-72 h-72 rounded-full border border-[#00A878]/20 animate-pulse pointer-events-none" />
        <div className="absolute w-96 h-96 rounded-full border border-[#C8F3E4]/40 pointer-events-none" />

        {/* Dome Carousel Cylinder */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={{ rotateY: rotationAngle }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {papers.map((paper, index) => {
            const currentAngle = index * angleStep;

            return (
              <div
                key={paper.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(paper.id);
                }}
                className="absolute w-72 sm:w-80 h-[360px] rounded-3xl bg-white border border-[rgba(0,63,54,0.1)] shadow-[0_20px_45px_rgba(0,63,54,0.08)] p-6 flex flex-col justify-between hover:border-[#00A878] hover:shadow-[0_25px_60px_rgba(0,168,120,0.2)] transition-all duration-300 group cursor-pointer"
                style={{
                  transform: `rotateY(${currentAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7FBF9] text-[#006B57] border border-[rgba(0,63,54,0.08)]">
                      {paper.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8F3E4] text-[#006B57] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A878]" />
                      ✦ AI Score {paper.aiScore || 99}%
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-[#12352F] group-hover:text-[#006B57] transition-colors line-clamp-2 leading-snug">
                    {paper.title}
                  </h4>

                  <p className="text-[11px] text-[#60736E] mt-1 line-clamp-1">
                    {paper.authors}
                  </p>

                  <div className="mt-3 p-3 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.06)] text-[11px] text-[#12352F] leading-relaxed line-clamp-3">
                    {paper.summaries?.tldr || paper.abstract}
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="pt-3 border-t border-[rgba(0,63,54,0.06)] flex items-center justify-between text-xs">
                  <span className="text-[#60736E] text-[11px]">
                    {paper.pages} Pages · {paper.venue}
                  </span>
                  <span className="font-bold text-[#006B57] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

    </div>
  );
};

export default DomeGallery;
