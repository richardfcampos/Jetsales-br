import { render, screen, fireEvent } from '@testing-library/react';
import { QRCodeSection } from '../QRCodeSection';

// Mock the QRCode component
jest.mock('../QRCode', () => ({
  QRCode: ({ qrCodeString }: { qrCodeString: string }) => (
    <div data-testid="qr-code">{qrCodeString}</div>
  ),
}));

describe('QRCodeSection', () => {
  const mockOnGetQRCode = jest.fn();

  beforeEach(() => {
    mockOnGetQRCode.mockClear();
  });

  it('renders get QR code button when no QR code is available', () => {
    render(
      <QRCodeSection
        qrCode={null}
        isLoading={false}
        onGetQRCode={mockOnGetQRCode}
      />
    );
    
    expect(screen.getByText('Get QR Code')).toBeInTheDocument();
    expect(screen.getByText('Click the button below to get your QR code')).toBeInTheDocument();
  });

  it('renders QR code and refresh button when QR code is available', () => {
    render(
      <QRCodeSection
        qrCode="test-qr-code"
        isLoading={false}
        onGetQRCode={mockOnGetQRCode}
      />
    );
    
    expect(screen.getByText('Refresh QR Code')).toBeInTheDocument();
    expect(screen.getByText('Scan this QR code with your WhatsApp app:')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
  });

  it('calls onGetQRCode when get QR code button is clicked', () => {
    render(
      <QRCodeSection
        qrCode={null}
        isLoading={false}
        onGetQRCode={mockOnGetQRCode}
      />
    );
    
    fireEvent.click(screen.getByText('Get QR Code'));
    expect(mockOnGetQRCode).toHaveBeenCalledTimes(1);
  });

  it('calls onGetQRCode when refresh button is clicked', () => {
    render(
      <QRCodeSection
        qrCode="test-qr-code"
        isLoading={false}
        onGetQRCode={mockOnGetQRCode}
      />
    );
    
    fireEvent.click(screen.getByText('Refresh QR Code'));
    expect(mockOnGetQRCode).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when getting QR code', () => {
    render(
      <QRCodeSection
        qrCode={null}
        isLoading={true}
        onGetQRCode={mockOnGetQRCode}
      />
    );
    
    expect(screen.getByText('Initializing WhatsApp...')).toBeInTheDocument();
    expect(screen.getByText('Initializing WhatsApp...')).toBeDisabled();
    expect(screen.getByText('This may take a few moments...')).toBeInTheDocument();
  });

  it('disables refresh button when loading', () => {
    render(
      <QRCodeSection
        qrCode="test-qr-code"
        isLoading={true}
        onGetQRCode={mockOnGetQRCode}
      />
    );
    
    const refreshButton = screen.getByText('Refreshing...');
    expect(refreshButton).toBeDisabled();
  });
}); 