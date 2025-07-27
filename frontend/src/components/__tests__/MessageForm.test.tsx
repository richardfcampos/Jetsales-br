import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageForm } from '../MessageForm';

// Mock the API hook
jest.mock('../../hooks/useMessageSender', () => ({
  useMessageSender: () => ({
    sendMessage: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

describe('MessageForm', () => {
  const defaultProps = {
    phone: '',
    message: '',
    isLoading: false,
    onPhoneChange: jest.fn(),
    onMessageChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  it('renders form elements', () => {
    render(<MessageForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockOnSubmit = jest.fn();
    render(<MessageForm {...defaultProps} onSubmit={mockOnSubmit} />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    
    // Create a form submit event
    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
}); 