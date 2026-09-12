import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Layers, 
  ChevronRight, 
  HelpCircle, 
  Eye, 
  Grid,
  Star,
  Heart
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import FloatingPaperCard from '../components/FloatingPaperCard';
import UploadZone from '../components/UploadZone';
import DomeGallery from '../components/creative/DomeGallery';
import { useUser } from '../context/UserContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, papers, selectPaper } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'dome'

  const categories = ['All', 'Machine Learning', 'Computer Vision', 'Generative AI', 'Natural Language Processing'];

  // Filter papers
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat =
      selectedCategory === 'All' ||
      paper.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex min-h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased">
      {/* 250px Dark Teal Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Sticky Header */}
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Dashboard Body Content */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878] bg-[#C8F3E4] px-2.5 py-0.5 rounded-md">
                  ✦ Research Workspace
                </span>
                <span className="text-xs text-[#60736E]">Academic Year 2026</span>
              </div>
              <h1 className="font-display font-bold text-3xl text-[#12352F] tracking-tight">
                Good day, {user?.name?.split(' ')[0] || 'Scholar'}
              </h1>
              <p className="text-xs text-[#60736E] mt-1">
                What breakthrough would you like to explore and simplify today?
              </p>
            </div>

            {/* Reading Analytics Pill Stats */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#C8F3E4] text-[#006B57] flex items-center justify-center font-bold text-xs">
                  <BookOpen className="w-4 h-4 text-[#00A878]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#60736E] font-medium block">Simplified</span>
                  <span className="font-display font-bold text-sm text-[#12352F]">{papers.length} Papers</span>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#003F36] text-white flex items-center justify-center font-bold text-xs">
                  <Clock className="w-4 h-4 text-[#C8F3E4]" />
                </div>
                <div>
                  <span className="text-[10px] text-[#60736E] font-medium block">Saved</span>
                  <span className="font-display font-bold text-sm text-[#00A878]">{user?.readingTimeSaved || '14.2 hrs'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <UploadZone onComplete={(newDoc) => navigate(newDoc?.id ? `/workspace/${newDoc.id}` : '/workspace')} />


          {/* Quick Learning Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => navigate('/summary')}
              className="p-5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] hover:border-[#00A878]/30 shadow-xs cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#C8F3E4] flex items-center justify-center text-[#006B57]">
                  <Sparkles className="w-4 h-4 text-[#00A878]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#60736E] group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-display font-bold text-sm text-[#12352F]">AI Editorial Summaries</h4>
              <p className="text-[11px] text-[#60736E] mt-0.5">Beginner, Intermediate, & Technical views</p>
            </div>

            <div
              onClick={() => navigate('/flashcards')}
              className="p-5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] hover:border-[#00A878]/30 shadow-xs cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#003F36] flex items-center justify-center text-white">
                  <Layers className="w-4 h-4 text-[#C8F3E4]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#60736E] group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-display font-bold text-sm text-[#12352F]">Revision Flashcards</h4>
              <p className="text-[11px] text-[#60736E] mt-0.5">3D flip cards with paper coordinates</p>
            </div>

            <div
              onClick={() => navigate('/quiz')}
              className="p-5 rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] hover:border-[#00A878]/30 shadow-xs cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#C8F3E4] flex items-center justify-center text-[#006B57]">
                  <HelpCircle className="w-4 h-4 text-[#00A878]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#60736E] group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-display font-bold text-sm text-[#12352F]">Active Recall Quizzes</h4>
              <p className="text-[11px] text-[#60736E] mt-0.5">Self-evaluations with answer explanations</p>
            </div>
          </div>

          {/* Section: Papers Showcase with View Toggle (Grid / 3D Dome) */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A878]">
                  ✦ Recent Research Documents
                </span>
                <h3 className="font-display font-bold text-xl text-[#12352F]">
                  Indexed Papers ({filteredPapers.length})
                </h3>
              </div>

              {/* Controls: Category Filter + Grid/Dome View Toggle */}
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-white p-1 rounded-xl border border-[rgba(0,63,54,0.08)] shadow-xs mr-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#003F36] text-white shadow-xs'
                        : 'text-[#60736E] hover:text-[#006B57]'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('dome')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'dome'
                        ? 'bg-[#003F36] text-white shadow-xs'
                        : 'text-[#60736E] hover:text-[#006B57]'
                    }`}
                    title="3D Dome Gallery"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px]">3D Dome</span>
                  </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-[#00A878] text-white shadow-xs'
                          : 'bg-white text-[#60736E] hover:bg-[#C8F3E4]/40 border border-[rgba(0,63,54,0.06)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Render View: Grid or 3D Dome */}
            {viewMode === 'dome' ? (
              <DomeGallery />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPapers.map((paper) => (
                  <FloatingPaperCard
                    key={paper.id}
                    paper={paper}
                    onClick={() => {
                      selectPaper(paper.id);
                      navigate('/workspace');
                    }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
