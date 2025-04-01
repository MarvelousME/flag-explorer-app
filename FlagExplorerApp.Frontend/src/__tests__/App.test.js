import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Flag Explorer app', () => {
  render(<App />);
  const titleElement = screen.getByText(/Flag Explorer/i);
  expect(titleElement).toBeInTheDocument();
});