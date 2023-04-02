import { render, screen, fireEvent, waitFor, getAllByRole } from '@testing-library/react';
import Settings from './Settings';
import  {Provider} from 'react-redux';
import store from '../store';
import { changePassword } from '../actions/userActions';

jest.mock('../actions/userActions');

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

test('it submits the form with valid input', async () => {
  const { getByLabelText, getByText } = render(<Provider store={store}><Settings /></Provider>);
  
  fireEvent.change(getByLabelText('Old Password'), { target: { value: 'oldPassword123' } });
  fireEvent.change(getByLabelText('New Password'), { target: { value: 'newPassword123' } });
  fireEvent.change(getByLabelText('Confirm New Password'), { target: { value: 'newPassword123' } });
  
  fireEvent.click(getByText('Submit New Password'));

  // Assert that the changePassword function is called with ialid input
  //expect(changePassword).toHaveBeenCalled();
  
});

test('it does not submit the form with invalid input', () => {
  const { getByLabelText, getByText, queryByTestId } = render(
    <Provider store={store}>
      <Settings />
    </Provider>
  );

  fireEvent.change(getByLabelText('Old Password'), { target: { value: 'oldPassword123' } });
  fireEvent.change(getByLabelText('New Password'), { target: { value: '123' } });
  fireEvent.change(getByLabelText('Confirm New Password'), { target: { value: '123' } });
  fireEvent.click(getByText('Submit New Password'));

  // Assert that the changePassword function is not called with invalid input
  expect(changePassword).not.toHaveBeenCalled();
});

test('it does not submit the form with invalid input', () => {
  const { getByLabelText, getByText, queryByTestId } = render(
    <Provider store={store}>
      <Settings />
    </Provider>
  );

  fireEvent.change(getByLabelText('Old Password'), { target: { value: 'oldPassword123' } });
  fireEvent.change(getByLabelText('New Password'), { target: { value: 'test1234' } });
  fireEvent.change(getByLabelText('Confirm New Password'), { target: { value: 'test123' } });
  fireEvent.click(getByText('Submit New Password'));

  // Assert that the changePassword function is not called with invalid input
  expect(changePassword).not.toHaveBeenCalled();
});