import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, MessageCircle, GraduationCap, Bug, 
  Brain, Code, Users, Trophy, Target, 
  BookOpen, Lightbulb, Rocket, Star,
  CheckCircle, ArrowRight, Play
} from 'lucide-react';

const HomePage = () => {
  // Mock navigation function for demo
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    alert(`Would navigate to: ${path}`);
  };

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
    <div className="min-h-screen pt-20 relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-violet-400/30 to-purple-400/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-violet-400/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [-20, 20, -20]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        
        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
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
            className="text-purple-100 text-2xl max-w-4xl mx-auto mb-6 leading-relaxed"
          >
            Master programming through AI-powered learning, interactive debugging, and personalized guidance
          </motion.p>

          <motion.p 
            variants={itemVariants}
            className="text-purple-200 text-lg max-w-3xl mx-auto mb-10"
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
                color: "#c084fc"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/debug-battle')}
              className="group flex items-center space-x-2 text-purple-300 hover:text-pink-300 transition-all duration-300 font-semibold text-lg"
            >
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 90 }} 
                transition={{ duration: 0.3 }}
              >
                <Play className="w-5 h-5" />
              </motion.div>
              <span>Try Debug Battle</span>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        {/* <motion.div 
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                }}
                className="group relative bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 text-center overflow-hidden"
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10`}
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360 
                    }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-3 shadow-lg`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div 
                    animate={{ 
                      textShadow: [
                        "0 0 5px rgba(139, 92, 246, 0.5)",
                        "0 0 20px rgba(139, 92, 246, 0.8)",
                        "0 0 5px rgba(139, 92, 246, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-purple-200 text-sm font-medium">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div> */}

        {/* Main Features */}
        <motion.div 
          variants={containerVariants}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.h2 
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-purple-400 bg-300% bg-clip-text text-transparent mb-4"
              style={{ backgroundSize: "300% 100%" }}
            >
              Complete Learning Ecosystem
            </motion.h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Three integrated modules designed to take you from beginner to expert
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Learning Paths */}
        <motion.div
          variants={containerVariants}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.h2 
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-300% bg-clip-text text-transparent mb-4"
              style={{ backgroundSize: "300% 100%" }}
            >
              Choose Your Learning Path
            </motion.h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Structured pathways tailored to different skill levels and goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  y: -10,
                  boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)"
                }}
                className="group bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20 hover:border-purple-400/50 transition-all duration-300"
              >
                <motion.div 
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360 
                  }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${path.color} mb-6 shadow-lg`}
                >
                  <div className="text-white">{path.icon}</div>
                </motion.div>
                
                <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${path.color} bg-clip-text text-transparent`}>
                  {path.title}
                </h3>
                
                <p className="text-purple-200 mb-6">{path.description}</p>
                
                <div className="space-y-2">
                  {path.topics.map((topic, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center space-x-2 text-sm text-purple-100"
                    >
                      <motion.div whileHover={{ scale: 1.2 }}>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </motion.div>
                      <span>{topic}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="text-center bg-white/10 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl"
          />
          
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.h2 
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-300% bg-clip-text text-transparent mb-6"
              style={{ backgroundSize: "300% 100%" }}
            >
              Ready to Transform Your Coding Journey?
            </motion.h2>
            <p className="text-purple-100 text-lg mb-8">
              Join thousands of developers who are mastering programming through our AI-powered platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(139, 92, 246, 0.7)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat')}
                className="group relative overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300"
              >
                <div className="relative flex items-center justify-center space-x-2">
                  <motion.div 
                    whileHover={{ 
                      y: [0, -5, 0],
                      transition: { duration: 0.5, repeat: Infinity }
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.div>
                  <span>Start Chatting</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "#c084fc",
                  backgroundColor: "rgba(192, 132, 252, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/learn')}
                className="group flex items-center justify-center space-x-2 text-purple-300 hover:text-pink-300 transition-all duration-300 font-semibold px-8 py-4 rounded-2xl border-2 border-purple-400/50 hover:border-pink-400/50"
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <GraduationCap className="w-5 h-5" />
                </motion.div>
                <span>Explore Courses</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, gradient, route, highlights, delay }) => {
  // Mock navigation function for demo
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    alert(`Would navigate to: ${path}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 1.4 + delay,
        type: "spring",
        damping: 12,
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.03,
        y: -10,
        boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)"
      }}
      onClick={() => navigate(route)}
      className="group relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20 cursor-pointer overflow-hidden transition-all duration-300 hover:border-purple-400/50"
    >
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0`}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <motion.div 
          whileHover={{ 
            scale: 1.15,
            rotate: 360 
          }}
          transition={{ duration: 0.6 }}
          className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${gradient} mb-6 shadow-lg`}
        >
          <div className="text-white">{icon}</div>
        </motion.div>
        
        <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {title}
        </h3>
        
        <p className="text-purple-100 leading-relaxed mb-6">
          {description}
        </p>

        <div className="space-y-2 mb-6">
          {highlights.map((highlight, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center space-x-2 text-sm text-purple-200"
            >
              <motion.div whileHover={{ scale: 1.2 }}>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </motion.div>
              <span>{highlight}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-purple-300 group-hover:text-pink-300 transition-colors duration-300 font-semibold">
          <span>Explore Now</span>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0`}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default HomePage;