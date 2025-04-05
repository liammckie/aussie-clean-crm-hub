
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize Sentry is now in src/utils/sentry.tsx

// Add dark theme to document
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
