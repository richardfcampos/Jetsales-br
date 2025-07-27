import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface WhatsAppStatus {
  isConnected: boolean;
  phone?: string;
}

interface QRCodeResponse {
  qrCode: string;
}

export const useWhatsApp = () => {
  const router = useRouter();
  const [status, setStatus] = useState<WhatsAppStatus>({ isConnected: false });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/whatsapp/status`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        setError('Failed to fetch status');
      }
    } catch (_err) {
      setError('Network error while fetching status');
    }
  }, [API_BASE]);

  const fetchQRCode = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/whatsapp/qr-code`);
      if (response.ok) {
        const data: QRCodeResponse = await response.json();
        setQrCode(data.qrCode);
      } else if (response.status === 404) {
        setQrCode(null);
      } else {
        setError('Failed to fetch QR code');
      }
    } catch (_err) {
      setError('Network error while fetching QR code');
    }
  }, [API_BASE]);

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/whatsapp/initialize`, {
        method: 'POST',
      });
      if (response.ok) {
        await fetchStatus();
        await fetchQRCode();
      } else {
        setError('Failed to initialize WhatsApp');
      }
    } catch (_err) {
      setError('Network error while initializing WhatsApp');
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE, fetchStatus, fetchQRCode]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/whatsapp/logout`, {
        method: 'POST',
      });
      if (response.ok) {
        // Clear all local state
        setStatus({ isConnected: false });
        setQrCode(null);
        setError(null);
        
        // Redirect to login page
        router.push('/login');
      } else {
        setError('Failed to logout');
      }
    } catch (_err) {
      setError('Network error while logging out');
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE, router]);

  // Poll for status updates when not connected
  useEffect(() => {
    if (!status.isConnected) {
      const interval = setInterval(() => {
        fetchStatus();
        fetchQRCode();
      }, 3000); // Poll every 3 seconds to avoid rate limiting

      return () => clearInterval(interval);
    } else {
      // When connected, stop polling for QR code but keep checking status
      const interval = setInterval(() => {
        fetchStatus();
      }, 10000); // Poll every 10 seconds when connected

      return () => clearInterval(interval);
    }
  }, [status.isConnected, fetchStatus, fetchQRCode]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
    fetchQRCode();
  }, [fetchStatus, fetchQRCode]);

  return {
    status,
    qrCode,
    isLoading,
    error,
    initialize,
    logout,
    refreshStatus: fetchStatus,
  };
}; 