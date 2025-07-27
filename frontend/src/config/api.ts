// API configuration for different environments
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  SEND_MESSAGE: `${API_BASE_URL}/api/messages/send-message`,
} as const; 