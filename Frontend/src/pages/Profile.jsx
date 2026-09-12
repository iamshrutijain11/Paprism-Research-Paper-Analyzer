import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import { 
  User, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const Profile = () => {
  const { user, papers } = useUser();

  return (
    <div className="flex min-h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />

        <div className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-8">
          
          {/* Profile Header Card */}
          <div className="p-8 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-[0_12px_36px_rgba(0,64,54,0.04)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-[#00A878]/30 shadow-md"
            />

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display font-bold text-2xl text-[#12352F]">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C8F3E4] text-[#006B57] text-[11px] font-bold">
                  ✦ Active Scholar
                </span>
              </div>

              <p className="text-xs text-[#60736E] flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <GraduationCap className="w-4 h-4 text-[#00A878]" />
                {user?.role || 'ML Researcher'} · {user?.institution || 'Academic Institute'}
              </p>

              <p className="text-xs text-[#60736E]">
                {user?.email || 'elena.vance@university.edu'}
              </p>
            </div>
          </div>

          {/* Academic Study Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-6 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#C8F3E4] flex items-center justify-center text-[#006B57] mb-3">
                <BookOpen className="w-5 h-5 text-[#00A878]" />
              </div>
              <div className="font-display font-black text-3xl text-[#12352F]">
                {papers.length}
              </div>
              <p className="text-xs text-[#60736E] mt-1">Indexed Research Papers</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#003F36] flex items-center justify-center text-white mb-3">
                <Clock className="w-5 h-5 text-[#C8F3E4]" />
              </div>
              <div className="font-display font-black text-3xl text-[#00A878]">
                {user?.readingTimeSaved || '14.2 hrs'}
              </div>
              <p className="text-xs text-[#60736E] mt-1">Reading Time Saved</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#C8F3E4] flex items-center justify-center text-[#006B57] mb-3">
                <Award className="w-5 h-5 text-[#00A878]" />
              </div>
              <div className="font-display font-black text-3xl text-[#006B57]">
                96.4%
              </div>
              <p className="text-xs text-[#60736E] mt-1">Average Quiz Comprehension</p>
            </div>

          </div>

          {/* Connected Research Services */}
          <div className="p-6 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-[#12352F]">
              AI Pipeline Integrations
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.06)] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#12352F]">ChromaDB Vector Store</h4>
                  <p className="text-[11px] text-[#60736E]">Local vector database for semantic chunk retrieval</p>
                </div>
                <span className="text-[11px] font-bold text-[#006B57] bg-[#C8F3E4] px-2.5 py-1 rounded-md">
                  ✦ Connected
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.06)] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#12352F]">Groq LLM High-Speed Inference</h4>
                  <p className="text-[11px] text-[#60736E]">Llama 3 70B & Mixtral 8x7B execution</p>
                </div>
                <span className="text-[11px] font-bold text-[#006B57] bg-[#C8F3E4] px-2.5 py-1 rounded-md">
                  ✦ Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;
