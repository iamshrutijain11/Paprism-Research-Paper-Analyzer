import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Settings as SettingsIcon, Cpu, Database, Sliders, Shield, Save, Check } from 'lucide-react';

export const Settings = () => {
  const [selectedModel, setSelectedModel] = useState('llama-3-70b');
  const [chunkSize, setChunkSize] = useState(500);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [groqApiKey, setGroqApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-[#F7FBF9] text-[#12352F] font-sans antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />

        <div className="p-6 md:p-8 max-w-4xl w-full mx-auto space-y-8">
          
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A878]">
              ✦ Configuration & Preferences
            </span>
            <h1 className="font-display font-bold text-3xl text-[#12352F] tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-[#60736E] mt-1">
              Configure RAG parameters, Groq model inference, and vector embeddings.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* LLM Model Selection */}
            <div className="p-6 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#00A878]" />
                <h3 className="font-display font-bold text-base text-[#12352F]">
                  Groq LLM Inference Model
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedModel('llama-3-70b')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedModel === 'llama-3-70b'
                      ? 'bg-[#C8F3E4]/50 border-[#00A878] ring-2 ring-[#00A878]/20'
                      : 'bg-[#F7FBF9] border-[rgba(0,63,54,0.08)] hover:border-[#00A878]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#12352F]">Llama 3 70B (Groq)</span>
                    <span className="text-[10px] font-bold text-[#006B57]">✦ Recommended</span>
                  </div>
                  <p className="text-[11px] text-[#60736E]">
                    Fast, highly accurate academic reasoning for technical papers.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedModel('mixtral-8x7b')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedModel === 'mixtral-8x7b'
                      ? 'bg-[#C8F3E4]/50 border-[#00A878] ring-2 ring-[#00A878]/20'
                      : 'bg-[#F7FBF9] border-[rgba(0,63,54,0.08)] hover:border-[#00A878]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#12352F]">Mixtral 8x7B (MoE)</span>
                    <span className="text-[10px] text-[#60736E]">High Throughput</span>
                  </div>
                  <p className="text-[11px] text-[#60736E]">
                    Mixture of Experts architecture for multi-lingual and rapid processing.
                  </p>
                </div>
              </div>
            </div>

            {/* RAG Chunking Parameters */}
            <div className="p-6 rounded-3xl bg-white border border-[rgba(0,63,54,0.08)] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00A878]" />
                <h3 className="font-display font-bold text-base text-[#12352F]">
                  Text Chunking & Vector Indexing
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#12352F] mb-1">
                    Chunk Size (Tokens)
                  </label>
                  <input
                    type="number"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] text-xs text-[#12352F] focus:outline-none focus:border-[#00A878]"
                  />
                  <span className="text-[10px] text-[#60736E]">Recommended: 500-1000 characters per passage</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12352F] mb-1">
                    Chunk Overlap (Tokens)
                  </label>
                  <input
                    type="number"
                    value={chunkOverlap}
                    onChange={(e) => setChunkOverlap(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FBF9] border border-[rgba(0,63,54,0.12)] text-xs text-[#12352F] focus:outline-none focus:border-[#00A878]"
                  />
                  <span className="text-[10px] text-[#60736E]">Prevents boundary information loss</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#60736E]">
                Settings are stored securely in your active session.
              </span>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009168] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Preferences Saved!' : 'Save Settings'}</span>
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
};

export default Settings;
