import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function MessageDisplay({
  messages,
  error,
}) {
  return (
    <div className="space-y-2 sm:space-y-4 px-2 sm:px-0">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-[200px]">
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
                    {console.log("Debugging message.file and message.fileMimeType:", message.file, message.fileMimeType)}
                    <img
                      src={`data:${message.fileMimeType};base64,${message.file}`}
                      alt="Attached content"
                      className="max-w-full h-auto rounded-md object-contain max-h-48"
                    />
                    {!message.content && (
                      <span className="text-gray-300 text-xs sm:text-sm block mt-2">📎 Attached image</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}