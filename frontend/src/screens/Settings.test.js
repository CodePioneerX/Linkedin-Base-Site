import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import Settings from './Settings';



test('Loads webpage', async () => {
  render(<Settings />);

  const title = await screen.queryByText('Settings'); //screen.QuerryBt('Settings');
  expect(title).toBeInTheDocument();
});



