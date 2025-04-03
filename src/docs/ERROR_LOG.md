
# Error Reporting Configuration

## Sentry Integration

This project uses Sentry for error tracking and performance monitoring. The integration is configured with the following details:

- **Organization:** smart-cleaning-solutions
- **Project:** aussie-clean-erp
- **DSN:** `https://be220d948a04a4afeeb7911a4638165d@o4509086518411264.ingest.us.sentry.io/4509086689394688`

## Environment Variables

For source map uploads to work correctly, the following environment variables can be used:

### Organization-based Variables (Preferred)
- `ORGANIZATION_AUTH_TOKEN_SENTRY`: Organization authentication token for Sentry API access
- `SENTRY_ORGANIZATION_SLUG`: Sentry organization slug ("smart-cleaning-solutions")
- `SENTRY_ORGANIZATION_ID`: Sentry organization ID

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

# OR Legacy setup
SENTRY_AUTH_TOKEN=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
```

#### For CI/CD (GitHub Actions)

The following GitHub Secrets have been configured:
- `ORGANIZATION_AUTH_TOKEN_SENTRY`: Organization authentication token
- `SENTRY_ORGANIZATION_SLUG`: Organization slug
- `SENTRY_ORGANIZATION_ID`: Organization ID

To access these secrets in GitHub Actions workflows, use:
```yaml
env:
  ORGANIZATION_AUTH_TOKEN_SENTRY: ${{ secrets.ORGANIZATION_AUTH_TOKEN_SENTRY }}
  SENTRY_ORGANIZATION_SLUG: ${{ secrets.SENTRY_ORGANIZATION_SLUG }}
  SENTRY_ORGANIZATION_ID: ${{ secrets.SENTRY_ORGANIZATION_ID }}
```

## Source Maps Integration

The project has been configured to automatically upload source maps to Sentry during the build process. This helps in providing accurate stack traces for production errors.

Key configuration:
- Source maps are generated during build (`sourcemap: true` in Vite config)
- The Sentry Vite plugin handles uploading source maps automatically
- Authentication is managed through environment variables

## Error Reporting Workflow

The project uses a centralized error reporting utility (`src/utils/errorReporting.ts`) that provides methods for:

- Capturing exceptions
- Logging messages
- Setting user context
- Adding breadcrumbs for debugging
- Creating performance transactions

## Common Issues and Resolutions

- **Missing Source Maps**: If errors appear without proper stack traces in Sentry, ensure the build includes source maps and they are properly uploaded.
- **Authentication Errors**: Check that the `ORGANIZATION_AUTH_TOKEN_SENTRY` or `SENTRY_AUTH_TOKEN` environment variable is correctly set.
- **Organization Issues**: Verify that `SENTRY_ORGANIZATION_SLUG` is set correctly if using organization-based authentication.

## Recent Error History

| Date | Error | Resolution |
|------|-------|------------|
| | | |

