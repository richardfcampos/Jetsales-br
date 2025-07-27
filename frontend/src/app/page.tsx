'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageForm, MessageResponse } from '@/components';
import { useMessageSender } from '@/hooks';

interface WhatsAppStatus {
  isConnected: boolean;
  phone?: string;
}

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<WhatsAppStatus>({ isConnected: false });
  const [isLoading, setIsLoading] = useState(true);
  const {
    phone,
    message,
    isLoading: sendingMessage,
    response,
    error,
    setPhone,
    setMessage,
    sendMessage,
  } = useMessageSender();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Check connection status
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

  // Show loading while checking status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WhatsApp Message Sender
          </h1>
          <p className="text-gray-600 mb-4">
            Send messages via WhatsApp using our API
          </p>
          
          {/* Connected Status */}
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <p className="text-sm text-green-800">
              Connected as: <span className="font-medium">{status.phone}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <MessageForm
            phone={phone}
            message={message}
            isLoading={sendingMessage}
            onPhoneChange={setPhone}
            onMessageChange={setMessage}
            onSubmit={sendMessage}
          />

          <MessageResponse response={response} error={error} />
        </div>
      </div>
    </div>
  );
}
