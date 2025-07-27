import { render, screen } from '@testing-library/react';
import { ErrorDisplay } from '../ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders error message when error is provided', () => {
    const errorMessage = 'Test error message';
    render(<ErrorDisplay error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders nothing when error is null', () => {
    const { container } = render(<ErrorDisplay error={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when error is empty string', () => {
    const { container } = render(<ErrorDisplay error="" />);
    
    expect(container.firstChild).toBeNull();
  });
}); 