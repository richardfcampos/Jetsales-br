import { render, screen } from '@testing-library/react';
import { ConnectionStatus } from '../ConnectionStatus';

describe('ConnectionStatus', () => {
  const defaultProps = {
    statusClasses: 'bg-green-50 border border-green-200 rounded-md p-3 mb-4',
    statusTextClasses: 'text-sm text-green-800',
    statusPhoneClasses: 'font-medium',
  };

  it('renders connection status when phone is provided', () => {
    render(
      <ConnectionStatus
        phone="1234567890"
        {...defaultProps}
      />
    );
    
    expect(screen.getByText('Connected as:')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('renders nothing when phone is not provided', () => {
    const { container } = render(
      <ConnectionStatus
        phone={undefined}
        {...defaultProps}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when phone is empty string', () => {
    const { container } = render(
      <ConnectionStatus
        phone=""
        {...defaultProps}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('applies custom classes correctly', () => {
    const customProps = {
      statusClasses: 'custom-status-class',
      statusTextClasses: 'custom-text-class',
      statusPhoneClasses: 'custom-phone-class',
    };

    render(
      <ConnectionStatus
        phone="1234567890"
        {...customProps}
      />
    );
    
    const statusDiv = screen.getByText('Connected as:').closest('div');
    expect(statusDiv).toHaveClass('custom-status-class');
    
    const textElement = screen.getByText('Connected as:');
    expect(textElement).toHaveClass('custom-text-class');
    
    const phoneElement = screen.getByText('1234567890');
    expect(phoneElement).toHaveClass('custom-phone-class');
  });
}); 