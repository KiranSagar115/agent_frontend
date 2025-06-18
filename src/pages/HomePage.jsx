import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, MessageCircle, GraduationCap, Bug, 
  Brain, Code, Users, Trophy, Target, 
  BookOpen, Lightbulb, Rocket, Star,
  CheckCircle, ArrowRight, Play
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Learners', value: '10K+', icon: Users, color: 'from-violet-400 to-purple-400' },
    { label: 'Topics Mastered', value: '50K+', icon: CheckCircle, color: 'from-pink-400 to-violet-400' },
    { label: 'AI Conversations', value: '100K+', icon: Brain, color: 'from-blue-400 to-purple-400' },
    { label: 'Debug Battles', value: '5K+', icon: Bug, color: 'from-purple-400 to-pink-400' }
  ];

  const features = [
    {
      title: "AI Chat Assistant",
      description: "Interactive AI tutor powered by Gemini for code debugging and analysis. Get instant feedback and explanations for your code.",
      icon: <MessageCircle className="w-12 h-12" />,
      gradient: "from-cyan-400 via-blue-500 to-purple-600",
      route: "/chat",
      highlights: ["Code Analysis", "Real-time Debugging", "AI Explanations"]
    },
    {
      title: "Learning Hub",
      description: "Structured learning paths with AI-powered topic recommendations. Track your progress and master new concepts.",
      icon: <GraduationCap className="w-12 h-12" />,
      gradient: "from-pink-400 via-purple-500 to-indigo-600",
      route: "/learn",
      highlights: ["Topic Recommendations", "Progress Tracking", "Learning Analytics"]
    },
    {
      title: "Debug Battle Arena",
      description: "Challenge yourself with two types of debugging battles: code-based challenges and algorithmic problem-solving.",
      icon: <Bug className="w-12 h-12" />,
      gradient: "from-emerald-400 via-purple-500 to-violet-600",
      route: "/problems",
      highlights: ["Code Debugging", "Algorithm Challenges", "AI Evaluation"]
    }
  ];

  const learningPaths = [
    {
      title: "Code Debugging",
      description: "Master the art of debugging",
      icon: <Bug className="w-8 h-8" />,
      color: "from-red-400 to-purple-500",
      topics: ["Error Analysis", "Code Review", "Debugging Techniques", "Best Practices"]
    },
    {
      title: "Algorithm Mastery",
      description: "Excel in problem-solving",
      icon: <Target className="w-8 h-8" />,
      color: "from-blue-400 to-purple-500",
      topics: ["Data Structures", "Algorithm Design", "Complexity Analysis", "Optimization"]
    },
    {
      title: "Learning Journey",
      description: "Structured learning path",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-green-400 to-purple-500",
      topics: ["Topic Mastery", "Progress Tracking", "AI Recommendations", "Skill Assessment"]
    }
  ];

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-900 to-cyan-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/5 to-teal-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-12 relative z-10"
      >
        {/* Hero Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative inline-block mb-6"
          >
            <motion.div 
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                  "0 0 60px rgba(139, 92, 246, 0.6)",
                  "0 0 20px rgba(139, 92, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 blur-2xl opacity-50 rounded-3xl"
            />
            <motion.h1 
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative text-6xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-purple-400 bg-300% bg-clip-text text-transparent"
              style={{ backgroundSize: "300% 100%" }}
            >
              AIgentLearn Platform
            </motion.h1>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-white/80 text-2xl max-w-4xl mx-auto mb-6 leading-relaxed"
          >
            Master programming through AI-powered learning, interactive debugging, and personalized guidance
          </motion.p>

          <motion.p 
            variants={itemVariants}
            className="text-white/60 text-lg max-w-3xl mx-auto mb-10"
          >
            From code debugging to algorithmic challenges, our platform adapts to your learning pace and style
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chat')}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-violet-500/50 transition-all duration-300"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative flex items-center space-x-2">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <MessageCircle className="w-5 h-5" />
                </motion.div>
                <span>Start Chatting</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/learn')}
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative flex items-center space-x-2">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <GraduationCap className="w-5 h-5" />
                </motion.div>
                <span>Start Learning</span>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-white/60 mb-6">{feature.description}</p>
              <div className="space-y-2">
                {feature.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-white/80">{highlight}</span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(feature.route)}
                className="mt-6 group flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-300"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Learning Paths Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {path.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
              <p className="text-white/60 mb-6">{path.description}</p>
              <div className="space-y-2">
                {path.topics.map((topic, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-white/80">{topic}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;