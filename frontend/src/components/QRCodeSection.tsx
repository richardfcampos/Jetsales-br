import { QRCode } from './QRCode';

interface QRCodeSectionProps {
  qrCode: string | null;
  isLoading: boolean;
  onGetQRCode: () => void;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  qrCode,
  isLoading,
  onGetQRCode,
}) => {
  return (
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
            onClick={onGetQRCode}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-800 underline disabled:text-gray-400"
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
            onClick={onGetQRCode}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
          >
            {isLoading ? 'Getting QR Code...' : 'Get QR Code'}
          </button>
        </div>
      )}
    </div>
  );
}; 