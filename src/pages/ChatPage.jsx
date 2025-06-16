import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Menu, X, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../components/Sidebar'; // Import the new Sidebar component
import MessageDisplay from '../components/MessageDisplay'; // Import the new MessageDisplay component

const API_URL = 'http://localhost:5000/api/chat';

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

  // Auto-focus textarea when component mounts and after messages update
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [messages, isLoading]);

  useEffect(() => {
    // Create a new chat when component mounts if no chat exists
    if (!currentChatId) {
      createNewChat();
    }
    // Load chat history
    loadChatHistory();
  }, []);

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

  const createNewChat = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('Unable to get user ID');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'New Chat',
          messages: []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create chat');
      }

      const data = await response.json();
      setCurrentChatId(data._id);
      setMessages([]);
      setError(null);
      await loadChatHistory(); // Reload chat history after creating new chat
    } catch (error) {
      console.error('Error creating chat:', error);
      setError(error.message);
    }
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
      if (!currentChatId) {
        await createNewChat();
        if (!currentChatId) {
          throw new Error('Failed to create chat');
        }
      }

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
      
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/${currentChatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      const data = await response.json();
      console.log('Chat response:', data); // Debug log
      
      // Update messages with the complete chat history from the server
      setMessages(data.messages || []);
      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      // Restore message if error occurs
      setNewMessage(messageToSend);
      setSelectedFile(fileToSend);
    } finally {
      setIsLoading(false);
      // Focus textarea after everything is done
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
      handleSendMessage(e);
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
        await createNewChat();
      }
      
      // Reload chat history
      await loadChatHistory();
    } catch (error) {
      console.error('Error deleting chat:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        createNewChat={createNewChat}
        chatHistory={chatHistory}
        handleChatSelect={handleChatSelect}
        handleDeleteChat={handleDeleteChat}
        currentChatId={currentChatId}
      />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content - Fixed Layout Structure */}
      <div className="flex flex-col h-screen">
        {/* Top margin for navbar */}
        <div className="h-16 flex-shrink-0"></div>
        
        {/* Header - Fixed */}
        <div className="flex items-center p-3 sm:p-4 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(true);
            }}
            className="p-1.5 sm:p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Error Message - Fixed */}
        {error && (
          <div className="mx-auto max-w-5xl w-full px-3 sm:px-4 mb-3 sm:mb-4 flex-shrink-0">
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-2.5 sm:p-3 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          </div>
        )}

        {/* Chat Content Area - Flexible */}
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-2 sm:px-4 min-h-0">
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto mb-3 sm:mb-6" onClick={() => setSidebarOpen(false)}>
            <MessageDisplay messages={messages} error={error} />
          </div>

          {/* Input Section - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-white/10 pt-2.5 sm:pt-4">
            {/* File Preview */}
            {selectedFile && (
              <div className="mb-2.5 sm:mb-4 p-2.5 sm:p-4 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Paperclip size={12} className="sm:w-3.5 sm:h-3.5 text-purple-400 flex-shrink-0" />
                    <span className="text-white text-xs sm:text-sm font-medium truncate">{selectedFile.name}</span>
                    <span className="text-gray-400 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/10 rounded-full flex-shrink-0">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded flex-shrink-0 ml-2"
                  >
                    <X size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
                {selectedFile.type.startsWith('image/') && (
                  <div className="mt-2 sm:mt-3">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-w-full sm:max-w-xs max-h-20 sm:max-h-32 object-contain rounded-lg border border-white/20 shadow-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Message Input Bar */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-end gap-2 sm:gap-3 bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/20 p-2.5 sm:p-4 shadow-xl">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                
                {/* File Upload Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="p-1.5 sm:p-2.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 group"
                  title="Attach file"
                >
                  <Paperclip size={16} className="sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
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
                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none min-h-[20px] sm:min-h-[24px] max-h-[100px] sm:max-h-[120px] py-1 sm:py-2 px-0 leading-5 sm:leading-6 text-xs sm:text-base"
                    disabled={isLoading}
                    rows={1}
                    autoFocus
                  />
                  
                  {/* Subtle focus indicator */}
                  <div className="absolute inset-0 pointer-events-none rounded-lg ring-0 ring-purple-500/20 transition-all duration-200 focus-within:ring-2"></div>
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendMessage(e);
                  }}
                  disabled={isLoading || (!newMessage.trim() && !selectedFile)}
                  className="p-1.5 sm:p-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none"
                  title="Send message"
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={16} className="sm:w-5 sm:h-5 hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg sm:rounded-xl blur-xl -z-10 opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}