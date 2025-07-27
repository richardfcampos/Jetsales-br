'use client';

import { useEffect } from 'react';
import { useWhatsAppStatus } from '@/hooks/useWhatsAppStatus';
import { useQRCode } from '@/hooks/useQRCode';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { QRCodeSection } from '@/components/QRCodeSection';
import { InstructionsSection } from '@/components/InstructionsSection';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function LoginPage() {
  const { status, isLoading: statusLoading, error: statusError, checkStatus } = useWhatsAppStatus();
  const { qrCode, isLoading: qrLoading, error: qrError, getQRCode } = useQRCode();

  // Auto-get QR code when not connected
  useEffect(() => {
    if (!status.isConnected && !statusLoading && !qrCode) {
      getQRCode();
    }
  }, [status.isConnected, statusLoading, qrCode, getQRCode]);

  // Show loading while checking initial status
  if (statusLoading) {
    return <LoadingSpinner message="Checking connection..." />;
  }

  // Combine errors from both hooks
  const error = statusError || qrError;
  const isLoading = qrLoading;

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
          <ErrorDisplay error={error} />
          
          <QRCodeSection
            qrCode={qrCode}
            isLoading={isLoading}
            onGetQRCode={getQRCode}
          />

          <InstructionsSection />
        </div>
      </div>
    </div>
  );
} 