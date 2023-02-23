import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import CreateJob from './CreateJob';
import store from '../store';

describe('CreateJob', () => {
  it('renders CreateJob component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateJob />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Create a job listing')).toBeInTheDocument();
  });

  it('submits form with valid input', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateJob />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Contact name/), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/Contact email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/title/), {
      target: { value: 'Software Engineer' },
    });
    fireEvent.change(screen.getByLabelText(/description/), {
      target: { value: 'Job description' },
    });
    fireEvent.change(screen.getByLabelText(/Company/), {
      target: { value: 'Acme Inc.' },
    });
    fireEvent.change(screen.getByLabelText(/Location/), {
      target: { value: 'New York' },
    });
    fireEvent.change(screen.getByLabelText(/Job type/), {
      target: { value: 'full-time' },
    });
    fireEvent.change(screen.getByLabelText(/Salary/), {
      target: { value: '100000' },
    });
    fireEvent.click(screen.getByLabelText(/remote/));
    fireEvent.click(screen.getByLabelText(/active/));
    const file = new File(['(⌐□_□)'], 'avatar.jpg', { type: 'image/jpeg' });
    Object.defineProperty(screen.getByLabelText(/listing image/), 'files', {
      value: [file],
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Create a job' }));

    // You should test the following expectations:
    // - Dispatch action with the correct parameters
    // - Show success message after submitting form
    // - Clear form fields after submitting form
  });

  it('shows login message when user is not logged in', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateJob />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText('You are not signed in! Please Sign in or Register!')
    ).toBeInTheDocument();
  });
});
