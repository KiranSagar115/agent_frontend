import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LearnPage from './pages/LearnPage';
import ProblemsPage from './pages/ProblemsPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);
  const isAuthPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <LearnPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <ProblemsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
