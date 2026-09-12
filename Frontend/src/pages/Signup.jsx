import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, Mail, User, GraduationCap, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';
import PaprismLogo from '../components/PaprismLogo';

export const Signup = () => {
  const navigate = useNavigate();
  const { registerUser, isAuthenticated } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (name.trim().length < 2) {
      setError('Full name must be at least 2 characters.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(name.trim(), email.trim(), password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#F7FBF9] text-[#12352F] flex items-center justify-center p-4 sm:p-6 font-sans relative">
      
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-[rgba(0,63,54,0.08)] shadow-[0_20px_50px_rgba(0,63,54,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Side */}
        <div className="md:col-span-5 bg-[#003F36] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-8 group">
              <PaprismLogo variant="light" size="md" showTagline={true} />
            </Link>

            <h2 className="font-display font-bold text-3xl text-white mt-4 mb-3 leading-tight">
              Start Understanding <br />
              Research Faster.
            </h2>

            <p className="text-xs text-[#C8F3E4]/80 leading-relaxed max-w-xs">
              Join thousands of students and researchers turning dense academic literature into crystal-clear insights.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-[#C8F3E4]/15 flex items-center gap-2 text-[11px] text-[#C8F3E4]/70">
            <ShieldCheck className="w-4 h-4 text-[#00A878]" />
            <span>Encrypted Credentials & Private Papers</span>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto space-y-5">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-[#12352F] tracking-tight">
                Create Account
              </h3>
              <p className="text-xs text-[#60736E] mt-1">
                Get started with your AI research assistant workspace.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#12352F] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#60736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12352F] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#60736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12352F] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#60736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12352F] mb-1">
                  Academic Role
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#60736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F]"
                  >
                    <option value="Student">Undergraduate / Graduate Student</option>
                    <option value="Researcher">Academic Researcher</option>
                    <option value="Educator">Faculty / Educator</option>
                    <option value="Professional">Industry Professional</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-md transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-3 border-t border-[rgba(0,63,54,0.06)] text-center text-xs text-[#60736E]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#006B57] hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
