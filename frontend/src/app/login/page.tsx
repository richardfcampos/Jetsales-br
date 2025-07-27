'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCode } from '@/components/QRCode';

interface WhatsAppStatus {
  isConnected: boolean;
  phone?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<WhatsAppStatus>({ isConnected: false });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Check if already connected (initial load)
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/whatsapp/status`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
          if (data.isConnected) {
            router.push('/');
          } else {
            // If not connected, automatically try to get QR code
            getQRCode();
          }
        } else {
          // If status check fails, try to get QR code
          getQRCode();
        }
      } catch (error) {
        console.error('Failed to check status:', error);
        // If error, try to get QR code
        getQRCode();
      }
    };

    checkStatus();
  }, [API_BASE, router]);

  // Get QR code
  const getQRCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Skip initialize call since it's hanging, try to get QR code directly
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

  // Poll for connection status
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WhatsApp Login
          </h1>
          <p className="text-gray-600">
            Scan the QR code with your WhatsApp app to connect
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* QR Code Display */}
          <div className="text-center">
            {qrCode ? (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Scan this QR code with your WhatsApp app:
                  </p>
                  <div className="flex justify-center">
                    <QRCode qrCodeString={qrCode} />
                  </div>
                </div>
                
                <button
                  onClick={getQRCode}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Refresh QR Code
                </button>
              </>
            ) : (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Click the button below to get your QR code
                </p>
                <button
                  onClick={getQRCode}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
                >
                  {isLoading ? 'Getting QR Code...' : 'Get QR Code'}
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              How to connect:
            </h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Click "Get QR Code"</li>
              <li>2. Open WhatsApp on your phone</li>
              <li>3. Go to Settings → Linked Devices</li>
              <li>4. Tap "Link a Device"</li>
              <li>5. Scan the QR code</li>
              <li>6. Wait for connection confirmation</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 