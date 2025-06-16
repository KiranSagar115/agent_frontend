import React from 'react';
import { MessageCircle, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
const extractCodeAndText = (text) => {
  const codeBlocks = [];
  const textParts = [];
  let lastIndex = 0;
  
  // Regex to find markdown code blocks (```language\ncode\n```)
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [fullMatch, lang, code] = match;
    const codeStart = match.index;
    const codeEnd = match.index + fullMatch.length;

    // Add text before the current code block
    if (codeStart > lastIndex) {
      textParts.push(text.substring(lastIndex, codeStart).trim());
    }

    // Add the code block
    codeBlocks.push({
      language: lang || detectLanguage(code),
      code: code.trim()
    });
    
    lastIndex = codeEnd;
  }

  // Add any remaining text after the last code block
  if (lastIndex < text.length) {
    textParts.push(text.substring(lastIndex).trim());
  }
  
  return { codeBlocks, textParts };
};

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
        messages.map((message, index) => {
          const { codeBlocks, textParts } = extractCodeAndText(message.content);

          return (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-white/20">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0 ${
                  message.role === 'user' ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {message.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className="flex-1 min-w-0">
                  {codeBlocks.map((block, codeIndex) => (
                    <div key={codeIndex} className="mt-2 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Code className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">{block.language}</span>
                        </div>
                      </div>
                      <SyntaxHighlighter
                        language={block.language}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          padding: '1rem'
                        }}
                      >
                        {block.code}
                      </SyntaxHighlighter>
                    </div>
                  ))}

                  {textParts.map((text, textIndex) => (
                    text.length > 0 && (
                      <div key={textIndex} className="text-white text-xs sm:text-base break-words whitespace-pre-wrap mt-2">
                        {text}
                      </div>
                    )
                  ))}

                  {message.file && (
                    <div className="mt-2 p-2 bg-gray-800/50 rounded-lg">
                      {/* console.log("Debugging message.file and message.fileMimeType:", message.file, message.fileMimeType) */}
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
          );
        })
      )}
    </div>
  );
}