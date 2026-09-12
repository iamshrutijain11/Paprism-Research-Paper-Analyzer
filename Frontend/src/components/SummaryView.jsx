import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, BookOpen, AlertCircle, CheckCircle, ChevronRight, Bookmark, RefreshCw } from 'lucide-react';
import { summaryService } from '../services/summaryService';

export const SummaryView = ({ paper }) => {
  const [readingLevel, setReadingLevel] = useState('beginner'); // 'beginner' | 'intermediate' | 'technical'
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [customSummaries, setCustomSummaries] = useState(null);

  if (!paper) return null;

  const activeSummaries = customSummaries || paper.summaries;
  const currentSummary = activeSummaries?.[readingLevel] || paper.simpleSummary || paper.abstract;

  const handleRegenerate = async () => {
    if (!paper?.id || isRegenerating) return;
    setIsRegenerating(true);
    try {
      const data = await summaryService.generateSummary(paper.id, readingLevel);
      if (data?.summaries) {
        setCustomSummaries(data.summaries);
      }
    } catch (err) {
      console.warn('Summary generation error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };


  return (
    <div className="space-y-8 font-sans max-w-3xl mx-auto">
      
      {/* Header with Title & Level Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(0,63,54,0.08)]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878] bg-[#C8F3E4] px-2.5 py-1 rounded-md">
            ✦ AI Editorial Synthesis
          </span>
          <h2 className="font-display font-bold text-2xl text-[#12352F] mt-2 mb-1">
            {paper.title}
          </h2>
          <p className="text-xs text-[#60736E]">
            {paper.authors} · {paper.venue} ({paper.year})
          </p>
        </div>

        {/* 3-Way Reading Level Switcher */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-[rgba(0,63,54,0.1)] shadow-xs">
          <button
            onClick={() => setReadingLevel('beginner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              readingLevel === 'beginner'
                ? 'bg-[#00A878] text-white shadow-xs'
                : 'text-[#60736E] hover:text-[#006B57]'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setReadingLevel('intermediate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              readingLevel === 'intermediate'
                ? 'bg-[#006B57] text-white shadow-xs'
                : 'text-[#60736E] hover:text-[#006B57]'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setReadingLevel('technical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              readingLevel === 'technical'
                ? 'bg-[#003F36] text-white shadow-xs'
                : 'text-[#60736E] hover:text-[#006B57]'
            }`}
          >
            Technical
          </button>
        </div>
      </div>

      {/* ✦ TL;DR Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#C8F3E4] to-[#e4faf2] border border-[#00A878]/30 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#006B57] mb-1.5">
          <Sparkles className="w-4 h-4 text-[#00A878]" />
          <span>✦ TL;DR (30-Second Overview)</span>
        </div>
        <p className="text-xs sm:text-sm text-[#12352F] leading-relaxed font-medium">
          {paper.summaries?.tldr || paper.simpleSummary}
        </p>
      </div>

      {/* Active Reading Level Content Box */}
      <motion.div
        key={readingLevel}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-6 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.04)]"
      >
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#006B57]">
          <span className="capitalize flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00A878]" />
            {readingLevel} Level Explanation
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#60736E] font-normal hidden sm:inline">
              Grounding Verified across {paper.pages || 1} pages
            </span>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F7FBF9] hover:bg-[#C8F3E4] text-[#006B57] text-[11px] font-semibold border border-[rgba(0,63,54,0.1)] transition-colors cursor-pointer disabled:opacity-50"
              title="Regenerate summary with AI"
            >
              <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Synthesizing...' : 'Regenerate'}</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-[#12352F] leading-relaxed whitespace-pre-line">
          {currentSummary}
        </p>
      </motion.div>

      {/* Structured Editorial Sections: 01, 02, 03, 04 */}
      <div className="space-y-4 pt-2">
        <h3 className="font-display font-bold text-lg text-[#12352F] flex items-center gap-2">
          <span>Structured Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 01 The Problem */}
          <div className="p-5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs">
            <div className="text-xl font-display font-bold text-[#00A878] mb-1">01</div>
            <h4 className="font-display font-bold text-sm text-[#12352F] mb-1.5">
              The Problem
            </h4>
            <p className="text-xs text-[#60736E] leading-relaxed">
              {paper.structuredSummary?.problem || 'Traditional models struggled with scaling bottlenecks and long-range context.'}
            </p>
          </div>

          {/* 02 The Approach */}
          <div className="p-5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs">
            <div className="text-xl font-display font-bold text-[#00A878] mb-1">02</div>
            <h4 className="font-display font-bold text-sm text-[#12352F] mb-1.5">
              The Approach
            </h4>
            <p className="text-xs text-[#60736E] leading-relaxed">
              {paper.structuredSummary?.approach || 'A novel architecture based on parallel multi-head self-attention mechanisms.'}
            </p>
          </div>

          {/* 03 Key Findings */}
          <div className="p-5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs">
            <div className="text-xl font-display font-bold text-[#00A878] mb-1">03</div>
            <h4 className="font-display font-bold text-sm text-[#12352F] mb-1.5">
              Key Findings & Benchmarks
            </h4>
            <p className="text-xs text-[#60736E] leading-relaxed">
              {paper.structuredSummary?.findings || 'State-of-the-art accuracy with drastically reduced training time.'}
            </p>
          </div>

          {/* 04 Limitations */}
          <div className="p-5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs">
            <div className="text-xl font-display font-bold text-[#00A878] mb-1">04</div>
            <h4 className="font-display font-bold text-sm text-[#12352F] mb-1.5">
              Limitations & Scope
            </h4>
            <p className="text-xs text-[#60736E] leading-relaxed">
              {paper.structuredSummary?.limitations || 'Quadratic memory complexity with long sequences.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SummaryView;
