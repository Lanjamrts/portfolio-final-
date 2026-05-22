import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the loader on initial render', () => {
  render(<App />);
  const loaderText = screen.getByText(/INITIALISATION/i);
  expect(loaderText).toBeInTheDocument();
});
