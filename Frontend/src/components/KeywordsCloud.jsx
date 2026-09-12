import React from 'react';
import { Tag, Sparkles, Info } from 'lucide-react';

export const KeywordsCloud = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-base text-[#12352F] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#00A878]" />
          <span>Key Research Concepts & Entities</span>
        </h3>
        <span className="text-[10px] text-[#60736E]">
          {keywords.length} Extracted Terms
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {keywords.map((kw, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs hover:border-[#00A878]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display font-bold text-xs text-[#006B57]">
                ✦ {kw.term}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C8F3E4] text-[#003F36]">
                {kw.tag || 'Concept'}
              </span>
            </div>
            <p className="text-xs text-[#60736E] leading-relaxed">
              {kw.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordsCloud;
