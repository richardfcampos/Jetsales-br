import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface WhatsAppStatus {
  isConnected: boolean;
  phone?: string;
}

export const useWhatsAppStatus = () => {
  const router = useRouter();
  const [status, setStatus] = useState<WhatsAppStatus>({ isConnected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/api/whatsapp/status`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        if (data.isConnected) {
          router.push('/');
        }
        return data;
      } else {
        setError('Failed to check connection status');
        return null;
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      setError('Network error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial status check
  useEffect(() => {
    checkStatus();
  }, [API_BASE, router]);

  // Poll for connection status when not connected
  useEffect(() => {
    if (!status.isConnected) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE}/api/whatsapp/status`);
          if (response.ok) {
            const data = await response.json();
            setStatus(data);
            if (data.isConnected) {
              router.push('/');
            }
          }
        } catch (error) {
          console.error('Failed to check status:', error);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [status.isConnected, API_BASE, router]);

  return {
    status,
    isLoading,
    error,
    checkStatus,
  };
}; 