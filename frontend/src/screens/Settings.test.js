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

test('calls submitHandler function on form submission', () => {
  const mockSubmitHandler = jest.fn();
  render(<Provider store={store} onSubmit={mockSubmitHandler}><Settings/></Provider>);
  fireEvent.submit(screen.getByRole('button', { name: /submit new password/i }));
  expect(mockSubmitHandler).toHaveBeenCalled();
});

test('dispatches changePassword action with correct arguments', async () => {
  const dispatch = jest.fn();
  useDispatch.mockReturnValue(dispatch);
  useSelector.mockReturnValue({ userInfo: { id: 1 } });
  render(<Provider store={store}><Settings/></Provider>);
  fireEvent.change(screen.getByLabelText('Old Password'), { target: { value: 'oldPassword' } });
  fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword' } });
  fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'newPassword' } });
  fireEvent.submit(screen.getByRole('button', { name: /submit new password/i }));
  await waitFor(() => {
    expect(dispatch).toHaveBeenCalledWith(changePassword(1, 'oldPassword', 'newPassword'));
  });
});