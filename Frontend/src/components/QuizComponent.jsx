import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';
import { quizService } from '../services/quizService';

export const QuizComponent = ({ quizzes: initialQuizzes, paperTitle, paperId }) => {
  const [quizzes, setQuizzes] = useState(initialQuizzes || []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    if (initialQuizzes) {
      setQuizzes(initialQuizzes);
      setCurrentIdx(0);
      setSelectedAnswers({});
      setIsCompleted(false);
    }
  }, [initialQuizzes]);

  const handleGenerateQuiz = async () => {
    if (!paperId || isGenerating) return;
    setIsGenerating(true);
    try {
      const newQuizzes = await quizService.generateQuiz(paperId);
      if (Array.isArray(newQuizzes) && newQuizzes.length > 0) {
        setQuizzes(newQuizzes);
        setCurrentIdx(0);
        setSelectedAnswers({});
        setIsCompleted(false);
        setShowReview(false);
      }
    } catch (err) {
      console.warn('Quiz generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] space-y-4">
        <HelpCircle className="w-8 h-8 text-[#60736E] mx-auto opacity-60" />
        <div>
          <h3 className="font-display font-bold text-base text-[#12352F]">No Quizzes Generated Yet</h3>
          <p className="text-xs text-[#60736E] mt-1">Generate AI comprehension MCQs derived from the indexed paper text.</p>
        </div>
        {paperId && (
          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating MCQs...' : 'Generate Comprehension Quizzes'}</span>
          </button>
        )}
      </div>
    );
  }


  const currentQ = quizzes[currentIdx];
  const totalQuestions = quizzes.length;

  const handleSelectOption = (optIdx) => {
    if (selectedAnswers[currentIdx] !== undefined) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: optIdx
    });
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
    setShowReview(false);
  };

  // Calculate score
  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, ansIdx]) => {
    return ansIdx === quizzes[Number(qIdx)]?.correct ? acc + 1 : acc;
  }, 0);

  if (isCompleted && !showReview) {
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto p-8 sm:p-10 bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] shadow-[0_20px_50px_rgba(0,63,54,0.08)] text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#C8F3E4] text-[#006B57] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Award className="w-8 h-8 text-[#00A878]" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878]">
          Quiz Completed
        </span>

        <h3 className="font-display font-extrabold text-3xl text-[#12352F] mt-1 mb-1">
          Your Score
        </h3>

        <div className="font-display font-black text-5xl text-[#006B57] my-3">
          {score} <span className="text-2xl text-[#60736E] font-normal">/ {totalQuestions}</span>
        </div>

        <p className="text-sm font-semibold text-[#006B57] mb-6 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#00A878]" />
          <span>{percentage >= 70 ? 'Great understanding ✦' : 'Good effort! Review the concepts below.'}</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setShowReview(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#003F36] hover:bg-[#005045] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Review Answers
          </button>
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C8F3E4] hover:bg-[#b5eedb] text-[#003F36] text-xs font-semibold border border-[#00A878]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      
      {/* Header with Counter */}
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(0,63,54,0.08)]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A878]">
            Active Recall Quiz
          </span>
          <h3 className="font-display font-bold text-lg text-[#12352F]">
            {paperTitle}
          </h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#C8F3E4] text-[#006B57] font-bold text-xs">
          Question {currentIdx + 1} / {totalQuestions}
        </div>
      </div>

      {/* Active Question Card */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="p-8 bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.04)] space-y-6"
      >
        <h4 className="font-display font-bold text-lg text-[#12352F] leading-snug">
          {currentQ.question}
        </h4>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, optIdx) => {
            const hasAnswered = selectedAnswers[currentIdx] !== undefined;
            const isSelected = selectedAnswers[currentIdx] === optIdx;
            const isCorrect = optIdx === currentQ.correct;

            let btnStyle = 'bg-[#F7FBF9] text-[#12352F] border-[rgba(0,63,54,0.08)] hover:bg-[#C8F3E4]/30';

            if (hasAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-[#C8F3E4] text-[#006B57] border-[#00A878] font-bold ring-2 ring-[#00A878]/20';
              } else if (isSelected) {
                btnStyle = 'bg-red-50 text-red-700 border-red-300 font-medium';
              } else {
                btnStyle = 'bg-white text-[#60736E] border-[rgba(0,63,54,0.06)] opacity-60';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={hasAnswered}
                className={`w-full p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-[rgba(0,63,54,0.1)] flex items-center justify-center font-bold text-xs text-[#006B57]">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-[#00A878] flex-shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner */}
        {selectedAnswers[currentIdx] !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.08)] text-xs text-[#12352F] leading-relaxed"
          >
            <strong className="text-[#006B57] block mb-1">✦ Grounded Explanation:</strong>
            {currentQ.explanation}
          </motion.div>
        )}

        {/* Navigation Next Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(0,63,54,0.06)]">
          <span className="text-xs text-[#60736E]">
            {selectedAnswers[currentIdx] === undefined ? 'Select an answer to proceed' : 'Ready for next question'}
          </span>

          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentIdx] === undefined}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009168] disabled:bg-[rgba(0,63,54,0.15)] disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>{currentIdx < totalQuestions - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizComponent;
