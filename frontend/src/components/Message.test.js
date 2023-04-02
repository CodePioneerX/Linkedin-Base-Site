import React from 'react';
import { render } from '@testing-library/react';
import Message from './Message';

describe('Message', () => {
  it('renders a success message', () => {
    const { getByText } = render(<Message variant="success">Success message</Message>);
    const messageElement = getByText(/Success message/i);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('alert-success');
  });

  it('renders an error message', () => {
    const { getByText } = render(<Message variant="danger">Error message</Message>);
    const messageElement = getByText(/Error message/i);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('alert-danger');
  });

  it('renders a warning message', () => {
    const { getByText } = render(<Message variant="warning">Warning message</Message>);
    const messageElement = getByText(/Warning message/i);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('alert-warning');
  });
});
