import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { paperService } from '../services/paperService';
import { INITIAL_PAPERS } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('paprism_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('paprism_token'));
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [papers, setPapers] = useState([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(true);
  const [activePaperId, setActivePaperId] = useState(null);
  const [highlightedSectionId, setHighlightedSectionId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState(''); // 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED'

  // Fetch papers from backend
  const fetchPapers = useCallback(async () => {
    setIsLoadingPapers(true);
    try {
      const data = await paperService.getPapers();
      if (Array.isArray(data) && data.length > 0) {
        setPapers(data);
        setActivePaperId(prev => (prev && data.some(p => p.id === prev) ? prev : data[0].id));
      } else {
        // Fallback to seed demo papers if database is freshly initialized
        setPapers(INITIAL_PAPERS);
        setActivePaperId(prev => prev || INITIAL_PAPERS[0].id);
      }
    } catch (err) {
      console.warn('[UserContext] Could not fetch papers from backend:', err.message);
      setPapers(INITIAL_PAPERS);
      setActivePaperId(prev => prev || INITIAL_PAPERS[0].id);
    } finally {
      setIsLoadingPapers(false);
    }
  }, []);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch (err) {
          console.warn('[UserContext] Token validation failed. Logging out.', err.message);
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
      await fetchPapers();
    };

    initAuth();
  }, [fetchPapers]);

  // Login handler
  const loginUser = async (email, password) => {
    const res = await authService.login(email, password);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      await fetchPapers();
    }
    return res;
  };

  // Register handler
  const registerUser = async (name, email, password, role) => {
    const res = await authService.register(name, email, password, role);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      await fetchPapers();
    }
    return res;
  };

  // Logout handler
  const logoutUser = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Upload handler with real progress and background status polling
  const handleUploadPaper = async (fileOrUrl) => {
    setIsUploading(true);
    setUploadProgress(15);
    setUploadStage('UPLOADING PDF');

    try {
      const newDoc = await paperService.uploadPaper(fileOrUrl, (percent) => {
        setUploadProgress(Math.min(percent, 85));
      });

      // Add to list immediately with initial status
      setPapers((prev) => [newDoc, ...prev.filter((p) => p.id !== newDoc.id)]);
      setActivePaperId(newDoc.id);
      setUploadProgress(90);
      setUploadStage('EXTRACTING & VECTORIZING');

      // Poll in background until READY or FAILED
      if (newDoc.id && newDoc.status !== 'READY') {
        paperService
          .pollPaperStatus(newDoc.id, (updatedPaper) => {
            setPapers((prev) =>
              prev.map((p) => (p.id === updatedPaper.id ? updatedPaper : p))
            );
            if (updatedPaper.status === 'PROCESSING') {
              setUploadStage('GENERATING AI SUMMARIES & QUIZZES');
            }
          })
          .then((completedPaper) => {
            setPapers((prev) =>
              prev.map((p) => (p.id === completedPaper.id ? completedPaper : p))
            );
            setUploadProgress(100);
            setUploadStage('READY');
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
            }, 600);
          })
          .catch((pollErr) => {
            console.warn('[UserContext] Polling error:', pollErr.message);
            setIsUploading(false);
          });
      } else {
        setUploadProgress(100);
        setUploadStage('READY');
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }

      return newDoc;
    } catch (err) {
      console.error('[UserContext] Upload error:', err);
      setIsUploading(false);
      setUploadProgress(0);
      throw err;
    }
  };

  // Delete handler
  const handleDeletePaper = async (paperId) => {
    try {
      await paperService.deletePaper(paperId);
      setPapers((prev) => prev.filter((p) => p.id !== paperId));
      if (activePaperId === paperId) {
        const remaining = papers.filter((p) => p.id !== paperId);
        if (remaining.length > 0) {
          setActivePaperId(remaining[0].id);
        }
      }
    } catch (err) {
      console.error('[UserContext] Delete error:', err);
      throw err;
    }
  };

  const selectPaper = (id) => {
    setActivePaperId(id);
    setHighlightedSectionId(null);
  };

  const highlightSection = (sectionId) => {
    setHighlightedSectionId(sectionId);
    setTimeout(() => {
      setHighlightedSectionId((prev) => (prev === sectionId ? null : prev));
    }, 4500);
  };

  const activePaper = papers.find((p) => p.id === activePaperId) || papers[0] || null;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoadingAuth,
        loginUser,
        registerUser,
        logoutUser,
        papers,
        setPapers,
        isLoadingPapers,
        fetchPapers,
        activePaper,
        activePaperId,
        selectPaper,
        highlightedSectionId,
        highlightSection,
        isUploading,
        uploadProgress,
        uploadStage,
        handleUploadPaper,
        handleDeletePaper,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
