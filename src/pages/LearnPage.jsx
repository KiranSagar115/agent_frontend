import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LearnPage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${API_URL}/learn`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Learning Materials</h1>
          <p className="text-gray-300">Explore our curated learning resources</p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            topics.map((topic) => (
              <div
                key={topic._id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all transform hover:scale-105"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{topic.title}</h3>
                    <p className="text-gray-300 mb-4">{topic.description}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>{topic.duration} min read</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && topics.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Topics Available</h3>
            <p className="text-gray-300">Check back later for new learning materials</p>
          </div>
        )}
      </div>
    </div>
  );
} 