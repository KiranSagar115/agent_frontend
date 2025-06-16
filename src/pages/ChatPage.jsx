import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Menu, X, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

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

  useEffect(() => {
    // Create a new chat when component mounts if no chat exists
    if (!currentChatId) {
      createNewChat();
    }
    // Load chat history
    loadChatHistory();
  }, []);

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
      setNewMessage(newMessage);
      setSelectedFile(selectedFile);
    } finally {
      setIsLoading(false);
      // Focus the textarea after message is sent and response is received/error occurred
      // Adding a small timeout to ensure the DOM is updated before focusing
      setTimeout(() => {
        if (textareaRef.current) {
          console.log("Attempting to focus textarea:", textareaRef.current);
          textareaRef.current.focus();
        }
      }, 0); // Use a 0ms delay to defer execution until the next tick
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 md:w-80 bg-gray-900/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Chat History</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <div className="p-3 sm:p-4">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            New Chat
          </button>
          
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat._id)}
                className={`p-2.5 sm:p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors group ${currentChatId === chat._id ? 'bg-purple-900/50' : ''}`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <MessageCircle size={14} className="sm:w-4 sm:h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-xs sm:text-sm font-medium truncate">{chat.title}</h3>
                      <button
                        onClick={(e) => handleDeleteChat(chat._id, e)}
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs truncate mt-0.5 sm:mt-1">
                      {chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 sm:mt-1">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col h-screen" onClick={() => setSidebarOpen(false)}>
        {/* Top margin for navbar */}
        <div className="h-16"></div>
        
        {/* Header */}
        <div className="flex items-center p-3 sm:p-4">
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

        {/* Error Message */}
        {error && (
          <div className="mx-auto max-w-5xl w-full px-3 sm:px-4 mb-3 sm:mb-4">
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-2.5 sm:p-3 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 flex flex-col p-2 sm:p-4 max-w-5xl mx-auto w-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-4 mb-3 sm:mb-6 px-2 sm:px-0">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <MessageCircle size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-xs sm:text-base">Start a conversation</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-white/20">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0 ${
                      message.role === 'user' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {message.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs sm:text-base break-words whitespace-pre-wrap">{message.content}</div>
                      {message.file && (
                        <div className="mt-2 p-2 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300 text-xs sm:text-sm">📎 {message.file.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Section */}
          <div className="border-t border-white/10 pt-2.5 sm:pt-4 px-2 sm:px-0">
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