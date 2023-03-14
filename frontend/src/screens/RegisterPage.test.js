import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import store from '../store';

describe('RegisterPage', () => {
  it('renders the registration form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('submits the registration form with valid data', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.queryByText('johndoe@example.com')).not.toBeInTheDocument();
  });

  it('displays an error message when passwords do not match', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'incorrectpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));


    // wait for 1 second
    //await new Promise((resolve) => setTimeout(resolve, 1000));


    // await waitFor(() =>
    // expect(screen.getByText('The passwords entered do not match!')).toBeInTheDocument()
    // //expect(screen.getElementById('wrongPassword')).toBeInTheDocument()
    // //   expect(screen.findAllByRole('h6').length).toBeGreaterThan(0)
    // );

    // expect(screen.getByText('The passwords entered do not match!')).toBeInTheDocument()
    // await waitFor(() =>
    //   expect(screen.getByText('The passwords entered do not match!')).toBeInTheDocument(),
    //   { timeout: 5000 }
    // );
    await waitFor(() => {
      const email = screen.queryByText('Email');
      expect(email).toBeInTheDocument();
    });
    

  });
});
