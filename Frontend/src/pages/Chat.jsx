import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AIChatPanel from '../components/AIChatPanel';
import { useUser } from '../context/UserContext';
import { MessageSquareCode, ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';
import ByteMascot from '../components/ByteChatbot/ByteMascot';

export const Chat = () => {
  const navigate = useNavigate();
  const { activePaper, papers, selectPaper } = useUser();

  return (
    <div className="flex h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar />

        <div className="flex-1 p-6 max-w-5xl w-full mx-auto flex flex-col overflow-hidden">
          
          {/* Subheader with Document Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[rgba(0,63,54,0.06)] flex-shrink-0">
            <div className="flex items-center gap-3">
              <ByteMascot size="sm" mood="happy" className="w-7 h-7 flex-shrink-0" />
              <span className="font-display font-bold text-lg text-[#12352F] flex items-center gap-1.5">
                <span>Byte Conversational RAG Copilot</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#006B57] bg-[#C8F3E4] px-2.5 py-0.5 rounded-full border border-[#00A878]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00A878]" />
                100% Vector Grounded
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#60736E]">Target Paper:</span>
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

          {/* Full Height Chat Interface */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <AIChatPanel activePaperId={activePaper?.id} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Chat;
