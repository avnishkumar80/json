import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to GuidedJSON/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders graph view button', () => {
  render(<App />);
  const graphButton = screen.getByText(/Graph/i);
  expect(graphButton).toBeInTheDocument();
});
