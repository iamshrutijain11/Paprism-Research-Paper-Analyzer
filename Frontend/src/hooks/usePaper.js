import { useState, useMemo, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { chatService } from '../services/chatService';

export const usePaper = (initialPaperId) => {


  const {
    papers,
    activePaper,
    activePaperId,
    selectPaper,
    highlightedSectionId,
    highlightSection,
    handleUploadPaper,
    handleDeletePaper,
    isUploading,
    uploadProgress,
    uploadStage
  } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState(() => activePaper?.sampleChat || []);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [readingLevel, setReadingLevel] = useState('beginner'); // 'beginner' | 'intermediate' | 'technical'

  // Update chat when active paper changes
  useMemo(() => {
    if (activePaper?.sampleChat) {
      setChatMessages(activePaper.sampleChat);
    }
  }, [activePaper?.id]);

  // Filter papers
  const filteredPapers = useMemo(() => {
    if (!searchQuery.trim()) return papers;
    const q = searchQuery.toLowerCase();
    return papers.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.abstract?.toLowerCase().includes(q)
    );
  }, [papers, searchQuery]);

  // Send RAG Query
  const sendChatMessage = useCallback(async (text) => {
    if (!text.trim() || isAiResponding || !activePaper?.id) return;

    const userMsg = {
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiResponding(true);

    try {
      const aiResponse = await chatService.queryPaperRAG(activePaper.id, text);

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponse.text,
          source: aiResponse.source,
          sourceId: aiResponse.sourceId,
          time: aiResponse.time
        }
      ]);
    } catch (err) {
      console.error('AI query error:', err);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I couldn't find enough information about this in the uploaded paper.",
          source: 'Grounding Verification',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiResponding(false);
    }
  }, [activePaper?.id, isAiResponding]);

  // Jump to and highlight source passage
  const jumpToSource = useCallback((sourceId) => {
    if (!sourceId) return;
    highlightSection(sourceId);
    const element = document.getElementById(sourceId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightSection]);

  return {
    papers,
    filteredPapers,
    activePaper,
    activePaperId,
    selectPaper,
    searchQuery,
    setSearchQuery,
    chatMessages,
    isAiResponding,
    sendChatMessage,
    highlightedSectionId,
    jumpToSource,
    handleUploadPaper,
    handleDeletePaper,
    isUploading,
    uploadProgress,
    uploadStage,
    readingLevel,
    setReadingLevel
  };
};

export default usePaper;
