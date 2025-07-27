interface MessageFormProps {
  phone: string;
  message: string;
  isLoading: boolean;
  onPhoneChange: (phone: string) => void;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function MessageForm({
  phone,
  message,
  isLoading,
  onPhoneChange,
  onMessageChange,
  onSubmit,
}: MessageFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="+5579999999999"
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Enter your message here..."
          rows={4}
          className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
} 