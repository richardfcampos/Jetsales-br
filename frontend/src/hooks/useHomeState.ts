import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WhatsAppStatus {
  isConnected: boolean;
  phone?: string;
}

export const useHomeState = () => {
  const router = useRouter();
  const [status, setStatus] = useState<WhatsAppStatus>({ isConnected: false });
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/whatsapp/status`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
          if (!data.isConnected) {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [API_BASE, router]);

  return {
    status,
    isLoading,
  };
}; 