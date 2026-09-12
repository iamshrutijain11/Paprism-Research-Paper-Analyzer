import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import FlashcardCard from '../components/FlashcardCard';
import { useUser } from '../context/UserContext';
import { Layers, ArrowLeft, ArrowRight, RotateCcw, Check, Sparkles, RefreshCw } from 'lucide-react';
import { quizService } from '../services/quizService';

export const Flashcards = () => {
  const navigate = useNavigate();
  const { activePaper, papers, selectPaper } = useUser();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customFlashcards, setCustomFlashcards] = useState(null);

  const flashcards = customFlashcards || activePaper?.flashcards || [];
  const total = flashcards.length;

  const handleGenerateFlashcards = async () => {
    if (!activePaper?.id || isGenerating) return;
    setIsGenerating(true);
    try {
      const generated = await quizService.generateFlashcards(activePaper.id);
      if (Array.isArray(generated) && generated.length > 0) {
        setCustomFlashcards(generated);
        setCurrentIdx(0);
      }
    } catch (err) {
      console.warn('Flashcard generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };


  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

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
                ✦ Active Recall Engine
              </span>
              <h1 className="font-display font-bold text-3xl text-[#12352F] tracking-tight">
                Revision Flashcards
              </h1>
              <p className="text-xs text-[#60736E] mt-1">
                Auto-generated conceptual cards derived from {activePaper?.title}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#60736E]">Active Paper:</span>
              <select
                value={activePaper?.id}
                onChange={(e) => {
                  selectPaper(e.target.value);
                  setCurrentIdx(0);
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-[rgba(0,63,54,0.1)] text-xs font-semibold text-[#12352F] focus:outline-none focus:border-[#00A878]"
              >
                {papers.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Flashcard Carousel */}
          {total > 0 ? (
            <div className="space-y-6">
              {/* Progress pill */}
              <div className="flex items-center justify-between max-w-lg mx-auto text-xs text-[#60736E]">
                <span>Progress: <strong className="text-[#12352F]">{currentIdx + 1}</strong> of {total}</span>
                <div className="flex gap-1.5">
                  {flashcards.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-1.5 rounded-full cursor-pointer transition-all ${
                        i === currentIdx ? 'w-6 bg-[#00A878]' : 'w-2 bg-[rgba(0,63,54,0.15)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Card Component */}
              <FlashcardCard
                card={flashcards[currentIdx]}
                index={currentIdx}
                total={total}
              />

              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[rgba(0,63,54,0.1)] hover:bg-[#F7FBF9] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#12352F] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentIdx(0)}
                  className="p-2.5 rounded-xl bg-white border border-[rgba(0,63,54,0.1)] hover:bg-[#F7FBF9] text-[#60736E] text-xs shadow-xs cursor-pointer"
                  title="Reset Deck"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIdx === total - 1}
                  className="px-5 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009168] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] space-y-4">
              <Layers className="w-8 h-8 text-[#60736E] mx-auto opacity-50" />
              <div>
                <h3 className="font-display font-bold text-base text-[#12352F]">No flashcards available</h3>
                <p className="text-xs text-[#60736E] mt-1">Generate conceptual active recall flashcards from this paper.</p>
              </div>
              {activePaper?.id && (
                <button
                  onClick={handleGenerateFlashcards}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Generating Flashcards...' : 'Generate Flashcards with AI'}</span>
                </button>
              )}
            </div>
          )}


        </div>
      </main>
    </div>
  );
};

export default Flashcards;
