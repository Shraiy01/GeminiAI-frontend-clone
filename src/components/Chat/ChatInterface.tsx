import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Chatroom, Message } from '../../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Button } from '../UI/Button';

interface ChatInterfaceProps {
  chatroom: Chatroom;
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (message: string, image?: string) => void;
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatroom,
  messages,
  isTyping,
  onSendMessage,
  onBack
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="mr-3 p-2 md:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {chatroom.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chat with Gemini AI
          </p>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        isTyping={isTyping}
      />

      {/* Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        disabled={isTyping}
      />
    </div>
  );
};