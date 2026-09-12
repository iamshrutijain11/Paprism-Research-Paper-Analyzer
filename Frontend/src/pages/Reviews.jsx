import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Plus, 
  X, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Award,
  Filter
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Dr. Marcus Vance',
    role: 'Postdoctoral Fellow',
    institution: 'Stanford AI Lab',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Computer Science & AI',
    paper: 'Attention Is All You Need',
    date: 'August 24, 2026',
    title: 'Cut my literature review time from 3 weeks to 3 days',
    content: 'Paprism’s 3-column workspace is revolutionary for keeping track of equations and citations. The multi-level beginner-to-technical breakdown allowed my undergrad lab assistants to contribute immediately without getting lost in math notation.',
    likes: 42,
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Sophia Chen',
    role: 'PhD Candidate',
    institution: 'MIT CSAIL',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Computer Science & AI',
    paper: 'Latent Diffusion Models',
    date: 'August 19, 2026',
    title: 'Byte AI chatbot with citation links is a game changer',
    content: 'Unlike other AI tools that hallucinate random facts, Byte only answers with exact page badges. When I click a citation, the PDF viewer smoothly scrolls and highlights the paragraph. Absolute 10/10.',
    likes: 38,
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Dr. Aris Thorne',
    role: 'Senior Bioinformatician',
    institution: 'Cambridge Genomics Institute',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Bioinformatics & Medicine',
    paper: 'Deep Residual Learning for Image Recognition',
    date: 'August 12, 2026',
    title: 'Flawless mathematical formula breakdowns',
    content: 'The LaTeX renderer and intuitive step-by-step matrix explanations saved me dozens of hours trying to parse dense supplementary material.',
    likes: 29,
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Elena Rostova',
    role: 'Master Student',
    institution: 'ETH Zürich',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Machine Learning',
    paper: 'Attention Is All You Need',
    date: 'July 28, 2026',
    title: 'Revision flashcards made exam prep effortless',
    content: 'The 3D concept flashcards paired with the auto-generated MCQ exams pinpointed exactly which theorems I was fuzzy on before my oral defense.',
    likes: 31,
    verified: true
  }
];

export const Reviews = () => {
  const { user } = useUser();
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('paprism_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});

  // New Review Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || 'Researcher',
    institution: user?.institution || 'Academic Institute',
    rating: 5,
    category: 'Computer Science & AI',
    paper: 'Attention Is All You Need',
    title: '',
    content: ''
  });

  useEffect(() => {
    localStorage.setItem('paprism_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const categories = ['All', 'Computer Science & AI', 'Bioinformatics & Medicine', 'Machine Learning', 'Physics & Math'];

  const filteredReviews = reviews.filter((r) => {
    return selectedCategory === 'All' || r.category === selectedCategory;
  });

  const handleLike = (id) => {
    if (likedReviews[id]) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
    setLikedReviews(prev => ({ ...prev, [id]: true }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      name: formData.name || 'Anonymous Scholar',
      role: formData.role || 'Student',
      institution: formData.institution || 'Academic University',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: Number(formData.rating),
      category: formData.category,
      paper: formData.paper,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: formData.title,
      content: formData.content,
      likes: 1,
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setFormData({
      name: user?.name || '',
      role: user?.role || 'Researcher',
      institution: user?.institution || 'Academic Institute',
      rating: 5,
      category: 'Computer Science & AI',
      paper: 'Attention Is All You Need',
      title: '',
      content: ''
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />

        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[rgba(0,63,54,0.08)]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878] bg-[#C8F3E4] px-3 py-1 rounded-full">
                  ✦ Community Wall & Social Proof
                </span>
                <span className="text-xs text-[#60736E]">Verified Academic Reviews</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#12352F] tracking-tight">
                Loved by Scholars & Researchers
              </h1>
              <p className="text-xs sm:text-sm text-[#60736E] mt-2 max-w-xl">
                See how researchers, PhD candidates, and students at world-leading institutions accelerate scientific discovery with Paprism.
              </p>
            </div>

            {/* Write a Review Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#00A878] hover:bg-[#009168] text-white font-bold text-xs tracking-wide shadow-[0_8px_25px_rgba(0,168,120,0.35)] transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Average Score', value: '4.9 / 5.0', icon: Star, color: 'text-amber-500' },
              { label: 'Time Saved', value: '14.2 hrs / paper', icon: TrendingUp, color: 'text-[#00A878]' },
              { label: 'Papers Refracted', value: '48,000+', icon: BookOpen, color: 'text-sky-500' },
              { label: 'Citation Accuracy', value: '100% Grounded', icon: ShieldCheck, color: 'text-[#00A878]' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-xl bg-[#C8F3E4]/50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-base sm:text-lg text-[#12352F]">
                    {stat.value}
                  </div>
                  <p className="text-[11px] text-[#60736E] font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <span className="text-xs font-bold text-[#60736E] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#00A878]" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#003F36] text-[#C8F3E4] shadow-xs'
                    : 'bg-white text-[#60736E] hover:text-[#003F36] border border-[rgba(0,63,54,0.08)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.04)] flex flex-col justify-between space-y-4 hover:border-[#00A878]/40 transition-all"
              >
                <div className="space-y-3">
                  {/* Top user header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#00A878]/30"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-bold text-sm text-[#12352F]">
                            {rev.name}
                          </h4>
                          {rev.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" title="Verified Academic Account" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#60736E]">
                          {rev.role} · {rev.institution}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  {/* Paper ref tag */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C8F3E4] text-[#006B57] font-semibold border border-[#00A878]/20">
                      {rev.category}
                    </span>
                    <span className="text-[#60736E]">Paper: <strong>{rev.paper}</strong></span>
                  </div>

                  {/* Review title & content */}
                  <div>
                    <h3 className="font-display font-bold text-base text-[#12352F] mb-1">
                      "{rev.title}"
                    </h3>
                    <p className="text-xs text-[#60736E] leading-relaxed">
                      {rev.content}
                    </p>
                  </div>
                </div>

                {/* Footer: Date & Like Counter */}
                <div className="pt-3 border-t border-[rgba(0,63,54,0.06)] flex items-center justify-between text-xs text-[#60736E]">
                  <span>{rev.date}</span>

                  <button
                    onClick={() => handleLike(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      likedReviews[rev.id]
                        ? 'bg-[#C8F3E4] border-[#00A878] text-[#006B57] font-bold'
                        : 'bg-[#F7FBF9] border-[rgba(0,63,54,0.08)] hover:border-[#00A878]/40 text-[#60736E]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#00A878]" />
                    <span>{rev.likes} Helpful</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[rgba(0,63,54,0.1)] space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#C8F3E4] text-[#006B57] flex items-center justify-center font-bold">
                    <Star className="w-4 h-4 text-[#00A878]" />
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#12352F]">
                    Write a Research Review
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-[#60736E] hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#12352F] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full px-3 py-2 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] text-xs text-[#12352F] focus:outline-none focus:border-[#00A878]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#12352F] mb-1">Role / Institution</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. PhD Candidate, Stanford"
                      className="w-full px-3 py-2 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] text-xs text-[#12352F] focus:outline-none focus:border-[#00A878]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#12352F] mb-1">Discipline Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] text-xs text-[#12352F] focus:outline-none focus:border-[#00A878]"
                    >
                      <option>Computer Science & AI</option>
                      <option>Bioinformatics & Medicine</option>
                      <option>Machine Learning</option>
                      <option>Physics & Math</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#12352F] mb-1">Rating</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] text-xs text-[#12352F] focus:outline-none focus:border-[#00A878]"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5 Outstanding)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5 Great)</option>
                      <option value="3">⭐⭐⭐ (3/5 Good)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#12352F] mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Cut my reading time by 80%"
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] text-xs text-[#12352F] focus:outline-none focus:border-[#00A878]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#12352F] mb-1">Detailed Feedback</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="How did Paprism help your academic research workflow?"
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] text-xs text-[#12352F] focus:outline-none focus:border-[#00A878]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#60736E] hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;
