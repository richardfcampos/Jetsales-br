import { useRouter } from 'next/navigation';
import { useAutoQRCode } from './useAutoQRCode';

export const useLoginState = () => {
  const router = useRouter();
  const { status, qrCode, isLoading, error, getQRCode } = useAutoQRCode();

  // Redirect if already connected
  if (status.isConnected) {
    router.push('/');
  }

  return {
    status,
    qrCode,
    isLoading,
    error,
    getQRCode,
    shouldShowLoading: isLoading && !qrCode,
    isRedirecting: status.isConnected,
  };
}; 