import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LearnPage from './pages/LearnPage';
import ProblemsPage from './pages/ProblemsPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/auth" replace />}
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/auth"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
          }
        />
        <Route
          path="/chat"
          element={
            isAuthenticated ? <ChatPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/learn"
          element={
            isAuthenticated ? <LearnPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/problems"
          element={
            isAuthenticated ? <ProblemsPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
