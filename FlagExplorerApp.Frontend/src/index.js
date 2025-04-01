import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found. Ensure there is a <div id="root"> in your index.html.');
    return;
  }

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});