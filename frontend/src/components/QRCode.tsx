import { useEffect, useState } from 'react';

interface QRCodeProps {
  qrCodeString: string;
  size?: number;
}

export const QRCode: React.FC<QRCodeProps> = ({ qrCodeString, size = 256 }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Use a QR code generation service
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrCodeString)}`;
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (qrCodeString) {
      generateQRCode();
    }
  }, [qrCodeString, size]);

  if (!qrCodeString) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="WhatsApp QR Code"
            width={size}
            height={size}
            className="border border-gray-300"
          />
        ) : (
          <div
            className="bg-gray-200 animate-pulse"
            style={{ width: size, height: size }}
          />
        )}
      </div>
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Scan this QR code with your WhatsApp app to log in
      </p>
    </div>
  );
}; 