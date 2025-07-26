import { useState } from 'react';
import { MessageResponse, ErrorResponse } from '@/types/message';
import { API_ENDPOINTS } from '@/config/api';

interface UseMessageSenderReturn {
  phone: string;
  message: string;
  isLoading: boolean;
  response: MessageResponse | null;
  error: string | null;
  setPhone: (phone: string) => void;
  setMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => Promise<void>;
  clearResponse: () => void;
}

export function useMessageSender(): UseMessageSenderReturn {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<MessageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(API_ENDPOINTS.SEND_MESSAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data as MessageResponse);
      } else {
        setError((data as ErrorResponse).error || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResponse = () => {
    setResponse(null);
    setError(null);
  };

  return {
    phone,
    message,
    isLoading,
    response,
    error,
    setPhone,
    setMessage,
    sendMessage,
    clearResponse,
  };
} 