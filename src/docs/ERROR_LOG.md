
# Error Reporting Configuration

## Sentry Integration

This project uses Sentry for error tracking and performance monitoring. The integration is configured with the following details:

- **Organization:** smart-cleaning-solutions
- **Project:** aussie-clean-erp
- **DSN:** `https://be220d948a04a4afeeb7911a4638165d@o4509086518411264.ingest.us.sentry.io/4509086689394688`

## Environment Variables

For source map uploads to work correctly, the following environment variable must be set:

- `SENTRY_AUTH_TOKEN`: Authentication token for Sentry API access

### Setting Up Environment Variables

#### For Local Development

Create a `.env` file in the project root with:

```
SENTRY_AUTH_TOKEN=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
```

#### For CI/CD (GitHub Actions)

Add `SENTRY_AUTH_TOKEN` to GitHub repository secrets:

1. Navigate to repository Settings
2. Go to Secrets and variables > Actions
3. Add new repository secret with name `SENTRY_AUTH_TOKEN` and the value above

## Error Reporting Workflow

The project uses a centralized error reporting utility (`src/utils/errorReporting.ts`) that provides methods for:

- Capturing exceptions
- Logging messages
- Setting user context
- Adding breadcrumbs for debugging
- Creating performance transactions

## Common Issues and Resolutions

- **Missing Source Maps**: If errors appear without proper stack traces in Sentry, ensure the build includes source maps and they are properly uploaded.
- **Authentication Errors**: Check that the `SENTRY_AUTH_TOKEN` environment variable is correctly set.

## Recent Error History

| Date | Error | Resolution |
|------|-------|------------|
| | | |

