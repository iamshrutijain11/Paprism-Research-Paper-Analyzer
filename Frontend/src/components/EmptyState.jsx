import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';

export const EmptyState = ({ title = "No papers yet", description = "Your research workspace starts here.", actionText = "Upload Paper", onAction }) => {
  return (
    <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] relative overflow-hidden shadow-xs">
      {/* Subtle background ripple pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center font-mono text-xs select-none">
        ))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
      </div>

      <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-[#C8F3E4] text-[#006B57] flex items-center justify-center mb-4 shadow-sm">
          <span className="text-2xl font-bold text-[#00A878]">✦</span>
        </div>

        <h3 className="font-display font-bold text-lg text-[#12352F] mb-1">
          {title}
        </h3>
        <p className="text-xs text-[#60736E] mb-6 leading-relaxed">
          {description}
        </p>

        {onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
