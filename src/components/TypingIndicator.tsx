import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3 max-w-[70%]">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>

        {/* Typing Animation */}
        <div className="bg-white/70 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 text-sm">Gemini is typing</span>
            <div className="flex space-x-1 ml-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;