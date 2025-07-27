export const InstructionsSection: React.FC = () => {
  return (
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
  );
}; 