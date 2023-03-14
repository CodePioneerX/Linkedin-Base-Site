import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import App from './App';



test('Loads webpage', async () => {
  render(<App />);

  const divs = await screen.findAllByRole('img');
  expect(divs.length).toBeGreaterThan(0);
});

test('Loads images', async () => {
  render(<App />);
  
  // check that there are images on the page

  const images = await screen.findAllByRole('img');
  expect(images.length).toBeGreaterThan(0);
});

