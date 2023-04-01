import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPassword from './ForgotPassword';
import  {Provider} from 'react-redux';
import store from '../store';

test('ForgotPassword should have the correct headings, labels and placeholders', () => {
    render(<Provider store={store}><ForgotPassword/></Provider>);
  
    const heading = screen.queryByText('Password Reset');
    const subheading = screen.queryByText('To reset your password, please provide your email address below. An email with instructions on how to proceed will be sent to you.');
    const emailLabel = screen.queryByLabelText('Email');
    const emailBox = screen.queryByPlaceholderText('Enter your email');
  
    expect(heading).toBeInTheDocument();
    expect(subheading).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(emailBox).toBeInTheDocument();
  });

  test('renders "Send Email" button', () => {
    render(<Provider store={store}><ForgotPassword/></Provider>);
    const button = screen.getByRole('button', { name: /send email/i });
    expect(button).toBeInTheDocument();
  });