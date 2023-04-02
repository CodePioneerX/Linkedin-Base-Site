import React from 'react';
import { render } from '@testing-library/react';
import Messaging from './Messaging';

describe('Messaging Page', () => {
  it('renders a message to sign in or register if user is not logged in', () => {
    localStorage.removeItem('userInfo'); // Ensure user is not logged in
    const { getByText } = render(<Messaging />);
    const messageElement = getByText(/You are not signed in!/i);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent(/You are not signed in!/i);
    expect(messageElement.querySelector('a[href="/login"]')).toBeInTheDocument();
    expect(messageElement.querySelector('a[href="/register"]')).toBeInTheDocument();
  });

  it('renders a heading if user is logged in', () => {
    localStorage.setItem('userInfo', JSON.stringify({ name: 'Test User' })); // Mock logged in user
    const { getByRole } = render(<Messaging />);
    const headingElement = getByRole('heading');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(/Notification/i);
  });
});
