'use client';

import { MessageForm, MessageResponse } from '@/components';
import { useMessageSender } from '@/hooks';

export default function Home() {
  const {
    phone,
    message,
    isLoading,
    response,
    error,
    setPhone,
    setMessage,
    sendMessage,
  } = useMessageSender();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WhatsApp Message Sender
          </h1>
          <p className="text-gray-600">
            Send messages via WhatsApp using our API
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <MessageForm
            phone={phone}
            message={message}
            isLoading={isLoading}
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
