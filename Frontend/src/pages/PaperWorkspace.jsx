import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Bookmark, 
  ChevronRight, 
  FileText, 
  ExternalLink,
  Tag,
  CheckCircle2,
  Sigma
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import AIChatPanel from '../components/AIChatPanel';

const NAV_TABS = [
  { id: 'reader', label: 'Document Reader', icon: BookOpen },
  { id: 'summary', label: 'Multi-Tier Summary', icon: Sparkles },
  { id: 'flashcards', label: 'Concept Cards', icon: Layers, badge: 'Active Recall' },
  { id: 'quiz', label: 'Self-Quiz Exam', icon: HelpCircle, badge: '5 MCQs' },
  { id: 'keywords', label: 'Key Taxonomy', icon: Tag },
];

export const PaperWorkspace = () => {
  const { paperId } = useParams();
  const { 
    activePaper, 
    selectPaper, 
    highlightedSectionId, 
    highlightSection 
  } = useUser();

  const [activeTab, setActiveTab] = useState('reader');
  const [readingLevel, setReadingLevel] = useState('plain'); // 'plain' | 'academic'
  const [bookmarked, setBookmarked] = useState(false);
  const [flippedCardIndex, setFlippedCardIndex] = useState(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState({});

  useEffect(() => {
    if (paperId && paperId !== activePaper?.id) {
      selectPaper(paperId);
    }
  }, [paperId, activePaper?.id, selectPaper]);

  const flashcards = (activePaper?.flashcards && activePaper.flashcards.length > 0)
    ? activePaper.flashcards.map(f => ({
        concept: f.q || f.concept || 'Core Finding',
        definition: f.a || f.definition || 'Detailed explanation grounded in the paper.',
        sourcePage: f.ref || f.sourcePage || `Page ${activePaper?.pages || 1} · Grounded Reference`
      }))
    : [
        {
          concept: 'Core Architecture',
          definition: activePaper?.structuredSummary?.approach || activePaper?.abstract || 'Streamlined neural architecture with modular parallel representations.',
          sourcePage: 'Page 1 · Methodology'
        }
      ];

  const quizQuestions = (activePaper?.quizzes && activePaper.quizzes.length > 0)
    ? activePaper.quizzes.map((q, idx) => ({
        id: q.id || idx + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct ?? q.correctAnswer ?? 0,
        explanation: q.explanation || 'Based directly on the theorems and benchmark results in the paper.'
      }))
    : [
        {
          id: 1,
          question: `What is the primary contribution of "${activePaper?.title || 'this paper'}"?`,
          options: [
            'Increasing complexity without benchmark gains',
            activePaper?.structuredSummary?.approach || 'Optimizing representation fidelity and computational scalability',
            'Eliminating all loss functions',
            'Restricting execution to single-threaded CPU'
          ],
          correctAnswer: 1,
          explanation: activePaper?.structuredSummary?.findings || 'The paper proves significant performance gains and scalability.'
        }
      ];


  return (
    <div className="h-screen w-screen bg-[#F7FBF9] text-[#12352F] font-sans flex flex-col overflow-hidden">
      
      {/* Top Workspace Navigation Bar */}
      <header className="h-14 bg-white/90 backdrop-blur-md border-b border-[rgba(0,63,54,0.08)] px-4 flex items-center justify-between flex-shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7FBF9] hover:bg-[#C8F3E4] text-[#003F36] text-xs font-semibold border border-[rgba(0,63,54,0.1)] transition-colors duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div className="h-4 w-[1px] bg-[rgba(0,63,54,0.1)]" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#003F36] text-[#C8F3E4] flex items-center justify-center font-bold text-xs">
              ✦
            </div>
            <h1 className="font-display font-bold text-sm text-[#12352F] truncate max-w-xs sm:max-w-md">
              {activePaper?.title || 'Attention Is All You Need'}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-[#C8F3E4] text-[#006B57] text-[10px] font-bold border border-[#00A878]/30">
              ✦ Grounded
            </span>
          </div>
        </div>

        {/* Action Controls & Simplification Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* Plain English vs Academic Toggle */}
          <div className="flex items-center bg-[#F7FBF9] p-1 rounded-xl border border-[rgba(0,63,54,0.08)] text-xs">
            <button
              onClick={() => setReadingLevel('plain')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                readingLevel === 'plain'
                  ? 'bg-[#00A878] text-white shadow-xs font-semibold'
                  : 'text-[#60736E] hover:text-[#006B57]'
              }`}
            >
              ✦ Plain English
            </button>
            <button
              onClick={() => setReadingLevel('academic')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                readingLevel === 'academic'
                  ? 'bg-[#003F36] text-white shadow-xs font-semibold'
                  : 'text-[#60736E] hover:text-[#006B57]'
              }`}
            >
              Academic Original
            </button>
          </div>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              bookmarked
                ? 'bg-[#C8F3E4] border-[#00A878] text-[#006B57]'
                : 'bg-white border-[rgba(0,63,54,0.08)] text-[#60736E] hover:text-[#006B57]'
            }`}
            title="Bookmark Paper"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3-Column Core Research Workspace Layout */}
      <div className="flex-1 flex w-full overflow-hidden p-3 gap-3">
        
        {/* ========================================================= */}
        {/* COLUMN 1: Paper Metadata & Tool Navigation (Width: 20%)   */}
        {/* ========================================================= */}
        <aside className="w-[20%] min-w-[220px] max-w-[280px] bg-white rounded-2xl border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.06)] flex flex-col justify-between overflow-hidden">
          <div className="p-4 overflow-y-auto">
            
            {/* Paper Header / Metadata Card */}
            <div className="mb-5 pb-4 border-b border-[rgba(0,63,54,0.08)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#60736E] bg-[#F7FBF9] px-2 py-0.5 rounded border border-[rgba(0,63,54,0.06)]">
                {activePaper?.venue || 'NeurIPS'} · {activePaper?.year || '2017'}
              </span>

              <h2 className="font-display font-bold text-[#12352F] text-base leading-snug mt-2 mb-1.5">
                {activePaper?.title}
              </h2>

              <p className="text-[11px] text-[#60736E] leading-relaxed mb-3">
                {activePaper?.authors}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-[#006B57] font-medium bg-[#F7FBF9] p-2.5 rounded-xl border border-[rgba(0,63,54,0.06)]">
                <div>
                  <span className="text-[#60736E] block text-[9px] uppercase">Citations</span>
                  <strong>{activePaper?.citations}</strong>
                </div>
                <div className="w-[1px] h-6 bg-[rgba(0,63,54,0.1)]" />
                <div>
                  <span className="text-[#60736E] block text-[9px] uppercase">Length</span>
                  <strong>{activePaper?.pages} Pages</strong>
                </div>
                <div className="w-[1px] h-6 bg-[rgba(0,63,54,0.1)]" />
                <div>
                  <span className="text-[#60736E] block text-[9px] uppercase">AI Score</span>
                  <strong className="text-[#00A878]">{activePaper?.aiScore}%</strong>
                </div>
              </div>
            </div>

            {/* Vertical Navigation Menu */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#60736E] mb-2 px-1">
                Workspace Modes
              </p>
              <nav className="space-y-1">
                {NAV_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#003F36] text-white shadow-sm font-semibold'
                          : 'text-[#12352F] hover:bg-[#F7FBF9] hover:text-[#006B57]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8F3E4]' : 'text-[#60736E]'}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && !isActive && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C8F3E4] text-[#006B57] font-bold">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Document Outline Quick Navigation */}
            <div className="mt-6 pt-4 border-t border-[rgba(0,63,54,0.08)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#60736E] mb-2 px-1">
                Sections in Paper
              </p>
              <div className="space-y-1">
                {activePaper?.sections?.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveTab('reader');
                      highlightSection(sec.id);
                      const el = document.getElementById(sec.id);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg transition-colors truncate cursor-pointer ${
                      highlightedSectionId === sec.id
                        ? 'bg-[#C8F3E4] text-[#003F36] font-bold'
                        : 'text-[#60736E] hover:text-[#006B57] hover:bg-[#F7FBF9]'
                    }`}
                  >
                    ✦ {sec.title}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* DOI / Citation Footer */}
          <div className="p-3 bg-[#F7FBF9] border-t border-[rgba(0,63,54,0.08)] text-[10px] text-[#60736E] flex items-center justify-between">
            <span className="truncate font-mono">{activePaper?.doi}</span>
            <ExternalLink className="w-3 h-3 text-[#006B57]" />
          </div>
        </aside>

        {/* ========================================================= */}
        {/* COLUMN 2: The Document Reader (Width: 50%)                */}
        {/* ========================================================= */}
        <main className="flex-1 bg-white rounded-2xl border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.06)] flex flex-col overflow-hidden relative">
          
          {/* Reader Top Sub-Header */}
          <div className="px-8 py-3.5 bg-white border-b border-[rgba(0,63,54,0.06)] flex items-center justify-between text-xs text-[#60736E]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#006B57]">✦ Active View:</span>
              <span className="capitalize font-medium text-[#12352F]">
                {NAV_TABS.find(t => t.id === activeTab)?.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>Reading Mode: <strong className="text-[#006B57] capitalize">{readingLevel}</strong></span>
              <span>·</span>
              <span>100% Citation Grounded</span>
            </div>
          </div>

          {/* Main Scrollable Document Canvas with Editorial Spacing */}
          <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 scroll-smooth">
            
            {/* VIEW MODE: Document Reader */}
            {activeTab === 'reader' && (
              <div className="max-w-2xl mx-auto space-y-8 font-serif leading-relaxed">
                
                {/* Paper Editorial Title & Abstract Header */}
                <div className="text-center pb-6 border-b border-[rgba(0,63,54,0.08)]">
                  <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#00A878]">
                    NeurIPS Research Publication
                  </span>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#12352F] tracking-tight mt-2 mb-3 leading-tight">
                    {activePaper?.title}
                  </h1>
                  <p className="font-sans text-xs text-[#60736E] max-w-lg mx-auto">
                    {activePaper?.authors} — {activePaper?.institution}
                  </p>
                </div>

                {/* Plain English Mode Banner if toggled */}
                {readingLevel === 'plain' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-gradient-to-r from-[#C8F3E4]/70 to-[#F7FBF9] border border-[#00A878]/30 text-xs font-sans text-[#12352F] shadow-xs"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#006B57] mb-2">
                      <Sparkles className="w-4 h-4 text-[#00A878]" />
                      <span>✦ Plain English Simplifier Active</span>
                    </div>
                    <p className="leading-relaxed">
                      {activePaper?.simpleSummary}
                    </p>
                  </motion.div>
                )}

                {/* Render Each Section of the Paper */}
                {activePaper?.sections?.map((sec) => {
                  const isHighlighted = highlightedSectionId === sec.id;

                  return (
                    <motion.section
                      key={sec.id}
                      id={sec.id}
                      animate={isHighlighted ? { scale: [1, 1.015, 1] } : {}}
                      transition={{ duration: 0.4 }}
                      className={`p-6 rounded-2xl transition-all duration-500 border ${
                        isHighlighted
                          ? 'bg-[#C8F3E4]/40 border-[#00A878] ring-4 ring-[#00A878]/20 shadow-lg'
                          : 'bg-transparent border-transparent hover:border-[rgba(0,63,54,0.06)] hover:bg-[#F7FBF9]/60'
                      }`}
                    >
                      {/* Section Heading & Page Anchor */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="font-display font-bold text-lg text-[#12352F]">
                          {sec.title}
                        </h3>
                        <span className="font-sans text-[10px] font-semibold text-[#60736E] px-2 py-0.5 rounded bg-[#F7FBF9] border border-[rgba(0,63,54,0.08)]">
                          Page {sec.page}
                        </span>
                      </div>

                      {/* Section Text */}
                      <div className="text-sm font-sans text-[#12352F]/90 leading-relaxed space-y-3">
                        {sec.content.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>

                      {/* Interactive Section AI Badge */}
                      <div className="mt-4 pt-3 border-t border-[rgba(0,63,54,0.06)] flex items-center justify-between font-sans text-xs">
                        <span className="text-[11px] text-[#60736E] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
                          Verified vector chunk #{sec.id}
                        </span>

                        <button
                          onClick={() => highlightSection(sec.id)}
                          className="text-[11px] font-semibold text-[#006B57] hover:text-[#00A878] flex items-center gap-1 cursor-pointer"
                        >
                          <span>✦ Highlight Passage</span>
                        </button>
                      </div>
                    </motion.section>
                  );
                })}

                {/* Mathematical Insight Feature Box */}
                <div className="p-6 rounded-2xl bg-[#003F36] text-white border border-[#C8F3E4]/20 shadow-md space-y-4 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#80edd0] flex items-center gap-1">
                      <Sigma className="w-3.5 h-3.5" /> Key Formulation
                    </span>
                    <span className="text-[11px] text-[#C8F3E4]/80">Formula (1)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-black/30 border border-[#C8F3E4]/10 text-center font-mono text-base text-[#C8F3E4]">
                    Attention(Q, K, V) = softmax(QK^T / √d_k) · V
                  </div>

                  <p className="text-xs text-[#C8F3E4]/80 leading-relaxed">
                    <strong>Intuitive Breakdown:</strong> Computes the compatibility of queries with keys, scales by square root of dimensionality to avoid vanishing gradients, and weights the values accordingly.
                  </p>
                </div>
              </div>
            )}

            {/* VIEW MODE: AI Editorial Summary */}
            {activeTab === 'summary' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="p-6 rounded-2xl bg-[#C8F3E4]/40 border border-[#00A878]/30">
                  <h3 className="font-display font-bold text-lg text-[#003F36] mb-2">
                    ✦ Multi-Tier Synthesis
                  </h3>
                  <p className="text-sm text-[#12352F] leading-relaxed">
                    {activePaper?.summaries?.beginner || activePaper?.summaries?.intermediate || activePaper?.summaries?.tldr || activePaper?.abstract || 'Multi-tier synthesis available.'}
                  </p>
                </div>


                <div className="p-6 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] space-y-3">
                  <h4 className="font-display font-bold text-sm text-[#12352F]">
                    Core Technical Contribution
                  </h4>
                  <p className="text-xs text-[#60736E] leading-relaxed">
                    {activePaper?.structuredSummary?.approach || 'Elimination of recurrence in favor of multi-head self-attention mechanisms.'}
                  </p>
                </div>
              </div>
            )}

            {/* VIEW MODE: Flashcards */}
            {activeTab === 'flashcards' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center">
                  <h3 className="font-display font-bold text-xl text-[#12352F]">
                    Interactive Concept Flashcards
                  </h3>
                  <p className="text-xs text-[#60736E] mt-1">
                    Click any card to flip between concept and grounded definition.
                  </p>
                </div>

                <div className="space-y-4">
                  {flashcards.map((card, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFlippedCardIndex(flippedCardIndex === idx ? null : idx)}
                      className="cursor-pointer p-6 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.1)] hover:border-[#00A878] shadow-xs transition-all"
                    >
                      <span className="text-[10px] uppercase font-bold text-[#00A878] block mb-1">
                        {flippedCardIndex === idx ? 'Definition / Grounded Paper Ref' : 'Core Concept (Click to reveal)'}
                      </span>
                      <h4 className="font-display font-bold text-base text-[#12352F]">
                        {flippedCardIndex === idx ? card.definition : card.concept}
                      </h4>
                      <p className="text-[11px] text-[#60736E] mt-3">
                        {card.sourcePage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW MODE: Quizzes */}
            {activeTab === 'quiz' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center">
                  <h3 className="font-display font-bold text-xl text-[#12352F]">
                    Active Recall Comprehension Quiz
                  </h3>
                  <p className="text-xs text-[#60736E] mt-1">
                    Test your understanding of the core theorems and findings.
                  </p>
                </div>

                <div className="space-y-6">
                  {quizQuestions.map((q) => (
                    <div key={q.id} className="p-6 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs space-y-4">
                      <h4 className="font-display font-bold text-sm text-[#12352F]">
                        {q.id}. {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedQuizAnswers[q.id] === optIdx;
                          const isCorrect = optIdx === q.correctAnswer;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => setSelectedQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className={`w-full p-3 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-50 border-[#00A878] text-[#006B57]'
                                    : 'bg-rose-50 border-rose-400 text-rose-800'
                                  : 'bg-[#F7FBF9] border-[rgba(0,63,54,0.06)] text-[#12352F] hover:border-[#00A878]/30'
                              }`}
                            >
                              <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {selectedQuizAnswers[q.id] !== undefined && (
                        <div className="p-3 rounded-xl bg-[#C8F3E4]/30 border border-[#00A878]/20 text-[11px] text-[#006B57] leading-relaxed">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW MODE: Keywords */}
            {activeTab === 'keywords' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center">
                  <h3 className="font-display font-bold text-xl text-[#12352F]">
                    Indexed Paper Vocabulary & Taxonomy
                  </h3>
                  <p className="text-xs text-[#60736E] mt-1">
                    Core technical entities and high-density frequency keywords.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center">
                  {['Self-Attention', 'Multi-Head Attention', 'Scaled Dot-Product', 'Positional Encoding', 'Transformer', 'BLEU Score', 'Encoder-Decoder', 'Sequence-to-Sequence', 'LayerNorm', 'Feed-Forward Network'].map((kw, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-[rgba(0,63,54,0.1)] text-xs font-semibold text-[#006B57] shadow-xs"
                    >
                      ✦ {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: Grounded AI Research Chatbot (Width: 30%)       */}
        {/* ========================================================= */}
        <aside className="w-[30%] min-w-[280px] max-w-[380px] h-full flex flex-col">
          <AIChatPanel activePaperId={activePaper?.id} />
        </aside>

      </div>
    </div>
  );
};

export default PaperWorkspace;
