import React from 'react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { QRCode } from './QRCode';

export const WhatsAppManager: React.FC = () => {
  const {
    status,
    qrCode,
    isLoading,
    error,
    initialize,
    logout,
    refreshStatus,
  } = useWhatsApp();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        WhatsApp Connection
      </h2>

      {/* Status Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                status.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                status.isConnected ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {status.isConnected && status.phone && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800">
              Connected as: <span className="font-medium">{status.phone}</span>
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* QR Code Display - Show automatically when disconnected */}
      {!status.isConnected && (
        <div className="mb-6">
          {qrCode ? (
            <>
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600 mb-2">Scan this QR code with your WhatsApp app:</p>
              </div>
              <QRCode qrCodeString={qrCode} />
              <div className="text-center mt-3">
                <button
                  onClick={refreshStatus}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Refresh QR Code
                </button>
              </div>
            </>
          ) : (
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600 mb-2">Click "Login to WhatsApp" to get QR code</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons - Only 2 buttons */}
      <div className="space-y-3">
        {!status.isConnected ? (
          <button
            onClick={initialize}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Getting QR Code...
              </>
            ) : (
              'Login to WhatsApp'
            )}
          </button>
        ) : (
          <button
            onClick={logout}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging out...
              </>
            ) : (
              'Logout from WhatsApp'
            )}
          </button>
        )}
      </div>

      {/* Instructions */}
      {!status.isConnected && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            How to connect:
          </h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Click &quot;Login to WhatsApp&quot;</li>
            <li>2. Scan the QR code with your WhatsApp app</li>
            <li>3. Wait for the connection to be established</li>
          </ol>
        </div>
      )}
    </div>
  );
}; 