import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Menu, X, MessageCircle, Plus, Trash2, Code, Edit2, Check } from 'lucide-react';

// Add API_URL constant
const API_URL = 'http://localhost:5000/api/chat';

// Mock JWT decode function
const jwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Inline Sidebar Component
const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  createNewChat, 
  chatHistory, 
  handleChatSelect, 
  handleDeleteChat, 
  currentChatId, 
  handleUpdateChatTitle 
}) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startEditing = (chatId, currentTitle) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveTitle = (chatId) => {
    handleUpdateChatTitle(chatId, editingTitle);
    setEditingChatId(null);
    setEditingTitle('');
  };

  const cancelEditing = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Chat History</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600/20 to-purple-600/20 hover:from-violet-600/30 hover:to-purple-600/30 text-white rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
          >
            <Plus size={18} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          {chatHistory.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat._id}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    chat._id === currentChatId
                      ? 'bg-gradient-to-r from-violet-600/30 to-purple-600/30 border border-violet-400/30'
                      : 'hover:bg-white/10 border border-transparent hover:border-white/20'
                  }`}
                  onClick={() => handleChatSelect(chat._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 bg-transparent border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-violet-400"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveTitle(chat._id);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveTitle(chat._id);
                            }}
                            className="p-1 text-green-400 hover:bg-green-500/20 rounded"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-white truncate">
                            {chat.title || 'New Chat'}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(chat._id, chat.title || 'New Chat');
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-white/50 hover:text-white hover:bg-white/20 rounded transition-all"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-white/60 mt-1">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-white/50 hover:text-red-400 hover:bg-red-500/20 rounded transition-all ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline MessageDisplay Component
const MessageDisplay = ({ messages, error }) => {
  // Code block detection and highlighting
  const renderCodeBlock = (code, language = 'plaintext') => {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-white/10 overflow-hidden my-3">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-700/50 border-b border-white/10">
          <span className="text-xs text-white/70 font-medium uppercase">{language}</span>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            Copy
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-green-300">{code}</code>
        </pre>
      </div>
    );
  };

  const renderMessageContent = (content) => {
    // Simple markdown-like parsing for code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }
      
      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim()
      });
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    // If no code blocks found, return as text
    if (parts.length === 0) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    return (
      <div>
        {parts.map((part, index) => (
          <div key={index}>
            {part.type === 'text' ? (
              <div className="whitespace-pre-wrap">{part.content}</div>
            ) : (
              renderCodeBlock(part.content, part.language)
            )}
          </div>
        ))}
      </div>
    );
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
            <MessageCircle size={32} className="text-violet-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Start a conversation</h3>
          <p className="text-white/60">Send a message to begin chatting with the AI assistant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-4xl ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-violet-400/30'
                : 'bg-gradient-to-r from-slate-700/30 to-slate-800/30 border-slate-600/30'
            } backdrop-blur-sm border rounded-2xl p-4 shadow-lg`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}>
                <span className="text-white text-sm font-medium">
                  {message.role === 'user' ? 'U' : 'AI'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm leading-relaxed">
                  {renderMessageContent(message.content)}
                </div>
                {message.timestamp && (
                  <div className="text-xs text-white/50 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to detect programming language from code
const detectLanguage = (code) => {
  // Simple language detection based on common patterns
  if (code.includes('function') && code.includes('=>')) return 'javascript';
  if (code.includes('def ') && code.includes(':')) return 'python';
  if (code.includes('public class')) return 'java';
  if (code.includes('<?php')) return 'php';
  if (code.includes('package main')) return 'go';
  if (code.includes('fn ')) return 'rust';
  if (code.includes('using System;')) return 'csharp';
  return 'plaintext';
};

// Helper function to extract code from text
const extractCode = (text) => {
  // Look for code blocks in markdown format
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const matches = [...text.matchAll(codeBlockRegex)];
  
  if (matches.length > 0) {
    return matches.map(match => ({
      language: match[1] || detectLanguage(match[2]),
      code: match[2].trim()
    }));
  }
  
  // If no code blocks found, try to detect if the entire text is code
  if (text.includes('{') || text.includes(';') || text.includes('function') || text.includes('def ')) {
    return [{
      language: detectLanguage(text),
      code: text.trim()
    }];
  }
  
  return null;
};

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // New function to start a fresh chat session (frontend state only)
  const startNewChatSession = () => {
    setCurrentChatId(null);
    setMessages([]);
    setNewMessage('');
    setSelectedFile(null);
    setError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset textarea height
    }
    focusTextarea(); // Attempt to focus after resetting
  };

  useEffect(() => {
    // Load chat history on mount
    loadChatHistory();
    // Start a new session on mount if no current chat (or if returning to page)
    // This ensures a clean slate for typing the first message of a new chat
    if (!currentChatId) {
      startNewChatSession();
    }
  }, []);

  // Auto-focus textarea when component mounts and after messages update
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [messages, isLoading]);

  // Focus textarea when chat changes
  useEffect(() => {
    if (textareaRef.current && currentChatId) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [currentChatId]);

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const decoded = jwtDecode(token);
      // Check various possible locations for user ID
      const userId = decoded.userId || decoded._id || decoded.sub || decoded.id;
      
      if (!userId) {
        throw new Error('User ID not found in token');
      }
      
      return userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      setError(error.message);
      return null;
    }
  };

  // Renamed from createNewChat, now only for internal state reset
  const createNewChat = async () => {
    // This function will now simply trigger a new session
    startNewChatSession();
  };

  const focusTextarea = () => {
    if (textareaRef.current) {
      // Use requestAnimationFrame to ensure DOM updates are complete
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
        // Also set cursor to end of text if there's any
        const length = textareaRef.current?.value.length || 0;
        textareaRef.current?.setSelectionRange(length, length);
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const messageToSend = newMessage;
      const fileToSend = selectedFile;
      
      // Add user message to UI immediately
      const userMessage = {
        role: 'user',
        content: messageToSend,
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Clear input immediately
      setNewMessage('');
      setSelectedFile(null);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let chatData;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      let bodyContent;

      if (selectedFile) {
        const formData = new FormData();
        if (messageToSend.trim()) {
          formData.append('message', messageToSend);
        }
        formData.append('file', fileToSend);
        bodyContent = formData;
      } else {
        headers['Content-Type'] = 'application/json';
        bodyContent = JSON.stringify({ message: messageToSend });
      }

      if (!currentChatId) {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: headers,
          body: bodyContent,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create chat with first message');
        }

        chatData = await response.json();
        setCurrentChatId(chatData._id);
        
        // The backend already handles title generation after the first AI response.
        // We just need to load the history to reflect the title set by the backend.
        await loadChatHistory();

      } else {
        const response = await fetch(`${API_URL}/${currentChatId}/message`, {
          method: 'POST',
          headers: headers,
          body: bodyContent,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send message');
        }

        chatData = await response.json();
        // After sending a subsequent message, the title might be updated on the backend
        // (e.g., if the user edits it), so we still need to reload history here.
        await loadChatHistory(); // This ensures sidebar updates with any title changes
      }

      // Update messages with AI response
      if (chatData.messages) {
        setMessages(chatData.messages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      focusTextarea();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Keep focus on textarea after file selection
      focusTextarea();
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            setSelectedFile(file);
            // Keep focus on textarea after paste
            focusTextarea();
          }
        }
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Refocus textarea after removing file
    focusTextarea();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Disable sending if loading
      if (!isLoading) {
        handleSendMessage(e);
      }
    }
  };

  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of 120px
    textarea.style.height = newHeight + 'px';
  };

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load chat history');
      }

      const data = await response.json();
      setChatHistory(data);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError(error.message);
    }
  };

  const handleChatSelect = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load chat');
      }

      const data = await response.json();
      setCurrentChatId(chatId);
      setMessages(data.messages);
      setSidebarOpen(false);
      // Focus textarea after chat selection
      focusTextarea();
    } catch (error) {
      console.error('Error loading chat:', error);
      setError(error.message);
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/${chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      // If the deleted chat was the current one, create a new chat
      if (chatId === currentChatId) {
        startNewChatSession(); // Start a new session, don't create new chat in DB yet
      }
      
      // Reload chat history
      await loadChatHistory();
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError(error.message);
    }
  };

  const handleUpdateChatTitle = async (chatId, newTitle) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update chat title');
      }

      // Reload chat history to reflect the updated title
      await loadChatHistory();
    } catch (error) {
      console.error('Error updating chat title:', error);
      setError(error.message);
    }
  };

  // Handle clicks outside sidebar to maintain focus
  const handleMainContentClick = (e) => {
    setSidebarOpen(false);
    // Only focus if we're not clicking on an interactive element
    if (!e.target.closest('button, input, textarea, a')) {
      focusTextarea();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/5 to-teal-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        createNewChat={startNewChatSession}
        chatHistory={chatHistory}
        handleChatSelect={handleChatSelect}
        handleDeleteChat={handleDeleteChat}
        currentChatId={currentChatId}
        handleUpdateChatTitle={handleUpdateChatTitle}
      />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content - Fixed Layout Structure */}
      <div className="flex flex-col h-screen relative z-10">
        {/* Top margin for navbar */}
        <div className="h-16 flex-shrink-0"></div>
        
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(true);
              }}
              className="group p-3 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/20"
            >
              <Menu size={20} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 font-medium">AI Assistant</span>
            </div>
          </div>
          
          {/* Header actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={startNewChatSession}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600/20 to-purple-600/20 hover:from-violet-600/30 hover:to-purple-600/30 text-white/90 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline text-sm font-medium">New Chat</span>
            </button>
          </div>
        </div>

        {/* Error Message - Fixed */}
        {error && (
          <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 mb-4 flex-shrink-0">
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 p-4 rounded-2xl shadow-lg animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Chat Content Area - Flexible */}
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-0">
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar" onClick={() => setSidebarOpen(false)}>
            <MessageDisplay messages={messages} error={error} />
          </div>

          {/* Input Section - Fixed at bottom */}
          <div className="flex-shrink-0 pb-6">
            {/* File Preview */}
            {selectedFile && (
              <div className="mb-4 p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg">
                      <Paperclip size={14} className="text-cyan-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-medium text-sm block truncate">{selectedFile.name}</span>
                      <span className="text-white/60 text-xs">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-white/60 hover:text-red-400 transition-all duration-200 p-2 hover:bg-red-500/10 rounded-lg hover:scale-110"
                  >
                    <X size={16} />
                  </button>
                </div>
                {selectedFile.type.startsWith('image/') && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-w-full sm:max-w-xs max-h-32 object-contain rounded-xl border border-white/20 shadow-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Message Input Bar */}
            <div className="relative group" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-end gap-3 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-2xl transition-all duration-300 group-focus-within:border-violet-400/50 group-focus-within:shadow-violet-500/20">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                />
                
                {/* File Upload Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="group/btn p-3 text-white/70 hover:text-cyan-300 hover:bg-cyan-500/15 rounded-xl transition-all duration-300 flex-shrink-0 hover:scale-110 border border-transparent hover:border-cyan-400/30"
                  title="Attach file"
                >
                  <Paperclip size={18} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={handleTextareaChange}
                    onPaste={handlePaste}
                    onKeyPress={handleKeyPress}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Type your message..."
                    className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none resize-none min-h-[24px] max-h-[120px] py-2 px-0 leading-6 text-base transition-all duration-300"
                    disabled={isLoading}
                    rows={1}
                    autoFocus
                  />
                  
                  {/* Animated focus indicator */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendMessage(e);
                  }}
                  disabled={isLoading || (!newMessage.trim() && !selectedFile)}
                  className="group/send p-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-600/50 disabled:to-gray-700/50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 flex-shrink-0 shadow-lg hover:shadow-violet-500/30 disabled:shadow-none hover:scale-110 disabled:hover:scale-100"
                  title="Send message"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} className="group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform duration-300" />
                  )}
                </button>
              </div>
              
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl -z-10 opacity-50 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.7);
          }
        `}
      </style>
    </div>
  );
}