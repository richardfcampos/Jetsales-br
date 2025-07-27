import type { MessageResponse } from '@/types/message';

interface MessageResponseProps {
  response: MessageResponse | null;
  error: string | null;
}

export function MessageResponse({ response, error }: MessageResponseProps) {
  if (!response && !error) {
    return null;
  }

  return (
    <div className="mt-4">
      {response && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-sm font-medium text-green-800">Message Sent Successfully!</h3>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
} 