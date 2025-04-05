
# Sentry Error Reporting Configuration

## Overview

This project uses Sentry for error reporting and performance monitoring. This document explains how Sentry is configured across different environments.

## Default Configuration

Sentry is configured to work differently based on the environment:

- **Development**: Limited error reporting with a default DSN for testing
- **Production**: Full error reporting with comprehensive session capture

## Environment Variables

The following environment variables control Sentry behavior:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SENTRY_DSN` | Sentry Data Source Name | Development DSN in dev, required in prod |
| `VITE_ENVIRONMENT` | Environment name | `development` or build mode |
| `VITE_ENABLE_SENTRY` | Override to enable/disable Sentry | `true` in production |

## Source Maps

Source maps are automatically generated and uploaded to Sentry during production builds, providing better error stack traces. This requires:

- A valid Sentry auth token in `SENTRY_AUTH_TOKEN` or `ORGANIZATION_AUTH_TOKEN_SENTRY`
- A valid Sentry DSN

## Disabling Sentry

Sentry can be disabled by:

1. Not providing a Sentry DSN
2. Setting `VITE_ENABLE_SENTRY=false`

## Manual Error Reporting

To report errors manually, use the `ErrorReporting` utility:

```typescript
import { ErrorReporting } from '@/utils/errorReporting';

try {
  // Your code
} catch (error) {
  ErrorReporting.captureException(error, {
    context: 'additional context',
    userId: 'user-123'
  });
}
```

## Performance Monitoring

Performance monitoring is enabled by default in production. You can create custom transactions:

```typescript
import { ErrorReporting } from '@/utils/errorReporting';

const transaction = ErrorReporting.startTransaction('operation-name', 'category');
// Do work
transaction?.finish();
```

## Best Practices

1. Always check if a function exists before calling it in custom error handling
2. Use breadcrumbs to provide context about user actions before an error
3. Set user information when available to help with error analysis
4. Use appropriate error levels (error, warning, info) based on severity
