import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Message } from '../../types';
import { formatTimestamp, copyToClipboard } from '../../utils/helpers';
import { TypingIndicator } from './TypingIndicator';
import { MessageSkeleton } from '../UI/LoadingSkeleton';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  isLoading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopyMessage = async (messageId: string, content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <p className="text-lg mb-2">Start a conversation</p>
            <p className="text-sm">Send a message to begin chatting with Gemini</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`
                flex group
                ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
              `}
            >
              <div
                className={`
                  max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl relative
                  ${message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                  }
                `}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="max-w-full rounded-lg mb-2"
                  />
                )}
                
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}
                
                <p className={`
                  text-xs mt-1 
                  ${message.sender === 'user' 
                    ? 'text-blue-100' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {formatTimestamp(new Date(message.timestamp))}
                </p>

                {/* Copy button */}
                <button
                  onClick={() => handleCopyMessage(message.id, message.content)}
                  className={`
                    absolute -top-8 right-0 opacity-0 group-hover:opacity-100
                    transition-opacity duration-200 p-1 rounded
                    ${message.sender === 'user'
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }
                  `}
                  title="Copy message"
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md">
                <TypingIndicator />
              </div>
            </div>
          )}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};