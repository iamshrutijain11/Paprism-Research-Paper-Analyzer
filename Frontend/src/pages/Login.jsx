import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import PaprismLogo from '../components/PaprismLogo';

export const Login = () => {
  const navigate = useNavigate();
  const { loginUser, isAuthenticated } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleFillDemo = () => {
    setEmail('elena.vance@university.edu');
    setPassword('Password123!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#F7FBF9] text-[#12352F] flex items-center justify-center p-4 sm:p-6 font-sans relative">
      
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] shadow-[0_20px_50px_rgba(0,63,54,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
        
        {/* Left Side */}
        <div className="md:col-span-5 bg-[#003F36] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-8 group">
              <PaprismLogo variant="light" size="md" showTagline={true} />
            </Link>

            <h2 className="font-display font-bold text-3xl text-white mt-4 mb-3 leading-tight">
              Research <br />
              Simplified.
            </h2>

            <p className="text-xs text-[#C8F3E4]/80 leading-relaxed max-w-xs">
              Upload complex research PDFs, extract verified citations, and learn faster with grounded AI assistants.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-[#C8F3E4]/15 flex items-center gap-2 text-[11px] text-[#C8F3E4]/70">
            <ShieldCheck className="w-4 h-4 text-[#00A878]" />
            <span>Secure JWT Authentication</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto space-y-6">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-[#12352F] tracking-tight">
                Welcome Back
              </h3>
              <p className="text-xs text-[#60736E] mt-1">
                Enter your credentials to access your research workspace.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#12352F] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#60736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F] placeholder:text-[#60736E]/60 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#12352F]">
                    Password
                  </label>
                  <span className="text-[11px] text-[#006B57] cursor-pointer hover:underline">
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#60736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F] placeholder:text-[#60736E]/60 shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-md transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-2 rounded-xl bg-[#C8F3E4] hover:bg-[#b2ebd8] text-[#003F36] text-[11px] font-bold border border-[#00A878]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00A878]" />
                <span>Fill Demo Scholar Account</span>
              </button>
            </form>

            <div className="pt-4 border-t border-[rgba(0,63,54,0.06)] text-center text-xs text-[#60736E]">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-[#006B57] hover:underline">
                Create an account
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
