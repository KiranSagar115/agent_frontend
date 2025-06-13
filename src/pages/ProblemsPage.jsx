import React, { useState, useEffect } from 'react';
import { Code2, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const difficultyColors = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-red-400'
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${API_URL}/problems`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProblems(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Coding Problems</h1>
          <p className="text-gray-300">Practice your coding skills with our curated problems</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Problems List */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 animate-pulse"
              >
                <div className="h-6 bg-white/20 rounded w-3/4"></div>
              </div>
            ))
          ) : (
            problems.map((problem) => (
              <div
                key={problem._id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{problem.title}</h3>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {problem.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Code2 className="w-5 h-5 text-purple-400 mr-2" />
                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && !error && problems.length === 0 && (
          <div className="text-center py-12">
            <Code2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Problems Available</h3>
            <p className="text-gray-300">Check back later for new coding challenges</p>
          </div>
        )}
      </div>
    </div>
  );
} 