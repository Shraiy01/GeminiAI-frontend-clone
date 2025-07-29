export const OTP_LENGTH = 6;
export const OTP_EXPIRY_TIME = 300; // 5 minutes in seconds
export const MESSAGES_PER_PAGE = 20;
export const AI_RESPONSE_DELAY = 2000; // 2 seconds
export const TYPING_INDICATOR_DELAY = 1000; // 1 second

export const AI_RESPONSES = [
  "That's an interesting question! Let me think about that for a moment.",
  "I understand what you're asking. Here's what I think about that topic.",
  "Great point! From my perspective, this is how I would approach it.",
  "I appreciate you sharing that with me. Let me provide some insights.",
  "That's a fascinating topic to explore. Here are my thoughts on it.",
  "I can help you with that! Let me break it down for you.",
  "Excellent question! I've been trained to assist with topics like this.",
  "I find that topic quite engaging. Here's what I can tell you about it.",
];

export const STORAGE_KEYS = {
  AUTH: 'gemini_auth',
  CHATROOMS: 'gemini_chatrooms',
  MESSAGES: 'gemini_messages',
  THEME: 'gemini_theme',
} as const;