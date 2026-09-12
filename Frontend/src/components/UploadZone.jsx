import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  Sparkles, 
  FileUp, 
  Link as LinkIcon, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Cpu, 
  Database 
} from 'lucide-react';
import { useUser } from '../context/UserContext';

export const UploadZone = ({ onComplete }) => {
  const { handleUploadPaper, isUploading, uploadProgress, uploadStage } = useUser();
  const [isDragOver, setIsDragOver] = useState(false);
  const [arxivUrl, setArxivUrl] = useState('');
  const [showArxivInput, setShowArxivInput] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const validateAndUpload = async (file) => {
    setUploadError('');
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are allowed (.pdf)');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds the 25 MB limit.');
      return;
    }

    try {
      const res = await handleUploadPaper(file);
      if (res && onComplete) onComplete(res);
    } catch (err) {
      setUploadError(err.userMessage || err.response?.data?.message || 'Failed to upload document. Please try again.');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await validateAndUpload(file);
    }
  };

  const handleSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await validateAndUpload(file);
    }
  };

  const handleArxivSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    if (!arxivUrl.trim()) return;

    try {
      const res = await handleUploadPaper({ name: arxivUrl.trim() });
      setShowArxivInput(false);
      setArxivUrl('');
      if (res && onComplete) onComplete(res);
    } catch (err) {
      setUploadError(err.userMessage || err.response?.data?.message || 'Failed to import arXiv paper.');
    }
  };


  return (
    <div className="relative w-full">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSelect}
        accept=".pdf"
        className="hidden"
      />

      <motion.div
        whileHover={!isUploading ? { y: -3 } : {}}
        transition={{ duration: 0.2 }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-10 sm:p-12 text-center transition-all duration-300 overflow-hidden ${
          isDragOver
            ? 'border-[#00A878] bg-[#C8F3E4]/30 scale-[1.01]'
            : 'border-[#00A878]/30 bg-white/90 hover:border-[#00A878] hover:bg-white'
        } shadow-[0_10px_35px_rgba(0,64,54,0.05)]`}
      >
        {/* Animated Multi-Stage Progress Overlay (PRD Section 8 & 9) */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 rounded-3xl backdrop-blur-md z-30 flex flex-col items-center justify-center p-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00A878] to-[#C8F3E4] flex items-center justify-center text-[#003F36] mb-4 shadow-lg animate-pulse">
                <Sparkles className="w-8 h-8 text-[#003F36]" />
              </div>
              
              <h3 className="font-display font-bold text-xl text-[#12352F] mb-1">
                Processing Research Document
              </h3>
              
              {/* Dynamic Status Display */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#006B57] mb-5 bg-[#C8F3E4] px-3.5 py-1.5 rounded-full border border-[#00A878]/30">
                <span className="w-2 h-2 rounded-full bg-[#00A878] animate-ping" />
                <span>{uploadStage || 'INGESTING & PARSING PDF'}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-72 bg-[#F7FBF9] h-3 rounded-full overflow-hidden border border-[rgba(0,63,54,0.1)] shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-[#00A878] to-[#006B57] h-full rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between w-72 text-[11px] text-[#60736E]">
                <span>PyMuPDF Extraction</span>
                <span className="font-bold text-[#006B57]">{uploadProgress}%</span>
                <span>ChromaDB Vector Store</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default Dropzone Content */}
        <div className="max-w-md mx-auto flex flex-col items-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00A878] to-[#C8F3E4] text-[#003F36] flex items-center justify-center shadow-lg mb-4"
          >
            <UploadCloud className="w-8 h-8" />
          </motion.div>

          <h2 className="font-display font-bold text-2xl text-[#12352F] tracking-tight mb-2">
            Drag & drop your research PDF here
          </h2>
          <p className="text-xs text-[#60736E] max-w-sm mb-6 leading-relaxed">
            Upload preprints, journal articles, or conference papers up to 25 MB. Automatic text cleaning, vector chunking & RAG indexing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#003F36] hover:bg-[#005045] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Browse Local PDF
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowArxivInput(!showArxivInput);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#C8F3E4] hover:bg-[#b2ebd8] text-[#003F36] text-xs font-semibold border border-[#00A878]/30 transition-all flex items-center gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#006B57]" />
              <span>Import via arXiv / DOI</span>
            </button>
          </div>

          {/* Upload Error Banner */}
          {uploadError && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-4 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium max-w-sm text-center"
            >
              {uploadError}
            </div>
          )}

          {/* arXiv / DOI Inline Form */}
          {showArxivInput && (

            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full mt-4 p-3 bg-[#F7FBF9] rounded-2xl border border-[rgba(0,63,54,0.1)] flex items-center gap-2"
            >
              <input
                type="text"
                value={arxivUrl}
                onChange={(e) => setArxivUrl(e.target.value)}
                placeholder="Enter arXiv link or DOI (e.g. 1706.03762)..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[rgba(0,63,54,0.1)] focus:outline-none focus:border-[#00A878]"
              />
              <button
                onClick={handleArxivSubmit}
                className="px-4 py-2 rounded-xl bg-[#00A878] text-white text-xs font-bold"
              >
                Fetch
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#60736E]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" /> Automatic Vector Grounding
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" /> Multi-Level Summaries
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" /> Flashcard & Quiz Auto-Gen
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadZone;
