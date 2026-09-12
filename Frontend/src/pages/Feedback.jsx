import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Bug, 
  Lightbulb, 
  MessageSquare, 
  HelpCircle, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Smile,
  Frown,
  Meh,
  ThumbsUp
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';

const FEEDBACK_TYPES = [
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { id: 'quality', label: 'Simplification Quality', icon: Sparkles, color: 'text-[#00A878] bg-emerald-50 border-emerald-200' },
  { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-rose-500 bg-rose-50 border-rose-200' },
  { id: 'performance', label: 'Speed & UX', icon: Zap, color: 'text-sky-500 bg-sky-50 border-sky-200' },
];

const EMOJI_MOODS = [
  { id: 'love', emoji: '😍', label: 'Loving it' },
  { id: 'happy', emoji: '😃', label: 'Great' },
  { id: 'neutral', emoji: '😐', label: 'Okay' },
  { id: 'sad', emoji: '🙁', label: 'Needs Polish' },
  { id: 'angry', emoji: '😡', label: 'Frustrated' },
];

export const Feedback = () => {
  const { user, activePaper } = useUser();
  const [selectedType, setSelectedType] = useState('feature');
  const [selectedMood, setSelectedMood] = useState('love');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackBody, setFeedbackBody] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackBody.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Save locally
      const existing = JSON.parse(localStorage.getItem('paprism_user_feedbacks') || '[]');
      existing.unshift({
        id: `fb-${Date.now()}`,
        type: selectedType,
        mood: selectedMood,
        title: feedbackTitle,
        body: feedbackBody,
        email,
        date: new Date().toLocaleDateString()
      });
      localStorage.setItem('paprism_user_feedbacks', JSON.stringify(existing));
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFeedbackTitle('');
    setFeedbackBody('');
  };

  return (
    <div className="flex h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <Navbar />

        <div className="flex-1 p-6 md:p-10 max-w-4xl w-full mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8F3E4] text-[#006B57] border border-[#00A878]/30 text-xs font-bold mb-3">
              <Heart className="w-3.5 h-3.5 text-[#00A878] fill-[#00A878]" />
              <span>We Value Your Voice</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#12352F] tracking-tight">
              Share Feedback & Ideas
            </h1>
            <p className="text-xs sm:text-sm text-[#60736E] mt-2">
              Help us craft the ultimate research refraction platform. Tell us what features you want or report any issues you encounter.
            </p>
          </div>

          {isSubmitted ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] shadow-[0_20px_50px_rgba(0,63,54,0.08)] text-center max-w-md mx-auto space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#C8F3E4] text-[#006B57] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#00A878]" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#12352F]">
                Thank You for Your Feedback!
              </h3>
              <p className="text-xs text-[#60736E] leading-relaxed">
                Your input has been recorded and shared directly with the core engineering and AI research team.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Send Another Response
              </button>
            </motion.div>
          ) : (
            /* Main Feedback Form */
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] shadow-[0_20px_50px_rgba(0,63,54,0.06)] space-y-6">
              
              {/* Feedback Category */}
              <div>
                <label className="block text-xs font-bold text-[#12352F] mb-2.5">
                  1. What kind of feedback do you have?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {FEEDBACK_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = selectedType === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#C8F3E4]/50 border-[#00A878] ring-2 ring-[#00A878]/30 shadow-xs'
                            : 'bg-[#F7FBF9] border-[rgba(0,63,54,0.08)] hover:border-[#00A878]/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 border ${t.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs text-[#12352F]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience Rating */}
              <div>
                <label className="block text-xs font-bold text-[#12352F] mb-2.5">
                  2. How is your overall experience with Paprism so far?
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                  {EMOJI_MOODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`flex-1 min-w-[70px] p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedMood === m.id
                          ? 'bg-[#003F36] text-white border-[#003F36] shadow-sm scale-105'
                          : 'bg-[#F7FBF9] border-[rgba(0,63,54,0.08)] text-[#60736E] hover:bg-[#C8F3E4]/40'
                      }`}
                    >
                      <div className="text-2xl mb-1">{m.emoji}</div>
                      <div className="text-[10px] font-semibold">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#12352F] mb-1.5">
                    3. Topic / Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                    placeholder="e.g. Would love dark-mode contrast presets / BibTeX export"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.1)] text-xs text-[#12352F] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#12352F] mb-1.5">
                    4. Details & Suggestions
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={feedbackBody}
                    onChange={(e) => setFeedbackBody(e.target.value)}
                    placeholder="Describe your thoughts in detail..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.1)] text-xs text-[#12352F] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#12352F] mb-1.5">
                    5. Contact Email (Optional for updates)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@university.edu"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.1)] text-xs text-[#12352F] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#60736E] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A878]" />
                  Submitted anonymously or with your linked profile
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00A878] hover:bg-[#009168] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send Feedback'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
};

export default Feedback;
