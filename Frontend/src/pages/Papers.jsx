import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  MessageSquareCode, 
  Layers, 
  HelpCircle, 
  Calendar, 
  FileText, 
  Plus, 
  FileUp, 
  Filter, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import EmptyState from '../components/EmptyState';
import { useUser } from '../context/UserContext';

export const Papers = () => {
  const navigate = useNavigate();
  const { papers, selectPaper, handleDeletePaper } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Machine Learning', 'Computer Vision', 'Generative AI', 'Natural Language Processing'];

  const filtered = papers.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' ||
      p.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleOpenAction = (paperId, targetRoute) => {
    selectPaper(paperId);
    navigate(targetRoute);
  };

  return (
    <div className="flex min-h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878]">
                ✦ Document Repository
              </span>
              <h1 className="font-display font-bold text-3xl text-[#12352F] tracking-tight">
                My Research Papers
              </h1>
              <p className="text-xs text-[#60736E] mt-1">
                Manage, review, and launch AI study workflows across all indexed papers.
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Paper</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#003F36] text-white shadow-xs'
                    : 'bg-white text-[#60736E] hover:bg-[#C8F3E4]/50 border border-[rgba(0,63,54,0.06)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Papers Table / Cards List */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((paper) => (
                <div
                  key={paper.id}
                  className="p-6 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.04)] hover:border-[#00A878]/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Paper info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7FBF9] text-[#60736E] border border-[rgba(0,63,54,0.06)]">
                        {paper.venue} · {paper.year}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8F3E4] text-[#006B57] flex items-center gap-1 border border-[#00A878]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A878]" />
                        ✦ RAG {paper.status || 'READY'}
                      </span>
                      <span className="text-[10px] text-[#60736E]">
                        {paper.pages} Pages · {paper.fileSize || '2.4 MB'}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleOpenAction(paper.id, '/workspace')}
                      className="font-display font-bold text-lg text-[#12352F] hover:text-[#00A878] cursor-pointer transition-colors"
                    >
                      {paper.title}
                    </h3>

                    <p className="text-xs text-[#60736E] line-clamp-1">
                      {paper.authors} — {paper.institution}
                    </p>
                  </div>

                  {/* Right: Quick Action Launchers */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-[rgba(0,63,54,0.06)]">
                    <button
                      onClick={() => handleOpenAction(paper.id, '/workspace')}
                      className="px-3.5 py-2 rounded-xl bg-[#003F36] hover:bg-[#005045] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Workspace</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(paper.id, '/summary')}
                      className="px-3 py-2 rounded-xl bg-[#F7FBF9] hover:bg-[#C8F3E4] text-[#006B57] text-xs font-semibold border border-[rgba(0,63,54,0.1)] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#00A878]" />
                      <span>Summary</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(paper.id, '/chat')}
                      className="px-3 py-2 rounded-xl bg-[#F7FBF9] hover:bg-[#C8F3E4] text-[#006B57] text-xs font-semibold border border-[rgba(0,63,54,0.1)] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquareCode className="w-3.5 h-3.5 text-[#00A878]" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(paper.id, '/flashcards')}
                      className="px-3 py-2 rounded-xl bg-[#F7FBF9] hover:bg-[#C8F3E4] text-[#006B57] text-xs font-semibold border border-[rgba(0,63,54,0.1)] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#00A878]" />
                      <span>Flashcards</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(paper.id, '/quiz')}
                      className="px-3 py-2 rounded-xl bg-[#F7FBF9] hover:bg-[#C8F3E4] text-[#006B57] text-xs font-semibold border border-[rgba(0,63,54,0.1)] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#00A878]" />
                      <span>Quiz</span>
                    </button>

                    <button
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete "${paper.title}"?`)) {
                          try {
                            await handleDeletePaper(paper.id);
                          } catch (err) {
                            alert(err.userMessage || 'Could not delete paper');
                          }
                        }
                      }}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors ml-1 cursor-pointer"
                      title="Delete Paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              ))}
            </div>
          ) : (
            <EmptyState
              title="No papers found"
              description="No documents match your search query or filter."
              actionText="Upload Paper"
              onAction={() => navigate('/dashboard')}
            />
          )}

        </div>
      </main>
    </div>
  );
};

export default Papers;
