import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Copy, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StyledSearchWrapper = styled.div`
  .galaxy {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-image: radial-gradient(#ffffff 1px, transparent 1px),
      radial-gradient(#ffffff 1px, transparent 1px);
    background-size: 50px 50px;
    background-position:
      0 0,
      25px 25px;
    z-index: -1;
    animation: twinkle 5s infinite;
    pointer-events: none;
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  .stardust,
  .cosmic-ring,
  .starfield,
  .nebula {
    max-height: 70px;
    max-width: 314px;
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: -1;
    border-radius: 12px;
    filter: blur(3px);
  }

  .input {
    background-color: #05071b;
    border: none;
    width: 301px;
    height: 56px;
    border-radius: 10px;
    color: #a9c7ff;
    padding-inline: 59px;
    font-size: 18px;
  }

  #search-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input::placeholder {
    color: #6e8cff;
  }

  .input:focus {
    outline: none;
  }

  #main:focus-within > #input-mask {
    display: none;
  }

  #input-mask {
    pointer-events: none;
    width: 100px;
    height: 20px;
    position: absolute;
    background: linear-gradient(90deg, transparent, #05071b);
    top: 18px;
    left: 70px;
  }

  #cosmic-glow {
    pointer-events: none;
    width: 30px;
    height: 20px;
    position: absolute;
    background: #4d6dff;
    top: 10px;
    left: 5px;
    filter: blur(20px);
    opacity: 0.8;
    transition: all 2s;
  }

  #main:hover > #cosmic-glow {
    opacity: 0;
  }

  .stardust {
    max-height: 63px;
    max-width: 307px;
    border-radius: 10px;
    filter: blur(2px);
  }

  .stardust::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.4);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #4d6dff,
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #6e8cff,
      rgba(0, 0, 0, 0) 58%
    );
    transition: all 2s;
  }

  .cosmic-ring {
    max-height: 59px;
    max-width: 303px;
    border-radius: 11px;
    filter: blur(0.5px);
  }

  .cosmic-ring::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    position: absolute;
    width: 600px;
    height: 600px;
    filter: brightness(1.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #05071b,
      #4d6dff 5%,
      #05071b 14%,
      #05071b 50%,
      #6e8cff 60%,
      #05071b 64%
    );
    transition: all 2s;
  }

  .starfield {
    max-height: 65px;
    max-width: 312px;
  }

  .starfield::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #1c2452,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #2a3875,
      rgba(0, 0, 0, 0) 60%
    );
    transition: all 2s;
  }

  #search-container:hover > .starfield::before {
    transform: translate(-50%, -50%) rotate(-98deg);
  }

  #search-container:hover > .nebula::before {
    transform: translate(-50%, -50%) rotate(-120deg);
  }

  #search-container:hover > .stardust::before {
    transform: translate(-50%, -50%) rotate(-97deg);
  }

  #search-container:hover > .cosmic-ring::before {
    transform: translate(-50%, -50%) rotate(-110deg);
  }

  #search-container:focus-within > .starfield::before {
    transform: translate(-50%, -50%) rotate(442deg);
    transition: all 4s;
  }

  #search-container:focus-within > .nebula::before {
    transform: translate(-50%, -50%) rotate(420deg);
    transition: all 4s;
  }

  #search-container:focus-within > .stardust::before {
    transform: translate(-50%, -50%) rotate(443deg);
    transition: all 4s;
  }

  #search-container:focus-within > .cosmic-ring::before {
    transform: translate(-50%, -50%) rotate(430deg);
    transition: all 4s;
  }

  .nebula {
    overflow: hidden;
    filter: blur(30px);
    opacity: 0.4;
    max-height: 130px;
    max-width: 354px;
  }

  .nebula:before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 999px;
    height: 999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #000,
      #4d6dff 5%,
      #000 38%,
      #000 50%,
      #6e8cff 60%,
      #000 87%
    );
    transition: all 2s;
  }

  #wormhole-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    max-height: 40px;
    max-width: 38px;
    height: 100%;
    width: 100%;
    isolation: isolate;
    overflow: hidden;
    border-radius: 10px;
    background: linear-gradient(180deg, #1c2452, #05071b, #2a3875);
    border: 1px solid transparent;
  }

  .wormhole-border {
    height: 42px;
    width: 40px;
    position: absolute;
    overflow: hidden;
    top: 7px;
    right: 7px;
    border-radius: 10px;
  }

  .wormhole-border::before {
    content: "";
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.35);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #4d6dff,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 50%,
      #6e8cff,
      rgba(0, 0, 0, 0) 100%
    );
    animation: rotate 4s linear infinite;
  }

  #main {
    position: relative;
  }

  #search-icon {
    position: absolute;
    left: 20px;
    top: 15px;
  }

  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }
`;

const StyledLoader = styled.div`
  .spinner {
    width: 3em;
    height: 3em;
    cursor: not-allowed;
    border-radius: 50%;
    border: 2px solid #444;
    box-shadow: -10px -10px 10px #6359f8, 0px -10px 10px 0px #9c32e2, 10px -10px 10px #f36896, 10px 0 10px #ff0b0b, 10px 10px 10px 0px#ff5500, 0 10px 10px 0px #ff9500, -10px 10px 10px 0px #ffb700;
    animation: rot55 0.7s linear infinite;
  }

  .spinnerin {
    border: 2px solid #444;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes rot55 {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RainbowLoader = ({ size = 'default' }) => {
  const sizes = {
    small: { outer: '2em', inner: '1em' },
    default: { outer: '3em', inner: '1.5em' },
    large: { outer: '4em', inner: '2em' }
  };

  return (
    <StyledLoader>
      <div className="spinner" style={{ width: sizes[size].outer, height: sizes[size].outer }}>
        <div className="spinnerin" style={{ width: sizes[size].inner, height: sizes[size].inner }} />
      </div>
    </StyledLoader>
  );
};

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [error, setError] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);

  // Mapping for programming language icons (you might expand this or get from an API)
  const languageIcons = {
    javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    html: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    css: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    php: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    go: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
    ruby: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
    swift: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
    typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    // Add more as needed
  };

  const getLanguageIcon = (topicTitle, codeSnippets) => {
    // Prioritize language from code snippets
    if (codeSnippets && codeSnippets.length > 0) {
      const mainLanguage = codeSnippets[0].language.toLowerCase();
      if (languageIcons[mainLanguage]) {
        return languageIcons[mainLanguage];
      }
    }

    // Fallback to inferring from topic title
    const lowerCaseTitle = topicTitle.toLowerCase();
    for (const lang in languageIcons) {
      if (lowerCaseTitle.includes(lang)) {
        return languageIcons[lang];
      }
    }
    return null; // No icon found
  };

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view your search history');
        return;
      }

      const response = await axios.get(`${API_URL}/learn/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setSearchHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
      setError(error.response?.data?.message || 'Error fetching search history');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to search topics');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/learn/search`,
        { query: searchQuery },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setCurrentTopic(response.data);
        setShowTopicModal(true);
        fetchSearchHistory();
      }
    } catch (error) {
      console.error('Error searching topic:', error);
      setError(error.response?.data?.message || 'Error searching topic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTopic = (topic) => {
    setCurrentTopic(topic);
    setShowTopicModal(true);
  };

  const handleCloseModal = () => {
    setShowTopicModal(false);
    setCurrentTopic(null);
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderCodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="relative rounded-lg overflow-hidden my-4">
        <button
          onClick={() => handleCopyCode(String(children), match[1])}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          {copiedCode === match[1] ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-cyan-900 relative overflow-hidden">
      <div className="galaxy" />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/5 to-teal-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 font-sans">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Deep Dive into Programming</h1>
            <p className="text-white/80 text-lg">Explore and learn about programming topics with AI assistance</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 p-4 rounded-2xl shadow-lg animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <StyledSearchWrapper>
              <div>
                <div className="galaxy" />
                <div id="search-container">
                  <div className="nebula" />
                  <div className="starfield" />
                  <div className="cosmic-dust" />
                  <div className="cosmic-dust" />
                  <div className="cosmic-dust" />
                  <div className="stardust" />
                  <div className="cosmic-ring" />
                  <div id="main">
                    <input
                      className="input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for topics..."
                      disabled={isLoading}
                    />
                    <div id="input-mask" />
                    <div id="cosmic-glow" />
                    <div className="wormhole-border" />
                    <div id="wormhole-icon">
                      <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="#a9c7ff" fill="none" height={24} width={24} viewBox="0 0 24 24">
                        <circle r={10} cy={12} cx={12} />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                    <div id="search-icon">
                      <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="url(#cosmic-search)" fill="none" height={24} width={24} viewBox="0 0 24 24">
                        <circle r={8} cy={11} cx={11} />
                        <line y2="16.65" x2="16.65" y1={21} x1={21} />
                        <defs>
                          <linearGradient gradientTransform="rotate(45)" id="cosmic-search">
                            <stop stopColor="#a9c7ff" offset="0%" />
                            <stop stopColor="#6e8cff" offset="100%" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </StyledSearchWrapper>
            <button type="submit" className="sr-only">Search</button>
          </form>

          {/* Main Content Area */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <RainbowLoader size="large" />
            </div>
          ) : !showTopicModal && searchHistory.length === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-semibold text-white mb-6">Recent Searches</h2>
                <div className="col-span-full text-center py-6 text-white/60 text-lg">
                  <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  No search history yet. Start learning!
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="text-center py-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 h-full flex flex-col items-center justify-center">
                  <BookOpen className="w-20 h-20 text-white/20 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-3">Ready to Learn?</h3>
                  <p className="text-white/60 text-lg max-w-md">Enter a programming topic in the search bar above to get started with AI-generated content.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-white mb-6">Recent Searches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchHistory.map((topic) => {
                  const iconSrc = getLanguageIcon(topic.topicTitle, topic.codeSnippets);
                  return (
                    <div
                      key={topic._id}
                      onClick={() => handleOpenTopic(topic)}
                      className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-lg border border-white/10 hover:border-violet-400/30 hover:shadow-violet-500/20 flex flex-col justify-between items-start text-left"
                      style={{ minHeight: '140px' }}
                    >
                      <div className="flex items-center mb-3">
                        {iconSrc && (
                          <img src={iconSrc} alt="language icon" className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <h3 className="text-white font-semibold text-xl line-clamp-2 group-hover:text-violet-300 transition-colors duration-300">{topic.topicTitle}</h3>
                      </div>
                      <p className="text-white/60 text-sm line-clamp-2">{topic.summary}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topic Modal */}
          {showTopicModal && currentTopic && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      {getLanguageIcon(currentTopic.topicTitle, currentTopic.codeSnippets) && (
                        <img
                          src={getLanguageIcon(currentTopic.topicTitle, currentTopic.codeSnippets)}
                          alt="language icon"
                          className="w-8 h-8 mr-3"
                        />
                      )}
                      <h2 className="text-2xl font-bold text-white">{currentTopic.topicTitle}</h2>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        code: renderCodeBlock
                      }}
                    >
                      {currentTopic.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 