import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  Cpu, 
  ShieldCheck, 
  BrainCircuit, 
  Layers, 
  HelpCircle, 
  MessageSquareCode, 
  BookOpen, 
  CheckCircle2,
  ChevronDown,
  Eye,
  Heart,
  LogIn,
  Upload,
  GraduationCap,
  Zap,
  Check
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import SplashCursor from '../components/creative/SplashCursor';
import FlowingMenu from '../components/creative/FlowingMenu';
import DomeGallery from '../components/creative/DomeGallery';
import PixelTransition from '../components/creative/PixelTransition';
import ByteMascot from '../components/ByteChatbot/ByteMascot';
import PaprismLogo from '../components/PaprismLogo';

export const Landing = () => {
  const navigate = useNavigate();
  const { selectPaper, papers } = useUser();
  const [activeFaq, setActiveFaq] = useState(null);

  const handleLaunchDemo = () => {
    selectPaper('attention-is-all-you-need');
    navigate('/workspace/attention-is-all-you-need');
  };

  const faqs = [
    {
      q: 'How does Paprism prevent AI hallucinations?',
      a: 'Paprism uses a strict Retrieval-Augmented Generation (RAG) pipeline with ChromaDB vector search. When you ask a question, the system retrieves only the relevant text passages from your uploaded PDF and grounds the Groq LLM response strictly with verifiable "Sources: Page X" citations.'
    },
    {
      q: 'What are Multi-Level Summaries?',
      a: 'Paprism allows you to switch between 3 comprehension depths: Beginner (plain English with analogies), Intermediate (balanced technical terms), and Technical (formal mathematical formulations & tensor architecture details).'
    },
    {
      q: 'What file formats and sizes are supported on the website?',
      a: 'You can upload PDF research papers up to 25 MB or import directly using arXiv links and DOI identifiers.'
    },
    {
      q: 'Which LLMs and Vector Databases power the platform?',
      a: 'Paprism runs on the high-speed Groq Llama 3 70B inference engine paired with ChromaDB local vector storage and PyMuPDF text extraction.'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F7FBF9] text-[#12352F] flex flex-col justify-between overflow-x-hidden font-sans relative">
      
      {/* ✦ Creative Element 1: Splash Cursor Effect */}
      <SplashCursor colorPalette={['#C8F3E4', '#00A878', '#006B57', '#003F36', '#a1edd8']} />

      {/* Website Header & Top Navigation matching exact screenshot */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2 z-20">
        {/* Exact Brand Logo with 'P' icon & 'READ. REFRACT. REVEAL.' */}
        <Link to="/" className="flex-shrink-0 group">
          <PaprismLogo size="md" showTagline={true} variant="dark" />
        </Link>

        {/* Center Nav Pills matching screenshot */}
        <nav className="hidden xl:flex items-center gap-2 text-xs font-semibold text-[#60736E]">
          {/* AI Copilot highlighted pill */}
          <Link
            to="/chat"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#C8F3E4] text-[#003F36] border border-[#00A878]/30 font-bold hover:bg-[#b2ebd8] transition-all shadow-2xs"
          >
            <span className="text-[#00A878]">✦</span>
            <span>AI Copilot</span>
          </Link>

          <a href="#flowing-menu" className="px-2.5 py-1.5 rounded-lg hover:text-[#00A878] hover:bg-white/60 transition-colors">
            Flowing Menu
          </a>

          <a href="#dome-gallery" className="px-2.5 py-1.5 rounded-lg hover:text-[#00A878] hover:bg-white/60 transition-colors">
            Demo Gallery
          </a>

          <a href="#features" className="px-2.5 py-1.5 rounded-lg hover:text-[#00A878] hover:bg-white/60 transition-colors">
            Features
          </a>

          <Link to="/feedback" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:text-[#00A878] hover:bg-white/60 transition-colors">
            <Heart className="w-3.5 h-3.5 text-[#00A878]" />
            <span>Feedback</span>
          </Link>

          <Link to="/papers" className="px-2.5 py-1.5 rounded-lg hover:text-[#00A878] hover:bg-white/60 transition-colors">
            Library
          </Link>

          {/* Intro pill */}
          <a
            href="#how-it-works"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#00A878]/25 text-[#006B57] bg-white/70 hover:bg-[#C8F3E4]/50 transition-colors"
          >
            <span className="text-[#00A878]">✦</span>
            <span>Intro</span>
          </a>

          {/* Review pill */}
          <Link
            to="/reviews"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#00A878]/25 text-[#006B57] bg-white/70 hover:bg-[#C8F3E4]/50 transition-colors"
          >
            <span>💚</span>
            <span>Review</span>
          </Link>
        </nav>

        {/* Action Buttons right matching screenshot */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#003F36] hover:text-[#00A878] transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-[0_6px_20px_rgba(0,168,120,0.35)] transition-all duration-200 active:scale-95 cursor-pointer group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Website Hero Section matching exact screenshot */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12 space-y-24">
        
        {/* Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            {/* Pill: Academic Paper Refraction & AI Copilot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(0,63,54,0.12)] text-[#006B57] text-xs font-semibold shadow-xs mb-6">
              <span className="text-[#00A878] font-bold">✦</span>
              <span>Academic Paper Refraction & AI Copilot</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.6rem] text-[#12352F] tracking-tight leading-[1.1] mb-6">
              Understand Research. <br />
              <span className="text-[#00A878]">Without the Overwhelm.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#60736E] text-base sm:text-lg font-normal leading-relaxed mb-8 max-w-xl">
              Transform complex, multi-page arXiv and IEEE research papers into crystal-clear explanations, verified page-grounded citations, active recall quizzes, and interactive 3D flashcards.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#00A878] hover:bg-[#009168] text-white font-display font-bold text-sm tracking-wide shadow-[0_8px_25px_rgba(0,168,120,0.35)] hover:shadow-[0_12px_30px_rgba(0,168,120,0.45)] transition-all duration-200 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Upload PDF Paper</span>
              </Link>

              <button
                onClick={handleLaunchDemo}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F7FBF9] text-[#12352F] font-display font-semibold text-sm border border-[rgba(0,63,54,0.12)] shadow-xs hover:border-[#00A878]/40 transition-all duration-200 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#00A878]" />
                <span>Explore Live Library</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#60736E]" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#60736E] pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00A878]" />
                <span>arXiv · NeurIPS · CVPR · Nature · ICML</span>
              </div>
              <span className="text-[#00A878] font-bold">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A878]" />
                <span>100% Page-Grounded References</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Exact Refraction Card Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center"
          >
            {/* Floating Top Badge: ✦ Zero Hallucinations */}
            <div className="self-start sm:ml-8 mb-2 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8F3E4] border border-[#00A878]/30 text-[#006B57] text-xs font-bold shadow-2xs">
                <span className="text-[#00A878]">✦</span>
                <span>Zero Hallucinations</span>
              </span>
            </div>

            {/* The Main Refraction Paper Card */}
            <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,63,54,0.08)] border border-[rgba(0,63,54,0.08)] space-y-4 relative transition-colors duration-200">
              
              {/* Box 1: OPTICAL KNOWLEDGE REFRACTION Banner */}
              <div className="bg-gradient-to-br from-[#003F36] via-[#004D40] to-[#00342D] rounded-2xl p-4 text-white border border-[#C8F3E4]/15 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#80edd0] border border-[#00A878]/60 bg-[#00A878]/20 px-2.5 py-0.5 rounded-full">
                    ✦ OPTICAL KNOWLEDGE REFRACTION
                  </span>
                  <span className="text-[11px] text-[#C8F3E4]/80 font-medium">
                    12 Pages · 2017
                  </span>
                </div>

                {/* Pipeline Stepper Visual */}
                <div className="flex items-center justify-between px-2 relative">
                  {/* Connector lines behind */}
                  <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#00A878]/30 z-0" />

                  {/* Step 1: Dense PDF */}
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className="w-8 h-8 rounded-xl bg-[#005a49] border border-[#00A878]/40 flex items-center justify-center text-[#80edd0]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-[#C8F3E4]/90 font-medium">Dense PDF</span>
                  </div>

                  {/* Step 2: Paprism AI (Glowing Central Core) */}
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#00A878] shadow-[0_0_15px_#00A878] flex items-center justify-center text-white">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] text-white font-bold tracking-wide">Paprism AI</span>
                  </div>

                  {/* Step 3: Mastery */}
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className="w-8 h-8 rounded-xl bg-[#005a49] border border-[#00A878]/40 flex items-center justify-center text-[#80edd0]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-[#C8F3E4]/90 font-medium">Mastery</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Paper Title & Meta */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006B57] bg-[#C8F3E4]/80 px-2.5 py-0.5 rounded-md">
                    ARTIFICIAL INTELLIGENCE · NLP
                  </span>
                  <span className="text-[11px] font-semibold text-[#00A878] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] animate-pulse"></span>
                    Refracted
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#12352F] tracking-tight">
                  Attention Is All You Need
                </h3>
                <p className="text-xs text-[#60736E] mt-0.5">
                  Ashish Vaswani et al. · Google Brain & Google Research
                </p>
              </div>

              {/* Box 3: Simplified Thesis */}
              <div className="p-3.5 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.08)]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006B57] flex items-center gap-1">
                    <span>💡</span> SIMPLIFIED THESIS
                  </span>
                  <span className="text-[10px] font-semibold text-white bg-[#00A878] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <FileText className="w-2.5 h-2.5" />
                    <span>Page 1 · Abstract</span>
                  </span>
                </div>
                <p className="text-xs text-[#12352F] leading-relaxed">
                  "Introduces the <strong>Transformer architecture</strong>, replacing recurrence with multi-head self-attention for parallel computation and state-of-the-art translation."
                </p>
              </div>

              {/* Box 4: Interactive Q&A with Byte */}
              <div className="p-3.5 rounded-2xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.08)] space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#00A878] p-0.5 flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                    <ByteMascot size="sm" mood="happy" className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#12352F]">
                      Why did transformers replace RNNs?
                    </h4>
                    <p className="text-xs text-[#60736E] leading-relaxed mt-1">
                      RNNs process words sequentially, causing memory bottlenecks. Transformers compute all tokens simultaneously via matrix attention.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(0,63,54,0.06)] flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-white bg-[#00A878] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <FileText className="w-2.5 h-2.5" />
                    <span>Page 2 · Background</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#006B57]">
                    100% Grounded
                  </span>
                </div>
              </div>

              {/* Box 5: Launch CTA Button */}
              <button
                onClick={handleLaunchDemo}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#003F36] hover:bg-[#005045] text-white text-xs font-bold tracking-wide text-center flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Launch Interactive Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C8F3E4]" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* ✦ Creative Element 2: Flowing Menu Section */}
        <section id="flowing-menu" className="w-full pt-10">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878] bg-[#C8F3E4] px-3 py-1 rounded-full">
              ✦ Discover Research Disciplines
            </span>
            <h2 className="font-display font-bold text-3xl text-[#12352F] mt-2">
              Explore Frontiers by Field
            </h2>
            <p className="text-xs text-[#60736E] mt-1 max-w-md mx-auto">
              Hover smoothly across scientific fields to reveal iconic breakthrough papers.
            </p>
          </div>
          <FlowingMenu />
        </section>

        {/* ✦ Creative Element 3: 3D Dome Gallery Section */}
        <section id="dome-gallery" className="w-full pt-10">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878] bg-[#C8F3E4] px-3 py-1 rounded-full">
              ✦ Spherical Paper Repository
            </span>
            <h2 className="font-display font-bold text-3xl text-[#12352F] mt-2">
              Interactive 3D Dome Workspace
            </h2>
            <p className="text-xs text-[#60736E] mt-1 max-w-md mx-auto">
              Drag, rotate, and interact with curated research papers on a 3D spherical dome canvas.
            </p>
          </div>
          <DomeGallery />
        </section>

        {/* ✦ Creative Element 4: Pixel Transition Feature Grid */}
        <section id="features" className="w-full pt-10">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878] bg-[#C8F3E4] px-3 py-1 rounded-full">
              ✦ Core Architecture
            </span>
            <h2 className="font-display font-bold text-3xl text-[#12352F] mt-2">
              Four Pillars of Paper Refraction
            </h2>
            <p className="text-xs text-[#60736E] mt-1 max-w-lg mx-auto">
              Hover over each interactive card below to trigger our Pixel Transition and reveal deep capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Multi-Level Simplification */}
            <PixelTransition
              className="border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.04)] h-80"
              firstContent={
                <div className="p-6 bg-white h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#C8F3E4] flex items-center justify-center text-[#006B57] mb-4">
                      <Sparkles className="w-6 h-6 text-[#00A878]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878]">Pillar 01</span>
                    <h3 className="font-display font-bold text-lg text-[#12352F] mt-1 mb-2">
                      Multi-Level Synthesis
                    </h3>
                    <p className="text-xs text-[#60736E] leading-relaxed">
                      Switch between Beginner, Intermediate, and Technical views with structured 01–04 section breakdowns.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#006B57] font-semibold flex items-center gap-1">
                    <span>✦ Hover to reveal details</span>
                  </div>
                </div>
              }
              secondContent={
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C8F3E4] tracking-wider">
                      ✦ Level Synthesis
                    </span>
                    <h4 className="font-display font-bold text-lg text-white mt-1 mb-2">
                      Beginner to Technical
                    </h4>
                    <p className="text-xs text-[#C8F3E4]/90 leading-relaxed">
                      Instant plain-English analogies or in-depth mathematical formulas on demand.
                    </p>
                  </div>
                  <Link
                    to="/summary"
                    className="py-2.5 px-4 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold text-center transition-colors"
                  >
                    Open Summary Page →
                  </Link>
                </div>
              }
            />

            {/* Card 2: Byte AI Copilot */}
            <PixelTransition
              className="border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.04)] h-80"
              firstContent={
                <div className="p-6 bg-white h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#003F36] flex items-center justify-center text-white mb-4">
                      <ByteMascot size="sm" mood="happy" className="w-8 h-8" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878]">Pillar 02</span>
                    <h3 className="font-display font-bold text-lg text-[#12352F] mt-1 mb-2">
                      Meet "Byte" AI Copilot
                    </h3>
                    <p className="text-xs text-[#60736E] leading-relaxed">
                      Your interactive 24/7 research bot. Ask paper questions, request math breakdowns, or take live interactive quizzes with grounded citations.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#006B57] font-semibold flex items-center gap-1">
                    <span>✦ Hover to reveal details</span>
                  </div>
                </div>
              }
              secondContent={
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C8F3E4] tracking-wider">
                      ✦ Interactive AI Companion
                    </span>
                    <h4 className="font-display font-bold text-lg text-white mt-1 mb-2">
                      Multi-Persona Byte
                    </h4>
                    <p className="text-xs text-[#C8F3E4]/90 leading-relaxed">
                      Switch between ELI5 analogies, Professor math rigor, TL;DR speed bullet points, and live active recall quizzes.
                    </p>
                  </div>
                  <Link
                    to="/chat"
                    className="py-2.5 px-4 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold text-center transition-colors"
                  >
                    Chat with Byte →
                  </Link>
                </div>
              }
            />

            {/* Card 3: Smart Quizzes */}
            <PixelTransition
              className="border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.04)] h-80"
              firstContent={
                <div className="p-6 bg-white h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#C8F3E4] flex items-center justify-center text-[#006B57] mb-4">
                      <HelpCircle className="w-6 h-6 text-[#00A878]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878]">Pillar 03</span>
                    <h3 className="font-display font-bold text-lg text-[#12352F] mt-1 mb-2">
                      AI Quizzes & MCQs
                    </h3>
                    <p className="text-xs text-[#60736E] leading-relaxed">
                      Auto-generate comprehension exams from paper content to prepare for assignments, viva defense, and research reviews.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#006B57] font-semibold flex items-center gap-1">
                    <span>✦ Hover to reveal details</span>
                  </div>
                </div>
              }
              secondContent={
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C8F3E4] tracking-wider">
                      ✦ Active Examination
                    </span>
                    <h4 className="font-display font-bold text-lg text-white mt-1 mb-2">
                      MCQ Generator
                    </h4>
                    <p className="text-xs text-[#C8F3E4]/90 leading-relaxed">
                      Timed tests with instant scoring and grounded answers.
                    </p>
                  </div>
                  <Link
                    to="/quiz"
                    className="py-2.5 px-4 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold text-center transition-colors"
                  >
                    Take a Quiz →
                  </Link>
                </div>
              }
            />

            {/* Card 4: Flashcards */}
            <PixelTransition
              className="border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.04)] h-80"
              firstContent={
                <div className="p-6 bg-white h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#003F36] flex items-center justify-center text-white mb-4">
                      <Layers className="w-6 h-6 text-[#00A878]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878]">Pillar 04</span>
                    <h3 className="font-display font-bold text-lg text-[#12352F] mt-1 mb-2">
                      Active Recall Cards
                    </h3>
                    <p className="text-xs text-[#60736E] leading-relaxed">
                      Extract key technical entities and generate flip flashcards linked directly to exact paper coordinate references.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#006B57] font-semibold flex items-center gap-1">
                    <span>✦ Hover to reveal details</span>
                  </div>
                </div>
              }
              secondContent={
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C8F3E4] tracking-wider">
                      ✦ 3D Memory Cards
                    </span>
                    <h4 className="font-display font-bold text-lg text-white mt-1 mb-2">
                      Spaced Repetition
                    </h4>
                    <p className="text-xs text-[#C8F3E4]/90 leading-relaxed">
                      Study key terms, definitions, and formulas with flipped flashcards.
                    </p>
                  </div>
                  <Link
                    to="/flashcards"
                    className="py-2.5 px-4 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold text-center transition-colors"
                  >
                    Open Flashcards →
                  </Link>
                </div>
              }
            />
          </div>
        </section>

        {/* How RAG Works Section */}
        <section id="how-it-works" className="w-full pt-10">
          <div className="bg-[#003F36] text-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,63,54,0.18)] border border-[#C8F3E4]/15">
            <div className="max-w-3xl mb-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8F3E4] bg-[#C8F3E4]/10 px-3 py-1 rounded-full border border-[#C8F3E4]/20">
                ✦ Under the Hood
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3 mb-4">
                How Paprism Ingests & Refracts Dense Papers
              </h2>
              <p className="text-[#C8F3E4]/80 text-sm leading-relaxed">
                Our dual pipeline transforms raw PDF documents into verifiable multi-layered intelligence in under 15 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'PDF Parsing', desc: 'PyMuPDF extracts raw text, math symbols, tables, and bounding boxes.' },
                { step: '02', title: 'Vector Embedding', desc: 'ChromaDB chunks and indexes semantic passages with dense embeddings.' },
                { step: '03', title: 'Groq LLM Synthesis', desc: 'Llama 3 70B synthesizes Beginner, Intermediate, and Technical models.' },
                { step: '04', title: '100% Grounded RAG', desc: 'All queries map directly back to exact page numbers and highlighted paragraphs.' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-black/20 border border-[#C8F3E4]/10">
                  <div className="font-mono text-2xl font-bold text-[#00A878] mb-2">{item.step}</div>
                  <h4 className="font-display font-bold text-base text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs text-[#C8F3E4]/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section id="faq" className="w-full pt-10 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878] bg-[#C8F3E4] px-3 py-1 rounded-full">
              ✦ Common Questions
            </span>
            <h2 className="font-display font-bold text-3xl text-[#12352F] mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[rgba(0,63,54,0.08)] shadow-2xs overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-display font-semibold text-sm text-[#12352F]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#00A878] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-4 pb-4 text-xs text-[#60736E] leading-relaxed border-t border-[rgba(0,63,54,0.05)] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Website Footer */}
      <footer className="w-full border-t border-[rgba(0,63,54,0.08)] bg-white/70 backdrop-blur-md mt-20 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#60736E]">
          <div className="flex items-center gap-3">
            <PaprismLogo size="sm" showTagline={true} />
          </div>

          <div className="flex items-center gap-6">
            <Link to="/papers" className="hover:text-[#00A878]">Papers</Link>
            <Link to="/workspace" className="hover:text-[#00A878]">Workspace</Link>
            <Link to="/summary" className="hover:text-[#00A878]">Summaries</Link>
            <Link to="/chat" className="hover:text-[#00A878]">Byte AI</Link>
            <Link to="/quiz" className="hover:text-[#00A878]">Quizzes</Link>
          </div>

          <p className="text-[11px] text-[#60736E]/70">
            © 2026 Paprism AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
