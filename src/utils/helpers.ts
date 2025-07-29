import { format, isToday, isYesterday } from 'date-fns';

export const formatTimestamp = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MMM dd, HH:mm');
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const simulateOTP = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('123456'); // Simulated OTP
    }, 2000);
  });
};

export const getRandomAIResponse = (): string => {
  const responses = [
    "That's an interesting question! Let me think about that for a moment.",
    "I understand what you're asking. Here's what I think about that topic.",
    "Great point! From my perspective, this is how I would approach it.",
    "I appreciate you sharing that with me. Let me provide some insights.",
    "That's a fascinating topic to explore. Here are my thoughts on it.",
    "I can help you with that! Let me break it down for you.",
    "Excellent question! I've been trained to assist with topics like this.",
    "I find that topic quite engaging. Here's what I can tell you about it.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

export const compressImage = (file: File, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.src = URL.createObjectURL(file);
  });
};