import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const stats = [
    { label: 'Multi-Language', value: 'Code Support' },
    { label: 'Real-Time', value: 'Code Analysis' },
    { label: 'AI-Powered', value: 'Code Improve' }
  ];

  return (
    <div 
      className={`min-h-screen pt-16 relative overflow-hidden ${
        isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-100'
      }`}
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: isDarkMode ? 'overlay' : 'soft-light',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}
          >
            AI-Powered Code Analysis Platform
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xl max-w-2xl mx-auto mb-8`}
          >
            Upload code or images containing code for instant analysis. 
            Powered by Gemini and DeepSeek AI models.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
          >
            Get Started
          </motion.button>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
              className={`${
                isDarkMode ? 'bg-[#252525] text-white' : 'bg-white text-gray-900'
              } p-6 rounded-lg shadow-lg text-center border-2 border-blue-500/30 backdrop-blur-sm `}
            >
              <div className="text-3xl font-bold text-blue-500">{stat.value}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 ">
          <FeatureCard
            title="Image Analysis and AI chat"
            description="Upload images containing code and learn it with AI assist"
            icon="ianalyse.png"
            onClick={() => navigate('/chat')}
            isDarkMode={isDarkMode}
          />
          <FeatureCard
            title="Code Debug"
            description="Advanced code debugging with Monaco Editor and DeepSeek integration"
            icon="/debug.png"
            onClick={() => navigate('/debug')}
            isDarkMode={isDarkMode}
          />
          <FeatureCard
            title="Debug Battle"
            description="Interface for code debugging and analysis"
            icon="exercise.png"
            onClick={() => navigate('/exercises')}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, onClick, isDarkMode }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
        borderColor: "rgba(59, 130, 246, 0.8)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`${
        isDarkMode ? 'bg-[#252525]/90' : 'bg-white/90'
      } p-6 rounded-lg shadow-lg transition-all duration-300 cursor-pointer border-2 border-blue-500/30 backdrop-blur-sm`}
    >
      <img src={icon} alt={title} className="w-16 h-16 mb-4 mx-auto object-contain" />
      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {description}
      </p>
    </motion.div>
  );
};

export default HomePage; 