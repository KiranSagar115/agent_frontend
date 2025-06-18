import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Award, BookOpen, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    problemsSolved: 0,
    topicsCompleted: 0,
    totalPoints: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        // TODO: Fetch user stats from backend
        setStats({
          problemsSolved: 12,
          topicsCompleted: 5,
          totalPoints: 1250
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
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
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-cyan-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/5 to-teal-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl mb-8 border border-white/10"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gradient-to-br from-white/10 to-white/5 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gradient-to-br from-white/10 to-white/5 rounded-lg w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/5 to-teal-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-violet-400" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">{user?.name}</h1>
                <p className="text-white/60">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 text-white/60 hover:text-red-400 transition-colors duration-300"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Problems Solved</p>
                  <p className="text-2xl font-bold text-white">{stats.problemsSolved}</p>
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Topics Completed</p>
                  <p className="text-2xl font-bold text-white">{stats.topicsCompleted}</p>
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Points</p>
                  <p className="text-2xl font-bold text-white">{stats.totalPoints}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-violet-400" />
              Settings
            </h2>
            <div className="space-y-4">
              <button className="group w-full text-left px-4 py-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 hover:from-violet-600/20 hover:to-purple-600/20 transition-all duration-300 text-white/80 hover:text-white border border-white/10 hover:border-violet-400/30">
                <span className="group-hover:translate-x-1 transition-transform duration-300 block">Edit Profile</span>
              </button>
              <button className="group w-full text-left px-4 py-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 hover:from-violet-600/20 hover:to-purple-600/20 transition-all duration-300 text-white/80 hover:text-white border border-white/10 hover:border-violet-400/30">
                <span className="group-hover:translate-x-1 transition-transform duration-300 block">Notification Settings</span>
              </button>
              <button className="group w-full text-left px-4 py-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 hover:from-violet-600/20 hover:to-purple-600/20 transition-all duration-300 text-white/80 hover:text-white border border-white/10 hover:border-violet-400/30">
                <span className="group-hover:translate-x-1 transition-transform duration-300 block">Privacy Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 