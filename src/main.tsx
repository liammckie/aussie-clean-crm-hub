
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppLogger, LogCategory } from "@/utils/logging";

// Initialize logging
AppLogger.info(LogCategory.UI, "Application starting", {
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || 'development'
});

// Add dark theme to document
document.documentElement.classList.add('dark');

// Render app with error handling
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  AppLogger.info(LogCategory.UI, "Application rendered successfully");
} catch (error) {
  AppLogger.error(
    LogCategory.UI,
    "Failed to render application",
    { error }
  );
  console.error("Failed to render application:", error);
  
  // Display fallback UI
  const rootElement = document.getElementById("root") || document.body;
  rootElement.innerHTML = `
    <div style="height:100vh;display:flex;justify-content:center;align-items:center;background:#0f172a;color:white;font-family:sans-serif;">
      <div style="max-width:500px;text-align:center;padding:2rem;">
        <h1 style="color:#f43f5e;margin-bottom:1rem;">Application Error</h1>
        <p>We're sorry, but the application failed to load.</p>
        <p style="margin-top:1rem;">
          <button onclick="window.location.reload()" style="background:#1e293b;border:none;color:white;padding:0.5rem 1rem;border-radius:0.25rem;cursor:pointer;">
            Refresh Page
          </button>
        </p>
      </div>
    </div>
  `;
}
