import { render, screen, fireEvent } from '@testing-library/react';
import Settings from './Settings';
import  {Provider} from 'react-redux';
import store from '../store';


test('Settings should have the correct headings, labels and placeholders', () => {
  render(<Provider store={store}><Settings/></Provider>);

  const heading = screen.queryByText('Settings');
  const subheading = screen.queryByText('Reset Password');
  const oldPasswordLabel = screen.queryByLabelText('Old Password');
  const newPasswordLabel = screen.queryByLabelText('New Password');
  const confirmNewPasswordLabel = screen.queryByLabelText('Confirm New Password');
  const oldPasswordBox = screen.queryByPlaceholderText('Enter current password');
  const newPasswordBox = screen.queryByPlaceholderText('Enter new password');
  const confirmNewPasswordBox = screen.queryByPlaceholderText('Renter your new password');

  expect(heading).toBeInTheDocument();
  expect(subheading).toBeInTheDocument();
  expect(oldPasswordLabel).toBeInTheDocument();
  expect(newPasswordLabel).toBeInTheDocument();
  expect(confirmNewPasswordLabel).toBeInTheDocument();
  expect(oldPasswordBox).toBeInTheDocument();
  expect(newPasswordBox).toBeInTheDocument();
  expect(confirmNewPasswordBox).toBeInTheDocument();
});

test('renders "Submit New Password" button', () => {
  render(<Provider store={store}><Settings/></Provider>);
  const button = screen.getByRole('button', { name: /submit new password/i });
  expect(button).toBeInTheDocument();
});


