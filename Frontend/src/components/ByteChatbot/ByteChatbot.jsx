import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  RotateCcw, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink, 
  BookOpen, 
  HelpCircle, 
  Zap, 
  Layers, 
  MessageSquare,
  Bot,
  ChevronRight,
  GraduationCap,
  FileText
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import ByteMascot from './ByteMascot';
import { 
  BYTE_PERSONAS, 
  DEFAULT_BYTE_GREETING, 
  generateByteResponse, 
  speakWithByte, 
  stopByteSpeech 
} from '../../services/byteAiService';

const QUICK_ACTIONS = [
  { label: '⚡ 3-Bullet TL;DR', prompt: 'Give me a 3-bullet executive summary of the active paper' },
  { label: '🔍 Explain Self-Attention', prompt: 'Explain Self-Attention simply with an analogy' },
  { label: '🎯 Quiz Me!', prompt: 'Quiz me on the active paper concepts!' },
  { label: '📐 Explain the Math', prompt: 'Explain the Attention(Q,K,V) formula and softmax scaling' },
  { label: '🃏 Study Flashcards', prompt: 'Generate 2 flashcards from this paper' },
  { label: '🗺️ 3-Col Workspace', prompt: 'How do I use the 3-Column Workspace?' },
];

export const ByteChatbot = () => {
  const navigate = useNavigate();
  const { activePaper, user, papers, selectPaper } = useUser();

  // Widget States
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);

  // Chat States
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('paprism_byte_chat');
    return saved ? JSON.parse(saved) : [DEFAULT_BYTE_GREETING];
  });
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentMood, setCurrentMood] = useState('idle');
  const [selectedPersona, setSelectedPersona] = useState('ELI5');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [feedbackState, setFeedbackState] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({}); // { [quizId]: { selected: idx, isCorrect: bool } }

  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);

  // Save conversation in session storage
  useEffect(() => {
    sessionStorage.setItem('paprism_byte_chat', JSON.stringify(messages));
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Teaser auto-dismiss after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Web Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        // Automatically send after speech
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 200);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedPersona, activePaper]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setCurrentMood('listening');
      } catch (err) {
        console.error('Speech recognition start failed:', err);
      }
    }
  };

  const handleSendMessage = async (customPrompt) => {
    const query = (customPrompt || inputQuery).trim();
    if (!query || isThinking) return;

    // Add user message
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);
    setCurrentMood('thinking');

    try {
      const response = await generateByteResponse(query, selectedPersona, activePaper);
      
      const byteMsg = {
        id: `msg-byte-${Date.now()}`,
        sender: 'byte',
        text: response.text,
        mood: response.mood || 'happy',
        source: response.source,
        sourceId: response.sourceId,
        suggestions: response.suggestions,
        quiz: response.quiz,
        action: response.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, byteMsg]);
      setCurrentMood(response.mood || 'happy');

      if (voiceEnabled) {
        setIsSpeaking(true);
        setCurrentMood('speaking');
        speakWithByte(response.text, () => {
          setIsSpeaking(false);
          setCurrentMood('idle');
        });
      } else {
        setTimeout(() => setCurrentMood('idle'), 3000);
      }

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      console.error('Byte error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'byte',
          text: "Oops! My neural circuits experienced a momentary hiccup. Could you try asking that again?",
          mood: 'idle',
          time: 'Just now'
        }
      ]);
      setCurrentMood('idle');
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopByteSpeech();
      setIsSpeaking(false);
      setCurrentMood('idle');
    } else {
      setIsSpeaking(true);
      setCurrentMood('speaking');
      speakWithByte(text, () => {
        setIsSpeaking(false);
        setCurrentMood('idle');
      });
    }
  };

  const handleClearChat = () => {
    stopByteSpeech();
    setIsSpeaking(false);
    setMessages([DEFAULT_BYTE_GREETING]);
    sessionStorage.removeItem('paprism_byte_chat');
    setCurrentMood('happy');
    setTimeout(() => setCurrentMood('idle'), 1500);
  };

  const handleQuizAnswer = (quizId, optionIndex, correctIndex) => {
    if (quizAnswers[quizId]) return; // already answered
    const isCorrect = optionIndex === correctIndex;
    setQuizAnswers(prev => ({
      ...prev,
      [quizId]: { selected: optionIndex, isCorrect }
    }));
    setCurrentMood(isCorrect ? 'excited' : 'thinking');
    setTimeout(() => setCurrentMood('idle'), 2500);
  };

  const handleActionClick = (path) => {
    if (path) {
      navigate(path);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* 1. Global Floating Mascot Trigger Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-auto select-none">
        {/* Floating Teaser Greeting Bubble when widget is closed */}
        <AnimatePresence>
          {!isOpen && showTeaser && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-[0_10px_35px_rgba(0,63,54,0.18)] border border-[#00A878]/30 max-w-[280px] text-left mb-1 relative cursor-pointer group"
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
                setHasUnread(false);
              }}
            >
              {/* Close mini-teaser button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTeaser(false);
                }}
                className="absolute top-2 right-2 text-[#60736E] hover:text-[#003F36] p-0.5 rounded-full"
                title="Dismiss greeting"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse" />
                <span className="text-[11px] font-bold text-[#006B57]">Byte AI Assistant</span>
              </div>
              <p className="text-xs text-[#12352F] leading-snug font-medium">
                "Hi! I'm <strong>Byte</strong>. Need help simplifying {activePaper?.title ? `"${activePaper.title.slice(0, 20)}..."` : 'a paper'}?"
              </p>
              <div className="mt-2 text-[10px] text-[#00A878] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Click to chat with Byte</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Avatar Trigger Pill Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTeaser(false);
            setHasUnread(false);
            setIsMinimized(false);
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-[0_12px_40px_rgba(0,63,54,0.28)] border transition-all duration-300 cursor-pointer ${
            isOpen
              ? 'bg-[#003F36] text-white border-[#C8F3E4]/30 ring-4 ring-[#00A878]/20'
              : 'bg-gradient-to-r from-[#003F36] via-[#004D42] to-[#00A878] text-white border-[#C8F3E4]/30 hover:shadow-[0_16px_45px_rgba(0,168,120,0.4)]'
          }`}
          title="Open Byte AI Assistant"
        >
          {/* Animated Mascot Character */}
          <div className="relative">
            <ByteMascot 
              size="sm" 
              mood={isOpen ? currentMood : 'happy'} 
              isSpeaking={isSpeaking}
              className="w-7 h-7"
            />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-white animate-ping" />
            )}
          </div>

          {/* Label */}
          <div className="text-left">
            <div className="text-xs font-bold flex items-center gap-1">
              <span>Byte Robo</span>
            </div>
            <p className="text-[9.5px] text-[#C8F3E4]/80 font-medium">Grounded Copilot</p>
          </div>

          {/* Glowing Status Indicator Dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#80edd0] shadow-[0_0_8px_#80edd0] ml-1 flex-shrink-0 animate-pulse" />
        </motion.button>
      </div>

      {/* 2. Interactive Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : isExpanded ? 'calc(100vh - 40px)' : '640px',
              width: isExpanded ? 'calc(100vw - 40px)' : '440px',
            }}
            exit={{ opacity: 0, y: 30, scale: 0.92, transition: { duration: 0.2 } }}
            className={`fixed z-50 bg-white/95 backdrop-blur-xl border border-[rgba(0,63,54,0.14)] shadow-[0_24px_70px_rgba(0,40,34,0.24)] rounded-3xl flex flex-col overflow-hidden transition-all duration-200 ${
              isExpanded 
                ? 'top-5 left-5 right-5 bottom-5 max-w-none' 
                : 'bottom-24 right-6 max-w-[calc(100vw-2rem)]'
            }`}
          >
            {/* Header: Byte Identity & Control Bar */}
            <div className="p-3.5 bg-gradient-to-r from-[#003F36] via-[#004D42] to-[#006B57] text-white flex items-center justify-between border-b border-[#C8F3E4]/15 shadow-sm select-none">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <ByteMascot 
                    size="sm" 
                    mood={currentMood} 
                    isSpeaking={isSpeaking}
                    className="w-8 h-8"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00A878] border-2 border-[#003F36]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-1">
                      <span>Byte</span>
                      <span className="text-[#80edd0] text-xs">✦</span>
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C8F3E4]/20 text-[#C8F3E4] border border-[#C8F3E4]/20">
                      {BYTE_PERSONAS[selectedPersona].name}
                    </span>
                  </div>

                  {/* Target paper context chip */}
                  <p className="text-[10px] text-[#C8F3E4]/70 truncate max-w-[180px]" title={activePaper?.title}>
                    Target: {activePaper?.title || 'General ML Assistant'}
                  </p>
                </div>
              </div>

              {/* Header Action Tools */}
              <div className="flex items-center gap-1 text-[#C8F3E4]/80">
                {/* Voice Readout Toggle */}
                <button
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    if (!next && isSpeaking) {
                      stopByteSpeech();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    voiceEnabled ? 'bg-[#00A878] text-white' : 'hover:bg-white/10 text-[#C8F3E4]/70'
                  }`}
                  title={voiceEnabled ? "Voice Readout: Active" : "Enable Voice Readout"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Clear Chat */}
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#C8F3E4]/70 hover:text-white transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Expand / Minimize Window Mode */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:block p-1.5 rounded-lg hover:bg-white/10 text-[#C8F3E4]/70 hover:text-white transition-colors"
                  title={isExpanded ? "Restore standard size" : "Expand window"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#C8F3E4]/70 hover:text-white transition-colors ml-1"
                  title="Close Byte"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Persona Switcher Bar */}
            {!isMinimized && (
              <div className="px-3 py-2 bg-[#F7FBF9] border-b border-[rgba(0,63,54,0.06)] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar select-none">
                <span className="text-[10px] font-bold uppercase text-[#60736E] whitespace-nowrap mr-1 flex items-center gap-1">
                  <Bot className="w-3 h-3 text-[#00A878]" /> Persona:
                </span>
                <div className="flex items-center gap-1.5">
                  {Object.values(BYTE_PERSONAS).map((p) => {
                    const isSelected = selectedPersona === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPersona(p.id)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all duration-150 flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-[#003F36] text-[#C8F3E4] font-bold shadow-xs'
                            : 'bg-white text-[#60736E] hover:text-[#003F36] hover:bg-[#C8F3E4]/40 border border-[rgba(0,63,54,0.08)]'
                        }`}
                        title={p.tagline}
                      >
                        <span>{p.icon}</span>
                        <span>{p.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fast Quick Prompts Tray */}
            {!isMinimized && (
              <div className="px-3 py-1.5 bg-[#E8F7F0]/40 border-b border-[rgba(0,63,54,0.05)] flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
                <span className="text-[9px] font-bold uppercase text-[#006B57] whitespace-nowrap flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 text-[#00A878]" /> Quick:
                </span>
                {QUICK_ACTIONS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(item.prompt)}
                    disabled={isThinking}
                    className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded-md bg-white hover:bg-[#C8F3E4] text-[#006B57] border border-[#00A878]/20 transition-all font-semibold shadow-2xs hover:scale-[1.02] cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Message Stream Body */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#F7FBF9] to-white">
                {messages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  const isByte = msg.sender === 'byte';

                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender label header */}
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#60736E]">
                        {isByte ? (
                          <>
                            <span className="font-bold text-[#006B57] flex items-center gap-1">
                              <span className="text-[#00A878]">✦</span> Byte AI
                            </span>
                            <span>·</span>
                            <span>{msg.time || 'Just now'}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">You</span>
                            <span>·</span>
                            <span>{msg.time || 'Just now'}</span>
                          </>
                        )}
                      </div>

                      {/* Bubble content */}
                      <div
                        className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-[#003F36] text-white rounded-tr-xs font-normal'
                            : 'bg-white text-[#12352F] border border-[rgba(0,63,54,0.1)] rounded-tl-xs shadow-[0_4px_16px_rgba(0,63,54,0.04)]'
                        }`}
                      >
                        {/* Render Message Text with formatted code/math */}
                        <div className="whitespace-pre-line space-y-2">
                          {msg.text}
                        </div>

                        {/* Interactive In-Chat Quiz Card Component */}
                        {msg.quiz && (
                          <div className="mt-3.5 p-3 rounded-xl bg-[#F7FBF9] border border-[#00A878]/30 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#006B57] flex items-center gap-1">
                                <HelpCircle className="w-3 h-3 text-[#00A878]" />
                                Quick Knowledge Check
                              </span>
                              {quizAnswers[msg.quiz.id] && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  quizAnswers[msg.quiz.id].isCorrect 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {quizAnswers[msg.quiz.id].isCorrect ? '✓ Correct!' : '✗ Review concept'}
                                </span>
                              )}
                            </div>

                            <p className="font-semibold text-xs text-[#12352F] mb-2.5">
                              {msg.quiz.question}
                            </p>

                            <div className="space-y-1.5">
                              {msg.quiz.options.map((opt, oIdx) => {
                                const ans = quizAnswers[msg.quiz.id];
                                const isSelected = ans?.selected === oIdx;
                                const isCorrectChoice = oIdx === msg.quiz.correct;

                                let btnStyle = "bg-white hover:bg-[#C8F3E4]/50 border-[rgba(0,63,54,0.1)] text-[#12352F]";
                                if (ans) {
                                  if (isCorrectChoice) {
                                    btnStyle = "bg-emerald-500 text-white font-bold border-emerald-600 shadow-sm";
                                  } else if (isSelected && !ans.isCorrect) {
                                    btnStyle = "bg-rose-500 text-white font-medium border-rose-600";
                                  } else {
                                    btnStyle = "bg-white/50 text-[#60736E] border-gray-200 opacity-60";
                                  }
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={Boolean(ans)}
                                    onClick={() => handleQuizAnswer(msg.quiz.id, oIdx, msg.quiz.correct)}
                                    className={`w-full p-2.5 rounded-xl border text-[11px] text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {ans && isCorrectChoice && <Check className="w-3.5 h-3.5 text-white" />}
                                  </button>
                                );
                              })}
                            </div>

                            {quizAnswers[msg.quiz.id] && (
                              <div className="mt-2.5 p-2 rounded-lg bg-white border border-[rgba(0,63,54,0.06)] text-[10.5px] text-[#60736E]">
                                <strong className="text-[#006B57]">Explanation:</strong> {msg.quiz.explanation}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive In-Chat Quick Action Banner */}
                        {msg.action && (
                          <div className="mt-3 pt-2.5 border-t border-[rgba(0,63,54,0.08)] flex items-center justify-between">
                            <span className="text-[10.5px] text-[#60736E]">Ready to explore in depth?</span>
                            <button
                              onClick={() => handleActionClick(msg.action.path)}
                              className="px-2.5 py-1 rounded-lg bg-[#00A878] hover:bg-[#009168] text-white text-[10.5px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                            >
                              <span>{msg.action.label}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Citation & Audio Controls Footer */}
                        {isByte && (
                          <div className="mt-3 pt-2 border-t border-[rgba(0,63,54,0.08)] flex items-center justify-between text-[10px] text-[#60736E]">
                            {/* Source citation */}
                            {msg.source ? (
                              <button
                                onClick={() => {
                                  navigate('/workspace');
                                  if (window.innerWidth < 768) setIsOpen(false);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C8F3E4] text-[#006B57] font-semibold hover:bg-[#b5eedb] transition-colors cursor-pointer"
                              >
                                <BookOpen className="w-3 h-3 text-[#00A878]" />
                                <span>{msg.source}</span>
                              </button>
                            ) : (
                              <span className="text-[#00A878] font-semibold">✦ 100% Vector Grounded</span>
                            )}

                            {/* Tools: Audio Readout & Copy */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSpeak(msg.text)}
                                className={`p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer ${
                                  isSpeaking ? 'text-[#00A878]' : 'text-[#60736E]'
                                }`}
                                title="Listen to Byte speak this answer"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleCopy(msg.text, index)}
                                className="p-1 rounded text-[#60736E] hover:text-[#003F36] hover:bg-gray-100 transition-colors cursor-pointer"
                                title="Copy text"
                              >
                                {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => setFeedbackState(prev => ({ ...prev, [index]: 'up' }))}
                                className={`p-1 rounded transition-colors cursor-pointer ${
                                  feedbackState[index] === 'up' ? 'text-[#00A878] bg-emerald-50' : 'text-[#60736E] hover:bg-gray-100'
                                }`}
                                title="Helpful"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Follow-up Suggested Action Pills */}
                      {isByte && msg.suggestions && msg.suggestions.length > 0 && index === messages.length - 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]"
                        >
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              className="text-[10px] px-2.5 py-1 rounded-full bg-white hover:bg-[#C8F3E4] text-[#006B57] border border-[rgba(0,63,54,0.12)] font-medium shadow-2xs transition-colors cursor-pointer"
                            >
                              ✦ {sug}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Real-time Thinking Bubble */}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#60736E]">
                      <span className="font-bold text-[#006B57] flex items-center gap-1">
                        <span className="text-[#00A878]">✦</span> Byte AI
                      </span>
                      <span>·</span>
                      <span className="text-[#00A878] animate-pulse">Synthesizing vectors...</span>
                    </div>

                    <div className="rounded-2xl rounded-tl-xs p-3 bg-white border border-[rgba(0,63,54,0.1)] flex items-center gap-2 shadow-xs">
                      <div className="w-2 h-2 rounded-full bg-[#00A878] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#00A878] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#00A878] animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-xs text-[#60736E] font-medium ml-1">
                        Byte is computing answer...
                      </span>
                    </div>
                  </motion.div>
                )}

                <div ref={chatBottomRef} />
              </div>
            )}

            {/* Input Bar */}
            {!isMinimized && (
              <div className="p-3 bg-white border-t border-[rgba(0,63,54,0.08)]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative flex items-center gap-1.5"
                >
                  {/* Voice input button */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isListening 
                        ? 'bg-rose-500 text-white animate-pulse shadow-md' 
                        : 'bg-[#F7FBF9] text-[#60736E] hover:text-[#003F36] hover:bg-[#C8F3E4]/50 border border-[rgba(0,63,54,0.1)]'
                    }`}
                    title={isListening ? "Listening... click to stop" : "Speak to Byte (Voice Input)"}
                  >
                    {isListening ? <Mic className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Input field */}
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={
                      isListening 
                        ? "Listening to your voice..." 
                        : `Ask Byte anything about ${activePaper?.title ? `"${activePaper.title.slice(0, 16)}..."` : 'research'}...`
                    }
                    disabled={isThinking}
                    className="flex-1 pl-3.5 pr-10 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F] placeholder:text-[#60736E]/60 transition-all shadow-inner"
                  />

                  {/* Send button */}
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isThinking}
                    className="absolute right-1 w-8 h-8 rounded-lg bg-[#00A878] hover:bg-[#009168] disabled:bg-[#003F36]/20 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-xs transition-all active:scale-90 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-1.5 flex items-center justify-between text-[9px] text-[#60736E]/60 px-1">
                  <span>Byte simplifies complex arXiv & PDF papers</span>
                  <span className="font-mono">Press ↵ to send</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ByteChatbot;
