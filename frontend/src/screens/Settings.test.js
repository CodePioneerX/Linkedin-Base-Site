import { render, screen } from '@testing-library/react';
import Settings from './Settings';
import  {Provider} from 'react-redux';
import store from '../store';


test('Loads webpage', () => {
  render(<Provider store={store}><Settings/></Provider>);

  const title = screen.queryByText('Settings');
  const subtitle = screen.queryByText('Reset Password');
  const oldPasswordLabel = screen.queryByLabelText('Old Password');
  const newPasswordLabel = screen.queryByLabelText('New Password');
  const confirmNewPasswordLabel = screen.queryByLabelText('Confirm New Password');
  const oldPasswordBox = screen.queryByPlaceholderText('Enter current password');
  const newPasswordBox = screen.queryByPlaceholderText('Enter new password');
  const confirmNewPasswordBox = screen.queryByPlaceholderText('Renter your new password');

  expect(title).toBeInTheDocument();
  expect(subtitle).toBeInTheDocument();
  expect(oldPasswordLabel).toBeInTheDocument();
  expect(newPasswordLabel).toBeInTheDocument();
  expect(confirmNewPasswordLabel).toBeInTheDocument();
  expect(oldPasswordBox).toBeInTheDocument();
  expect(newPasswordBox).toBeInTheDocument();
  expect(confirmNewPasswordBox).toBeInTheDocument();
});



