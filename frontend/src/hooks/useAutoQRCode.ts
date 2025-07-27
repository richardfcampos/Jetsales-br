import { useEffect } from 'react';
import { useWhatsAppStatus } from './useWhatsAppStatus';
import { useQRCode } from './useQRCode';

export const useAutoQRCode = () => {
  const { status, isLoading: statusLoading, error: statusError } = useWhatsAppStatus();
  const { qrCode, isLoading: qrLoading, error: qrError, getQRCode } = useQRCode();

  // Auto-get QR code when not connected
  useEffect(() => {
    if (!status.isConnected && !statusLoading && !qrCode) {
      getQRCode();
    }
  }, [status.isConnected, statusLoading, qrCode, getQRCode]);

  return {
    status,
    qrCode,
    isLoading: statusLoading || qrLoading,
    error: statusError || qrError,
    getQRCode,
  };
}; 