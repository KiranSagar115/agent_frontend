import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, MessageCircle, GraduationCap, Zap, 
  Brain, Code, Users, Trophy, Target, 
  BookOpen, Lightbulb, Rocket, Star,
  CheckCircle, ArrowRight, Play
} from 'lucide-react';

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Learners', value: '10K+', icon: Users, color: 'from-blue-500 to-purple-500' },
    { label: 'Problems Solved', value: '50K+', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'AI Conversations', value: '100K+', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { label: 'Success Rate', value: '95%', icon: Trophy, color: 'from-orange-500 to-red-500' }
  ];

  const features = [
    {
      title: "Smart Learning Hub",
      description: "Your personalized dashboard tracks progress, suggests learning paths, and adapts to your coding style. Get insights into your strengths and areas for improvement.",
      icon: <Home className="w-12 h-12" />,
      gradient: "from-blue-500 to-purple-500",
      route: "/dashboard",
      highlights: ["Progress Tracking", "Personalized Recommendations", "Learning Analytics"]
    },
    {
      title: "AI Chat Assistant",
      description: "Interactive AI tutor powered by Gemini and DeepSeek. Upload code screenshots, ask questions, get explanations, and receive instant feedback on your programming journey.",
      icon: <MessageCircle className="w-12 h-12" />,
      gradient: "from-green-500 to-emerald-500",
      route: "/chat",
      highlights: ["Code Image Analysis", "Real-time Help", "Concept Explanations"]
    },
    {
      title: "Interactive Learning",
      description: "Structured courses, tutorials, and hands-on coding exercises. Master programming concepts through guided lessons and practical implementations.",
      icon: <GraduationCap className="w-12 h-12" />,
      gradient: "from-purple-500 to-pink-500",
      route: "/learn",
      highlights: ["Step-by-step Courses", "Interactive Tutorials", "Skill Assessments"]
    },
    {
      title: "Coding Challenges",
      description: "Test your skills with algorithmic puzzles, debug battles, and competitive programming challenges. Level up through progressively difficult problems.",
      icon: <Zap className="w-12 h-12" />,
      gradient: "from-orange-500 to-red-500",
      route: "/problems",
      highlights: ["Algorithm Challenges", "Debug Battles", "Competitive Programming"]
    }
  ];

  const learningPaths = [
    {
      title: "Beginner's Journey",
      description: "Start your coding adventure",
      icon: <Rocket className="w-8 h-8" />,
      color: "from-green-400 to-blue-500",
      topics: ["Variables & Data Types", "Control Structures", "Functions", "Basic Algorithms"]
    },
    {
      title: "Problem Solver",
      description: "Master algorithmic thinking",
      icon: <Target className="w-8 h-8" />,
      color: "from-purple-400 to-pink-500",
      topics: ["Data Structures", "Algorithm Design", "Complexity Analysis", "Optimization"]
    },
    {
      title: "Code Master",
      description: "Advanced programming concepts",
      icon: <Star className="w-8 h-8" />,
      color: "from-orange-400 to-red-500",
      topics: ["Design Patterns", "System Design", "Code Architecture", "Best Practices"]
    }
  ];

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-purple-50/50 to-pink-50/80">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-2xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AIgentLearn Platform
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 text-2xl max-w-4xl mx-auto mb-6 leading-relaxed"
          >
            Master programming through AI-powered learning, interactive challenges, and personalized guidance
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg max-w-3xl mx-auto mb-10"
          >
            From beginner-friendly tutorials to advanced coding challenges, our platform adapts to your learning pace and style
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/chat')}
              className="group flex items-center space-x-2 text-blue-600 hover:text-purple-600 transition-colors duration-300 font-semibold text-lg"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Try AI Chat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.3)"
                }}
                className="group relative bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 text-center overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Complete Learning Ecosystem
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Four integrated modules designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Structured pathways tailored to different skill levels and goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${path.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{path.icon}</div>
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${path.color} bg-clip-text text-transparent`}>
                  {path.title}
                </h3>
                
                <p className="text-gray-600 mb-6">{path.description}</p>
                
                <div className="space-y-2">
                  {path.topics.map((topic, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="text-center bg-white/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/20"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Ready to Transform Your Coding Journey?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Join thousands of developers who are mastering programming through our AI-powered platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative flex items-center justify-center space-x-2">
                  <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Start Learning Now</span>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/learn')}
                className="group flex items-center justify-center space-x-2 text-purple-600 hover:text-blue-600 transition-colors duration-300 font-semibold px-8 py-4 rounded-2xl border-2 border-purple-200 hover:border-blue-300 hover:bg-blue-50/50"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Courses</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, gradient, route, highlights, delay }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 + delay }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 40px rgba(59, 130, 246, 0.2)"
      }}
      onClick={() => navigate(route)}
      className="group relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20 cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-300/50"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-all duration-300`}></div>
      
      <div className="relative z-10">
        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${gradient} mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}>
          <div className="text-white">{icon}</div>
        </div>
        
        <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-6">
          {description}
        </p>

        <div className="space-y-2 mb-6">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-blue-600 group-hover:text-purple-600 transition-colors duration-300 font-semibold">
          <span>Explore Now</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </motion.div>
  );
};

export default HomePage;