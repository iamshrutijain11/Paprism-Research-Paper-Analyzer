import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  BookMarked, 
  CornerDownLeft, 
  ExternalLink, 
  FileSearch, 
  Check, 
  Copy, 
  RefreshCw, 
  Zap 
} from 'lucide-react';
import { usePaper } from '../hooks/usePaper';
import ByteMascot from './ByteChatbot/ByteMascot';

const SUGGESTED_PROMPTS = [
  'Explain Self-Attention simply',
  'What is the formula for Attention(Q,K,V)?',
  'Why does Transformer beat RNNs?',
  'Give me a 3-bullet executive summary'
];

export const AIChatPanel = ({ activePaperId }) => {
  const { 
    activePaper, 
    chatMessages, 
    isAiResponding, 
    sendChatMessage, 
    jumpToSource 
  } = usePaper(activePaperId);

  const [inputQuery, setInputQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiResponding]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputQuery.trim() || isAiResponding) return;
    sendChatMessage(inputQuery);
    setInputQuery('');
  };

  const handlePromptClick = (prompt) => {
    sendChatMessage(prompt);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-md border border-[rgba(0,63,54,0.08)] shadow-[0_8px_30px_rgba(0,64,54,0.06)] rounded-2xl overflow-hidden">
      {/* Panel Header */}
      <div className="p-3.5 bg-gradient-to-r from-[#003F36] to-[#005247] text-white flex items-center justify-between border-b border-[#C8F3E4]/10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ByteMascot 
            size="sm" 
            mood={isAiResponding ? 'thinking' : 'happy'} 
            className="w-8 h-8 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-1">
                <span>Byte</span>
                <span className="text-[#80edd0] text-xs">✦</span>
                <span>Research Assistant</span>
              </h3>
              <span className="px-1.5 py-0.5 rounded bg-[#C8F3E4]/20 text-[#C8F3E4] text-[10px] font-bold tracking-wider">
                RAG Active
              </span>
            </div>
            <p className="text-[11px] text-[#C8F3E4]/70 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] animate-pulse"></span>
              Grounded in {activePaper?.title ? `"${activePaper.title.slice(0, 24)}..."` : 'document'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] bg-[#C8F3E4] text-[#003F36] font-semibold px-2 py-0.5 rounded-md shadow-xs">
            100% Citation Backed
          </span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-[#F7FBF9] border-b border-[rgba(0,63,54,0.06)] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#60736E] whitespace-nowrap flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-[#00A878]" />
          Suggested:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handlePromptClick(prompt)}
            disabled={isAiResponding}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-[#C8F3E4] text-[#006B57] border border-[rgba(0,63,54,0.08)] shadow-xs transition-colors duration-150 font-medium cursor-pointer"
          >
            ✦ {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {chatMessages.map((msg, index) => {
            const isUser = msg.sender === 'user';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Message Header / Author */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[#60736E]">
                  {!isUser ? (
                    <>
                      <span className="font-bold text-[#006B57] flex items-center gap-0.5">
                        <span className="text-[#00A878]">✦</span> Byte AI
                      </span>
                      <span>·</span>
                      <span>{msg.time || '10:42 AM'}</span>
                    </>
                  ) : (
                    <>
                      <span>You</span>
                      <span>·</span>
                      <span>{msg.time || '10:42 AM'}</span>
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-[#003F36] text-white rounded-tr-xs font-normal'
                      : 'bg-[#F7FBF9] text-[#12352F] border border-[rgba(0,63,54,0.08)] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* CRITICAL RAG FEATURE: Highly Visible Emerald Source Badge */}
                  {!isUser && msg.source && (
                    <div className="mt-3 pt-2.5 border-t border-[rgba(0,63,54,0.08)] flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => jumpToSource(msg.sourceId)}
                        className="group/src inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00A878] hover:bg-[#008f66] text-white font-semibold text-[11px] shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
                        title="Click to jump & highlight this source in the document reader"
                      >
                        <FileSearch className="w-3 h-3 text-[#C8F3E4]" />
                        <span>Sources: {msg.source}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/src:opacity-100" />
                      </button>

                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="text-[#60736E] hover:text-[#006B57] p-1 rounded transition-colors"
                        title="Copy answer"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3.5 h-3.5 text-[#00A878]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Real-time AI Thinking state */}
          {isAiResponding && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-[#60736E]">
                <span className="font-bold text-[#006B57] flex items-center gap-0.5">
                  <span className="text-[#00A878]">✦</span> Byte AI
                </span>
                <span>·</span>
                <span className="text-xs text-[#00A878] animate-pulse">Byte is reading vector index...</span>
              </div>
              <div className="rounded-2xl rounded-tl-xs p-3.5 bg-[#F7FBF9] border border-[rgba(0,63,54,0.08)] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00A878] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#00A878] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#00A878] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="text-xs text-[#60736E] font-medium ml-1">Byte is analyzing paper passages...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatBottomRef} />
      </div>

      {/* Input Field: "Ask the paper..." */}
      <div className="p-3 bg-white border-t border-[rgba(0,63,54,0.08)]">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask the paper anything... (e.g. What is Q, K, V?)"
            disabled={isAiResponding}
            className="w-full pl-3.5 pr-12 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] focus:outline-none focus:ring-2 focus:ring-[#00A878]/30 focus:border-[#00A878] text-xs text-[#12352F] placeholder:text-[#60736E]/60 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isAiResponding}
            className="absolute right-1.5 w-8 h-8 rounded-lg bg-[#00A878] hover:bg-[#008f66] disabled:bg-[#003F36]/20 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-sm transition-all duration-150 active:scale-90 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-[#60736E]/70 px-1">
          <span>Answers are synthesized solely from loaded PDF text</span>
          <span className="font-mono text-[9px]">Press ↵ to send</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
