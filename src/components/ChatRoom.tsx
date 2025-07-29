import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Image, Copy, MoreVertical } from 'lucide-react';
import { User, ChatRoom as ChatRoomType, Message } from '../types';
import MessageComponent from './MessageComponent';
import TypingIndicator from './TypingIndicator';
import ImageUpload from './ImageUpload';

interface ChatRoomProps {
  chatRoom: ChatRoomType;
  user: User;
  onBack: () => void;
  onAddToast: (toast: { type: 'success' | 'error' | 'warning' | 'info'; message: string }) => void;
}

const MESSAGES_PER_PAGE = 20;

// Throttle function to limit AI responses
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

const ChatRoom: React.FC<ChatRoomProps> = ({ chatRoom, user, onBack, onAddToast }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastAIResponseTime, setLastAIResponseTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate dummy messages for demonstration
  const generateDummyMessages = (page: number): Message[] => {
    const dummyMessages: Message[] = [];
    const startIndex = (page - 1) * MESSAGES_PER_PAGE;
    
    for (let i = 0; i < MESSAGES_PER_PAGE && i + startIndex < 100; i++) {
      const messageIndex = i + startIndex;
      const isAI = messageIndex % 3 === 0;
      
      dummyMessages.push({
        id: `msg-${messageIndex}`,
        content: isAI 
          ? `This is an AI response #${messageIndex + 1}. I'm here to help you with any questions or tasks you might have!`
          : `This is user message #${messageIndex + 1}. Testing the chat functionality.`,
        sender: isAI ? 'ai' : 'user',
        timestamp: new Date(Date.now() - (100 - messageIndex) * 60000),
        type: 'text'
      });
    }
    
    return dummyMessages.reverse();
  };

  useEffect(() => {
    // Load initial messages
    const initialMessages = generateDummyMessages(1);
    setMessages(initialMessages);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadMoreMessages = () => {
    if (isLoading || !hasMoreMessages) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const newMessages = generateDummyMessages(nextPage);
      
      if (newMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        setMessages(prev => [...newMessages, ...prev]);
        setCurrentPage(nextPage);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      
      if (scrollTop === 0 && hasMoreMessages && !isLoading) {
        loadMoreMessages();
      }
    }
  };

  const simulateAIResponse = throttle((userMessage: string) => {
    const now = Date.now();
    const timeSinceLastResponse = now - lastAIResponseTime;
    const minDelay = 2000; // Minimum 2 seconds between AI responses
    
    // Additional delay if responses are too frequent
    const additionalDelay = timeSinceLastResponse < minDelay ? minDelay - timeSinceLastResponse : 0;
    
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Let me think about that...",
        "I understand what you're asking. Here's my perspective on this topic.",
        "Great point! I'd be happy to help you explore this further.",
        "I can definitely assist you with that. Let me provide some insights.",
        "That's a fascinating topic! Here's what I know about it.",
        "I appreciate you sharing that with me. Let me offer some thoughts.",
        "Excellent question! This is something I can help clarify for you."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: randomResponse + " " + `You mentioned: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setLastAIResponseTime(Date.now());
    }, Math.random() * 2000 + 1500 + additionalDelay); // 1.5-3.5 seconds + throttling delay
  }, 1000); // Throttle to max 1 response per second

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    
    // Simulate AI response
    simulateAIResponse(messageToSend);
  };

  const handleImageUpload = (imageData: string) => {
    const imageMessage: Message = {
      id: `img-${Date.now()}`,
      content: 'Image uploaded',
      sender: 'user',
      timestamp: new Date(),
      type: 'image',
      image: imageData
    };
    
    setMessages(prev => [...prev, imageMessage]);
    
    // Simulate AI response to image
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-img-${Date.now()}`,
        content: "I can see the image you've shared! It looks interesting. How can I help you with this image?",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
    
    onAddToast({ type: 'success', message: 'Image uploaded successfully!' });
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      onAddToast({ type: 'success', message: 'Message copied to clipboard!' });
    }).catch(() => {
      onAddToast({ type: 'error', message: 'Failed to copy message' });
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{chatRoom.name}</h1>
              {chatRoom.description && (
                <p className="text-sm text-gray-600">{chatRoom.description}</p>
              )}
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        <div className="max-w-4xl mx-auto">
          {isLoading && hasMoreMessages && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading older messages...</p>
            </div>
          )}
          
          {!hasMoreMessages && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">This is the beginning of your conversation</p>
            </div>
          )}

          {messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              onCopy={() => handleCopyMessage(message.content)}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/70 backdrop-blur-md border-t border-white/20 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Image className="w-5 h-5" />
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      <ImageUpload
        ref={fileInputRef}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default ChatRoom;