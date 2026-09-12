import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SummaryView from '../components/SummaryView';
import KeywordsCloud from '../components/KeywordsCloud';
import { useUser } from '../context/UserContext';
import { Sparkles, ArrowLeft, BookOpen, Layers } from 'lucide-react';

export const Summary = () => {
  const navigate = useNavigate();
  const { activePaper, papers, selectPaper } = useUser();

  return (
    <div className="flex min-h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />

        <div className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* Top Paper Selector / Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(0,63,54,0.06)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/workspace')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#C8F3E4] text-[#003F36] text-xs font-semibold border border-[rgba(0,63,54,0.1)] transition-colors shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>3-Column Workspace</span>
              </button>

              <div className="h-4 w-[1px] bg-[rgba(0,63,54,0.1)]" />

              <span className="text-xs font-bold text-[#006B57] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#00A878]" />
                <span>Editorial Research Summary</span>
              </span>
            </div>

            {/* Document Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#60736E]">Active Paper:</span>
              <select
                value={activePaper?.id}
                onChange={(e) => selectPaper(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[rgba(0,63,54,0.1)] text-xs font-semibold text-[#12352F] focus:outline-none focus:border-[#00A878]"
              >
                {papers.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Summary Engine */}
          <SummaryView paper={activePaper} />

          {/* Keywords & Concepts Section */}
          <div className="pt-6 border-t border-[rgba(0,63,54,0.08)]">
            <KeywordsCloud keywords={activePaper?.keywords} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Summary;
