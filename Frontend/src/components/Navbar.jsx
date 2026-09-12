import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileUp, Sparkles, User, Bell } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const Navbar = ({ searchQuery, setSearchQuery, onUploadClick }) => {
  const navigate = useNavigate();
  const { papers, activePaper, user } = useUser();

  return (
    <header className="sticky top-0 z-20 bg-[#F7FBF9]/90 backdrop-blur-md px-6 sm:px-8 py-3.5 border-b border-[rgba(0,63,54,0.06)] flex items-center justify-between gap-4 transition-colors duration-200">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <Search className="w-4 h-4 text-[#60736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery?.(e.target.value)}
          placeholder="Search across indexed papers, authors, topics (e.g. Attention, He et al.)..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[rgba(0,63,54,0.08)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F] placeholder:text-[#60736E]/60 shadow-xs"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Active Paper indicator */}
        {activePaper && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C8F3E4]/70 border border-[#00A878]/20 text-xs text-[#006B57] font-semibold">
            <span className="text-[#00A878]">✦</span>
            <span className="truncate max-w-[180px]">{activePaper.title}</span>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={onUploadClick || (() => navigate('/dashboard'))}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload PDF</span>
        </button>

        {/* Profile Avatar */}
        <Link
          to="/profile"
          className="w-8 h-8 rounded-full bg-white border border-[rgba(0,63,54,0.1)] flex items-center justify-center text-[#003F36] hover:border-[#00A878] transition-colors overflow-hidden flex-shrink-0"
        >
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-full h-full rounded-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
