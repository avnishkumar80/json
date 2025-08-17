import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Simple smoke test
test('renders format button', () => {
  render(<App />);
  const formatButton = screen.getByRole('button', { name: /format/i });
  expect(formatButton).toBeInTheDocument();
});

test('renders textarea for JSON input', () => {
  render(<App />);
  const textareaElement = screen.getByPlaceholderText(/Paste your JSON here/i);
  expect(textareaElement).toBeInTheDocument();
});
