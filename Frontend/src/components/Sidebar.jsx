import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquareCode, 
  Layers, 
  HelpCircle, 
  FileText, 
  Settings, 
  Sparkles, 
  PlusCircle, 
  ChevronRight,
  GraduationCap,
  LogOut,
  UserCheck,
  Bot,
  Star,
  Heart
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import ByteMascot from './ByteChatbot/ByteMascot';
import PaprismLogo from './PaprismLogo';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Papers', path: '/papers', icon: BookOpen },
  { name: 'Paper Workspace', path: '/workspace', icon: FileText, badge: '3-Col' },
  { name: 'Byte AI Chat', path: '/chat', icon: MessageSquareCode, badge: 'Byte ✦' },
  { name: 'Summary & Insights', path: '/summary', icon: Sparkles },
  { name: 'Flashcards', path: '/flashcards', icon: Layers },
  { name: 'Quizzes', path: '/quiz', icon: HelpCircle },
  { name: 'Reviews & Proof', path: '/reviews', icon: Star },
  { name: 'Feedback & Ideas', path: '/feedback', icon: Heart },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, activePaper, logoutUser, isAuthenticated } = useUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <aside className="w-[250px] flex-shrink-0 bg-[#003F36] text-white flex flex-col justify-between h-screen sticky top-0 border-r border-[#C8F3E4]/10 shadow-2xl z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 pb-4 border-b border-[#C8F3E4]/10">
          <Link to="/" className="flex items-center group">
            <PaprismLogo variant="light" size="md" showTagline={true} />
          </Link>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 py-3.5">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00A878] to-[#009168] hover:from-[#00ba84] hover:to-[#00A878] text-white font-medium text-xs tracking-wide shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Research Paper</span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="px-3 space-y-1 mt-1 overflow-y-auto max-h-[calc(100vh-380px)] no-scrollbar">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#C8F3E4]/40 mb-1.5">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#C8F3E4] text-[#003F36] font-semibold shadow-sm'
                    : 'text-[#C8F3E4]/80 hover:text-white hover:bg-[#C8F3E4]/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#003F36]' : 'text-[#C8F3E4]/70 group-hover:text-[#C8F3E4]'
                    }`}
                  />
                  <span className="tracking-tight">{item.name}</span>
                </div>

                {item.badge && !isActive && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#00A878]/30 text-[#C8F3E4] font-medium">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="w-1.5 h-1.5 rounded-full bg-[#00A878]"
                  />
                )}
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              to="/settings"
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                location.pathname === '/settings'
                  ? 'bg-[#C8F3E4] text-[#003F36] font-semibold'
                  : 'text-[#C8F3E4]/70 hover:text-white hover:bg-[#C8F3E4]/10'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & LLM</span>
            </Link>
          </div>
        </nav>

        {/* Active Paper Loaded Pill */}
        {activePaper && (
          <div className="mx-3 mt-4 p-3 rounded-xl bg-black/20 border border-[#C8F3E4]/10">
            <div className="flex items-center justify-between text-[10px] text-[#C8F3E4]/60 mb-1">
              <span className="font-semibold uppercase tracking-wider">Active Document</span>
              <span className="text-[#00A878] font-bold">✦ Indexed</span>
            </div>
            <p className="text-[11px] text-white font-medium line-clamp-1 leading-snug">
              {activePaper.title}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-[#C8F3E4]/60">
                {activePaper.pages} pages · {activePaper.category}
              </span>
              <Link
                to="/workspace"
                className="text-[10px] text-[#C8F3E4] hover:text-white flex items-center font-semibold gap-0.5 group"
              >
                Workspace <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* Byte Assistant Status Box */}
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-gradient-to-r from-[#00A878]/15 to-[#C8F3E4]/10 border border-[#00A878]/30 flex items-center gap-2.5">
          <ByteMascot size="sm" mood="happy" className="w-7 h-7 flex-shrink-0" />
          <div className="overflow-hidden flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-white">Byte Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] animate-pulse"></span>
            </div>
            <p className="text-[10px] text-[#C8F3E4]/80 truncate">24/7 AI Research Copilot</p>
          </div>
          <Link
            to="/chat"
            className="p-1 rounded bg-[#00A878] text-white hover:bg-[#008f66] transition-colors"
            title="Open Byte Chat"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer Profile & Auth Status */}
      <div className="p-3.5 border-t border-[#C8F3E4]/10 bg-black/15">
        <div className="flex items-center justify-between gap-2">
          <Link to="/profile" className="flex items-center gap-2.5 overflow-hidden flex-1 group">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-[#C8F3E4]/40 group-hover:border-[#00A878] transition-colors"
            />
            <div className="overflow-hidden flex-1">
              <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#C8F3E4] transition-colors">
                {user?.name || 'Researcher'}
              </h4>
              <p className="text-[10px] text-[#C8F3E4]/60 truncate flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-[#00A878]" />
                {user?.role || 'Student'}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-[#C8F3E4]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
