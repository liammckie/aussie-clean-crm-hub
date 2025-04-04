
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSentry, SentryErrorBoundary } from './utils/sentry';

// Initialize Sentry with React Router v6 integration
initializeSentry();

// Add dark theme to document
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SentryErrorBoundary>
      <App />
    </SentryErrorBoundary>
  </React.StrictMode>
);
