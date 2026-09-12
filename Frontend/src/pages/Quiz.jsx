import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import QuizComponent from '../components/QuizComponent';
import { useUser } from '../context/UserContext';
import { HelpCircle, Sparkles } from 'lucide-react';

export const Quiz = () => {
  const { activePaper, papers, selectPaper } = useUser();

  return (
    <div className="flex min-h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />

        <div className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(0,63,54,0.06)]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878]">
                ✦ Comprehension Examination
              </span>
              <h1 className="font-display font-bold text-3xl text-[#12352F] tracking-tight">
                AI Multiple-Choice Quizzes
              </h1>
              <p className="text-xs text-[#60736E] mt-1">
                Derived directly from {activePaper?.title}.
              </p>
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

          {/* Quiz Engine */}
          <QuizComponent
            quizzes={activePaper?.quizzes}
            paperTitle={activePaper?.title}
            paperId={activePaper?.id}
          />


        </div>
      </main>
    </div>
  );
};

export default Quiz;
