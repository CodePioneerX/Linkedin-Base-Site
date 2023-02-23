import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LoginPage from './LoginPage';


const mockStore = configureStore([]);

describe('LoginPage', () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      userLogin: { loading: false, error: null, userInfo: null },
    });

    component = render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render the login form', () => {
    const { getByText, getByLabelText } = component;

    expect(getByText('Log in')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });

  it('should display an error message if login fails', async () => {
    const { getByLabelText, getByText } = component;

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'wassim@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('No active account found with the given credentials')).toBeInTheDocument();
    });
  });

  it('should redirect to the registration page if "Register" link is clicked', async () => {
    const { getByText } = component;

    fireEvent.click(fireEvent.getById('submit'));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
