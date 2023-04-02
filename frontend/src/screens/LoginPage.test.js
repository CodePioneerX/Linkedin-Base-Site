import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';
import store from '../store';

describe('LoginPage', () => {
  it('should render login form and handle submit', () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log in' });

    user.type(emailInput, 'test@test.com');
    user.type(passwordInput, 'testpassword');
    user.click(submitButton);

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(screen.getByText(/new to connect/i)).toBeInTheDocument()
    
  });
});
