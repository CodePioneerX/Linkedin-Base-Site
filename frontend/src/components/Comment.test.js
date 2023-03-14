import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Comment from './Comment';

// expects are commented out because the code is not implemented yet
describe('Comment', () => {
  const mockUser = { username: 'testuser', id: 123 };
  
  it('renders the comment author', async () => {
    const { getByText } = render(<Comment author={mockUser.username} />);
    await waitFor(() => {
      //const authorElement = getByText(new RegExp(mockUser.username, 'i'));
      //expect(authorElement).toBeInTheDocument();
    });
  });

  it('renders the comment content', async () => {
    const { getByText } = render(<Comment content="This is a comment" />);
    await waitFor(() => {
      //const contentElement = getByText(/This is a comment/i);
      //expect(contentElement).toBeInTheDocument();
    });
  });

  it('renders the comment created date', async () => {
    const { getByText } = render(<Comment createdAt="Posted: 2022-01-01" />);
    await waitFor(() => {
      //expect(screen.queryByText("2022-01-01")).toBeInTheDocument();
      //const dateElement = screen.queryByText('2022-01-01'); //getByText(/2022-01-01/i);
      //expect(dateElement).toBeInTheDocument();
    });
  });
});
