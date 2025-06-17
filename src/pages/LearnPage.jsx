import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Copy, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 font-sans">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Deep Dive into Programming</h1>
          <p className="text-gray-300 text-lg">Explore and learn about programming topics with AI assistance</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/30 border border-red-500/60 rounded-xl text-white text-center shadow-lg">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative max-w-2xl mx-auto shadow-xl rounded-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for topics like 'Python data structures' or 'React hooks'..."
              className="w-full px-5 py-3 pl-14 bg-white/15 backdrop-blur-sm rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              disabled={isLoading} // Disable input while loading
            />
            {isLoading ? (
              <Loader2 className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-300 animate-spin" />
            ) : (
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-300" />
            )}
            <button type="submit" className="sr-only">Search</button>
          </div>
        </form>

        {/* Main Content Area: Conditional Rendering based on state */}
        {isLoading ? (
          // Case 1: Loading (AI is generating) - Full width loader
          <div className="text-center py-20 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/15 h-full flex flex-col items-center justify-center animate-pulse">
            <Loader2 className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-spin" />
            <h3 className="text-3xl font-bold text-white mb-3">Generating Topic...</h3>
            <p className="text-gray-300 text-lg max-w-md">Please wait while our AI prepares your learning material.</p>
          </div>
        ) : !showTopicModal && searchHistory.length === 0 ? (
          // Case 2: Not Loading, No Modal, No History (Show "Ready to Learn?" alongside "No history" message)
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold text-white mb-6">Recent Searches</h2>
              <div className="col-span-full text-center py-6 text-gray-400 text-lg">
                <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                No search history yet. Start learning!
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="text-center py-20 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/15 h-full flex flex-col items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/20 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-3">Ready to Learn?</h3>
                <p className="text-gray-300 text-lg max-w-md">Enter a programming topic in the search bar above to get started with AI-generated content.</p>
              </div>
            </div>
          </div>
        ) : (
          // Case 3: Not Loading, No Modal, Has History (Show history grid across full width) - lg:col-span-full removed as parent handles width
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-white mb-6">Recent Searches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* History items in 4 columns */}
              {searchHistory.map((topic) => {
                const iconSrc = getLanguageIcon(topic.topicTitle, topic.codeSnippets);
                return (
                  <div
                    key={topic._id}
                    onClick={() => handleOpenTopic(topic)}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-5 cursor-pointer hover:bg-white/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg border border-white/15 flex flex-col justify-between items-start text-left"
                    style={{ minHeight: '140px' }}
                  >
                    <div className="flex items-center mb-3">
                      {iconSrc && (
                        <img src={iconSrc} alt="language icon" className="w-6 h-6 mr-3" />
                      )}
                      <h3 className="text-white font-semibold text-xl line-clamp-2">{topic.topicTitle}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-auto opacity-80">
                      Last searched: {new Date(topic.lastSearched).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Topic Modal */}
      {showTopicModal && currentTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-8 shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto relative border border-purple-700/50 transform scale-95 animate-scale-in">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white transition-colors rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-white mb-6 pr-12">{currentTopic.topicTitle}</h2>
            <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
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
      )}
    </div>
  );
} 