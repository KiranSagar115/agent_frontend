import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, GraduationCap, Zap, UserCircle, Power, Sparkles } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location to determine active link
  const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
      <nav className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 animate-pulse"></div>
        
        {/* Glowing border animation */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-sm animate-pulse"></div>
        
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link to={user ? "/dashboard" : "/auth"} className="group flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300">
                AIgentLearn
              </span>
            </Link>

            {/* Navigation Links - Only show when logged in */}
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 
                    ${location.pathname === '/dashboard' ? 'text-blue-600 bg-blue-50/50 shadow-md' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'}
                  `}
                >
                  {location.pathname === '/dashboard' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl animate-pulse"></div>
                  )}
                  <Home className={`w-5 h-5 relative z-10 transition-transform duration-300 ${location.pathname === '/dashboard' ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10 font-medium">Home</span>
                  {location.pathname === '/dashboard' && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  )}
                </Link>
                
                <Link
                  to="/chat"
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 
                    ${location.pathname === '/chat' ? 'text-green-600 bg-green-50/50 shadow-md' : 'text-gray-700 hover:text-green-600 hover:bg-green-50/50'}
                  `}
                >
                  {location.pathname === '/chat' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl animate-pulse"></div>
                  )}
                  <MessageCircle className={`w-5 h-5 relative z-10 transition-transform duration-300 ${location.pathname === '/chat' ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10 font-medium">Chat</span>
                  {location.pathname === '/chat' && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                  )}
                </Link>
                
                <Link
                  to="/learn"
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 
                    ${location.pathname === '/learn' ? 'text-purple-600 bg-purple-50/50 shadow-md' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50/50'}
                  `}
                >
                  {location.pathname === '/learn' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl animate-pulse"></div>
                  )}
                  <GraduationCap className={`w-5 h-5 relative z-10 transition-transform duration-300 ${location.pathname === '/learn' ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10 font-medium">Learn</span>
                  {location.pathname === '/learn' && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  )}
                </Link>
                
                <Link
                  to="/problems"
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 
                    ${location.pathname === '/problems' ? 'text-orange-600 bg-orange-50/50 shadow-md' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/50'}
                  `}
                >
                  {location.pathname === '/problems' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl animate-pulse"></div>
                  )}
                  <Zap className={`w-5 h-5 relative z-10 transition-transform duration-300 ${location.pathname === '/problems' ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10 font-medium">DebugBattle</span>
                  {location.pathname === '/problems' && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                  )}
                </Link>
              </div>
            )}

            {/* Profile Section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="group relative flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 hover:text-indigo-600 transition-all duration-300 hover:bg-indigo-50/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {user.profilePicture ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="relative w-8 h-8 rounded-full ring-2 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <UserCircle className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </Link>
                  
                  {/* Enhanced Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-red-400 hover:to-pink-400"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 animate-pulse"></div>
                    <div className="relative flex items-center space-x-2">
                      <Power className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                      <span className="font-medium hidden md:inline">Logout</span>
                    </div>
                    
                    {/* Glowing effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-pink-400 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                  </button>
                </>
              ) : (
                <Link
                  to="/"
                  className="group relative flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-400 hover:to-purple-400"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 animate-pulse rounded-xl"></div>
                  <UserCircle className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 font-medium">Sign In</span>
                  
                  {/* Glowing effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      </nav>
    </div>
  );
}