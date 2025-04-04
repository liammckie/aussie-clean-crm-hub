
# Error Reporting Configuration

## Sentry Integration

This project uses Sentry for error tracking and performance monitoring. The integration is configured with the following details:

- **Organization:** smart-cleaning-solutions
- **Project:** aussie-clean-erp
- **DSN:** `https://be220d948a04a4afeeb7911a4638165d@o4509086518411264.ingest.us.sentry.io/4509086689394688`

## Key Integration Files

- **`src/utils/sentry.ts`**: Core Sentry configuration and HOCs
- **`src/utils/errorReporting.ts`**: Error reporting utilities
- **`src/components/error/SentryRouteError.tsx`**: Route error boundaries
- **`src/components/error/ErrorTest.tsx`**: Error testing utilities

## Environment Variables

For source map uploads to work correctly, the following environment variables can be used:

### Organization-based Variables (Preferred)
- `ORGANIZATION_AUTH_TOKEN_SENTRY`: Organization authentication token for Sentry API access
- `SENTRY_ORGANIZATION_SLUG`: Sentry organization slug ("smart-cleaning-solutions")
- `SENTRY_ORGANIZATION_ID`: Sentry organization ID
- `VITE_APP_VERSION`: App version to track in Sentry releases

### Legacy Variable
- `SENTRY_AUTH_TOKEN`: Authentication token for Sentry API access

### Setting Up Environment Variables

#### For Local Development

Create a `.env` file in the project root with:

```
# Organization-based setup (preferred)
ORGANIZATION_AUTH_TOKEN_SENTRY=your_org_auth_token
SENTRY_ORGANIZATION_SLUG=smart-cleaning-solutions
SENTRY_ORGANIZATION_ID=your_org_id
VITE_APP_VERSION=development

# OR Legacy setup
SENTRY_AUTH_TOKEN=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
```

#### For CI/CD (GitHub Actions)

The following GitHub Secrets have been configured:
- `ORGANIZATION_AUTH_TOKEN_SENTRY`: Organization authentication token
- `SENTRY_ORGANIZATION_SLUG`: Organization slug
- `SENTRY_ORGANIZATION_ID`: Organization ID
- `VITE_APP_VERSION`: Should be set dynamically in CI (e.g., from git tag)

To access these secrets in GitHub Actions workflows, use:
```yaml
env:
  ORGANIZATION_AUTH_TOKEN_SENTRY: ${{ secrets.ORGANIZATION_AUTH_TOKEN_SENTRY }}
  SENTRY_ORGANIZATION_SLUG: ${{ secrets.SENTRY_ORGANIZATION_SLUG }}
  SENTRY_ORGANIZATION_ID: ${{ secrets.SENTRY_ORGANIZATION_ID }}
  VITE_APP_VERSION: ${{ github.ref_name }}
```

## Source Maps Integration

The project has been configured to automatically upload source maps to Sentry during the build process. This helps in providing accurate stack traces for production errors.

Key configuration:
- Source maps are generated during build (`sourcemap: true` in Vite config)
- The Sentry Vite plugin handles uploading source maps automatically
- Authentication is managed through environment variables

## Error Reporting Workflow

The project uses a centralized error reporting utility (`src/utils/errorReporting.ts`) that provides methods for:

- Capturing exceptions with context
- Logging messages
- Setting user context
- Adding breadcrumbs for debugging
- Creating performance transactions
- Setting tags and extra context
- Collecting user feedback on errors

## Common Issues and Resolutions

- **Missing Source Maps**: If errors appear without proper stack traces in Sentry, ensure the build includes source maps and they are properly uploaded.
- **Authentication Errors**: Check that the `ORGANIZATION_AUTH_TOKEN_SENTRY` or `SENTRY_AUTH_TOKEN` environment variable is correctly set.
- **Organization Issues**: Verify that `SENTRY_ORGANIZATION_SLUG` is set correctly if using organization-based authentication.
- **Performance Monitoring**: If transactions aren't being recorded, check that the tracesSampleRate is set appropriately.

## Recent Error History

| Date | Error | Resolution |
|------|-------|------------|
| 2025-04-01 | `Cannot read property 'data' of undefined` in Dashboard component | Fixed by adding null check before accessing data property |
| 2025-04-02 | Connection timeout during API call to fetch client metrics | Implemented retry logic with exponential backoff |
| 2025-04-03 | React Router error: No routes matched location "/settings" | Added missing route definition for settings page |
| 2025-04-03 | Hook violations in React component lifecycle | Refactored components to properly use React hooks |
| 2025-04-03 | Updated Sentry integration with improved context and monitoring | Implemented centralized Sentry configuration |

## Testing Sentry Integration

Use the `ErrorTest` component to verify that Sentry is working correctly:
1. Trigger test errors to ensure they appear in Sentry
2. Send test messages to verify message capturing
3. Test performance monitoring with transactions
4. Verify that context and breadcrumbs are properly attached

To ensure Sentry is configured correctly, check the following in the Sentry dashboard:
- Error events should include source maps for better stack traces
- Performance transactions should be recorded
- User information should be associated with errors when available
- Tags and context should be properly attached to events
