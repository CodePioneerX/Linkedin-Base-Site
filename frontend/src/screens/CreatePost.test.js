import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../store';
import CreatePost from '../screens/CreatePost';

describe('CreatePost Screen', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CreatePost />
        </BrowserRouter>
      </Provider>
    );
  });

  test('renders the contact name input field', () => {
    const contactNameField = screen.getByLabelText('Contact name');
    expect(contactNameField).toBeInTheDocument();
  });

  test('renders the contact email input field', () => {
    const contactEmailField = screen.getByLabelText('Contact email');
    expect(contactEmailField).toBeInTheDocument();
  });

  test('renders the title input field', () => {
    const titleField = screen.getByLabelText('title');
    expect(titleField).toBeInTheDocument();
  });

  test('renders the content input field', () => {
    const contentField = screen.getByLabelText('content');
    expect(contentField).toBeInTheDocument();
  });

  test('renders the listing image input field', () => {
    const imageField = screen.getByLabelText('listing image');
    expect(imageField).toBeInTheDocument();
  });

  test('displays an error message if user is not logged in', () => {
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/You are not signed in/);
  });

  test('submits the form when Create a Post button is clicked', () => {
    const submitButton = screen.getByRole('button', { name: /Create a Post/i });
    fireEvent.click(submitButton);

    // check that the form was submitted
    expect(store.getState().userPost.postCreated).toEqual(true);
  });
});
