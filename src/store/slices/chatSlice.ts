import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Chatroom, Message } from '../../types';
import { generateId, getRandomAIResponse } from '../../utils/helpers';
import { STORAGE_KEYS, AI_RESPONSE_DELAY, TYPING_INDICATOR_DELAY } from '../../utils/constants';

interface ChatState {
  chatrooms: Chatroom[];
  currentChatroom: Chatroom | null;
  messages: Message[];
  isTyping: boolean;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chatrooms: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATROOMS) || '[]'),
  currentChatroom: null,
  messages: JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]'),
  isTyping: false,
  searchQuery: '',
  isLoading: false,
  error: null,
};

// Async thunks
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { content, image, chatroomId }: { content: string; image?: string; chatroomId: string },
    { dispatch, getState }
  ) => {
    const userMessage: Message = {
      id: generateId(),
      content,
      sender: 'user',
      timestamp: new Date(),
      image,
      chatroomId,
    };

    // Add user message immediately
    dispatch(addMessage(userMessage));
    dispatch(setTyping(true));

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, AI_RESPONSE_DELAY + TYPING_INDICATOR_DELAY));

    const aiMessage: Message = {
      id: generateId(),
      content: getRandomAIResponse(),
      sender: 'ai',
      timestamp: new Date(),
      chatroomId,
    };

    return { userMessage, aiMessage };
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createChatroom: (state, action: PayloadAction<string>) => {
      const newChatroom: Chatroom = {
        id: generateId(),
        title: action.payload,
        createdAt: new Date(),
      };
      state.chatrooms.unshift(newChatroom);
      localStorage.setItem(STORAGE_KEYS.CHATROOMS, JSON.stringify(state.chatrooms));
    },
    deleteChatroom: (state, action: PayloadAction<string>) => {
      const chatroomId = action.payload;
      state.chatrooms = state.chatrooms.filter(room => room.id !== chatroomId);
      state.messages = state.messages.filter(msg => msg.chatroomId !== chatroomId);
      
      if (state.currentChatroom?.id === chatroomId) {
        state.currentChatroom = null;
      }
      
      localStorage.setItem(STORAGE_KEYS.CHATROOMS, JSON.stringify(state.chatrooms));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages));
    },
    selectChatroom: (state, action: PayloadAction<Chatroom>) => {
      state.currentChatroom = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      
      // Update chatroom's last message
      const chatroom = state.chatrooms.find(room => room.id === action.payload.chatroomId);
      if (chatroom) {
        chatroom.lastMessage = action.payload.content;
        chatroom.lastMessageTime = action.payload.timestamp;
      }
      
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages));
      localStorage.setItem(STORAGE_KEYS.CHATROOMS, JSON.stringify(state.chatrooms));
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload.aiMessage);
        state.isTyping = false;
        
        // Update chatroom's last message with AI response
        const chatroom = state.chatrooms.find(room => room.id === action.payload.aiMessage.chatroomId);
        if (chatroom) {
          chatroom.lastMessage = action.payload.aiMessage.content;
          chatroom.lastMessageTime = action.payload.aiMessage.timestamp;
        }
        
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages));
        localStorage.setItem(STORAGE_KEYS.CHATROOMS, JSON.stringify(state.chatrooms));
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const {
  createChatroom,
  deleteChatroom,
  selectChatroom,
  addMessage,
  setTyping,
  setSearchQuery,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;