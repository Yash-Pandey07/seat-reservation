import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Use the imported createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
