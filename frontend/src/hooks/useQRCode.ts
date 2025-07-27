import { useState } from 'react';

export const useQRCode = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const getQRCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const qrResponse = await fetch(`${API_BASE}/api/whatsapp/qr-code`);
      if (qrResponse.ok) {
        const data = await qrResponse.json();
        if (data.qrCode) {
          setQrCode(data.qrCode);
        } else {
          setError('No QR code available. Please try again.');
        }
      } else {
        setError('Failed to get QR code');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearQRCode = () => {
    setQrCode(null);
    setError(null);
  };

  return {
    qrCode,
    isLoading,
    error,
    getQRCode,
    clearQRCode,
  };
}; 