
# Sentry Error Tracking & Monitoring

## Overview
This document outlines the Sentry integration in the Aussie Clean ERP system. Sentry is used for error tracking, performance monitoring, and session replay to ensure high application reliability and quick issue resolution.

## Integration Components

### Configuration
- **Environment Detection**: Sentry automatically detects the current environment (development, staging, production)
- **Error Tracking**: Captures and reports errors with contextual information
- **Performance Monitoring**: Tracks transaction performance and user experience metrics
- **Session Replay**: Records user sessions to help debug issues (with privacy controls)

### Files Structure
- `src/utils/sentry.ts`: Core Sentry configuration and utilities
- `src/utils/errorReporting.ts`: Business-level error reporting utilities
- `src/components/error/SentryRouteError.tsx`: Route-specific error components
- `src/components/error/ErrorTest.tsx`: Testing components for Sentry functionality

## Best Practices

### Error Context
Always provide meaningful context with errors to aid debugging:

```typescript
try {
  // Operation that might fail
} catch (error) {
  ErrorReporting.captureException(error, {
    operationType: 'data-sync',
    affectedEntity: 'client',
    entityId: clientId,
  });
}
```

### Breadcrumbs
Add breadcrumbs for important user actions to create a trail of events leading up to an error:

```typescript
import * as Sentry from "@sentry/react";

// Before performing an important action
Sentry.addBreadcrumb({
  category: 'user-action',
  message: 'User submitted form',
  level: 'info'
});
```

### Performance Monitoring
Monitor critical user flows with custom transactions:

```typescript
const transaction = ErrorReporting.startTransaction('checkout-flow', 'user-action');

// When completed
transaction.finish();
```

### User Identification
Set user context when a user logs in to associate errors with specific users:

```typescript
ErrorReporting.setUser({
  id: userId,
  email: userEmail,
  role: userRole,
});
```

## Testing Error Reporting

A testing component is available at `src/components/error/ErrorTest.tsx` that provides:
- Test error generation
- Test message sending
- Performance transaction testing

## Production Setup

### Environment Variables
For source map uploads to work correctly in production, ensure these environment variables are set:

```
ORGANIZATION_AUTH_TOKEN_SENTRY=your_token
SENTRY_ORGANIZATION_SLUG=smart-cleaning-solutions
VITE_APP_VERSION=1.0.0 (or auto-populated by CI)
```

### Build Configuration
Source maps are automatically uploaded during production builds via the Sentry Vite plugin configured in `vite.config.ts`.

## Troubleshooting

### Missing Source Maps
If errors appear without proper stack traces:
1. Verify `ORGANIZATION_AUTH_TOKEN_SENTRY` is set
2. Check build logs for source map upload failures
3. Ensure the release version is properly set

### Event Filtering
Not all errors should be reported to Sentry. We use a filtering approach:
- Expected validation errors should be handled gracefully, not reported
- Network timeouts are reported with lower severity
- Critical application errors are reported with high priority

## Sentry Dashboard
The Sentry dashboard for this project can be accessed at:
[https://aussie-clean.sentry.io](https://aussie-clean.sentry.io)

Access requires authentication with the development team credentials.
