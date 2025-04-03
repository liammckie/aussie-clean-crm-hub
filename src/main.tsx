
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from "react-router-dom";
import App from './App.tsx'
import './index.css'

// Initialize Sentry with React Router v6 integration
Sentry.init({
  dsn: "https://be220d948a04a4afeeb7911a4638165d@o4509086518411264.ingest.us.sentry.io/4509086689394688",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/aussie-clean\.com/],
    }),
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample rate for all sessions (10%)
  replaysOnErrorSampleRate: 1.0, // Sample rate for sessions with errors (100%)
  enabled: import.meta.env.PROD, // Only enable in production
  environment: import.meta.env.MODE,
});

// Add dark theme to document
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <App />
  </Sentry.ErrorBoundary>
);
