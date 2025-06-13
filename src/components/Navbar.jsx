import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, BookOpen, Code2, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-xl">AI Learn</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/chat"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat</span>
            </Link>
            <Link
              to="/learn"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Learn</span>
            </Link>
            <Link
              to="/problems"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Code2 className="w-5 h-5" />
              <span>Problems</span>
            </Link>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 