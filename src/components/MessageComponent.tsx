import React, { useState } from 'react';
import { Copy, Bot, User } from 'lucide-react';
import { Message } from '../types';

interface MessageComponentProps {
  message: Message;
  onCopy: () => void;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message, onCopy }) => {
  const [showCopyButton, setShowCopyButton] = useState(false);
  const isAI = message.sender === 'ai';

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div 
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      <div className={`flex items-start space-x-3 max-w-[70%] ${!isAI && 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAI 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : 'bg-gradient-to-r from-green-500 to-blue-500'
        }`}>
          {isAI ? (
            <Bot className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className="relative group">
          <div className={`px-4 py-3 rounded-2xl ${
            isAI 
              ? 'bg-white/70 backdrop-blur-md border border-white/20 text-gray-800' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          } shadow-sm`}>
            {message.type === 'image' && message.image ? (
              <div className="space-y-2">
                <img 
                  src={message.image} 
                  alt="Uploaded" 
                  className="max-w-full h-auto rounded-lg shadow-md"
                  style={{ maxHeight: '300px' }}
                />
                {message.content !== 'Image uploaded' && (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>

          {/* Copy Button */}
          {showCopyButton && (
            <button
              onClick={onCopy}
              className={`absolute -top-2 ${isAI ? '-right-8' : '-left-8'} p-1.5 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100`}
            >
              <Copy className="w-3 h-3 text-gray-500" />
            </button>
          )}

          {/* Timestamp */}
          <div className={`mt-1 text-xs text-gray-500 ${!isAI && 'text-right'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;