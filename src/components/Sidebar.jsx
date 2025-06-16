import React from 'react';
import { X, Plus, MessageCircle, Trash2 } from 'lucide-react';

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  createNewChat,
  chatHistory,
  handleChatSelect,
  handleDeleteChat,
  currentChatId,
}) {
  return (
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
  );
} 