import { render, screen } from '@testing-library/react';
import { InstructionsSection } from '../InstructionsSection';

describe('InstructionsSection', () => {
  it('renders all instruction steps', () => {
    render(<InstructionsSection />);
    
    expect(screen.getByText('How to connect:')).toBeInTheDocument();
    expect(screen.getByText('1. Click "Get QR Code"')).toBeInTheDocument();
    expect(screen.getByText('2. Open WhatsApp on your phone')).toBeInTheDocument();
    expect(screen.getByText('3. Go to Settings → Linked Devices')).toBeInTheDocument();
    expect(screen.getByText('4. Tap "Link a Device"')).toBeInTheDocument();
    expect(screen.getByText('5. Scan the QR code')).toBeInTheDocument();
    expect(screen.getByText('6. Wait for connection confirmation')).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    const { container } = render(<InstructionsSection />);
    
    const section = container.firstChild as HTMLElement;
    expect(section).toHaveClass('mt-6', 'p-4', 'bg-blue-50', 'border', 'border-blue-200', 'rounded-md');
  });
}); 