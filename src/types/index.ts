export interface User {
  id: string;
  phone: string;
  countryCode: string;
  isAuthenticated: boolean;
}

export interface Country {
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
  cca2: string;
}

export interface Chatroom {
  id: string;
  title: string;
  createdAt: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
  chatroomId: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isOtpSent: boolean;
}

export interface ChatState {
  chatrooms: Chatroom[];
  currentChatroom: Chatroom | null;
  messages: Message[];
  isTyping: boolean;
  searchQuery: string;
}

export interface Theme {
  isDark: boolean;
}