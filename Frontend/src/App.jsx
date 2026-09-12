import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import SplashCursor from './components/creative/SplashCursor';
import ByteChatbot from './components/ByteChatbot';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Papers from './pages/Papers';
import PaperWorkspace from './pages/PaperWorkspace';
import Summary from './pages/Summary';
import Chat from './pages/Chat';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Reviews from './pages/Reviews';
import Feedback from './pages/Feedback';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        {/* Global Interactive Fluid Splash Cursor */}
        <SplashCursor colorPalette={['#C8F3E4', '#00A878', '#006B57', '#003F36', '#80edd0']} />

        <BrowserRouter>
          <Routes>
            {/* Public Landing & Information */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Core Protected Dashboard & Repository */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/papers"
              element={
                <ProtectedRoute>
                  <Papers />
                </ProtectedRoute>
              }
            />

            {/* 3-Column Core RAG Research Workspace */}
            <Route
              path="/workspace"
              element={
                <ProtectedRoute>
                  <PaperWorkspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspace/:paperId"
              element={
                <ProtectedRoute>
                  <PaperWorkspace />
                </ProtectedRoute>
              }
            />

            {/* Dedicated Study & AI Workflows */}
            <Route
              path="/summary"
              element={
                <ProtectedRoute>
                  <Summary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <Flashcards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />

            {/* User Profile & System Configuration */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Community, Reviews & Feedback (Public) */}
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/review" element={<Reviews />} />
            <Route path="/feedback" element={<Feedback />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>


          {/* Global Interactive AI Assistant Byte */}
          <ByteChatbot />
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
