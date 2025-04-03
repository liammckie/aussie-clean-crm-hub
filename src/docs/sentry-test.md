
# Sentry Error Testing Guide

## Purpose
This document outlines procedures for testing Sentry error reporting in the application. These tests help ensure that errors are properly captured, contextualized, and reported to Sentry for monitoring and resolution.

## Prerequisites
- Access to the development or staging environment
- Sentry account with access to the project dashboard
- Valid authentication token configured in environment variables

## Test Procedures

### 1. Basic Error Capture Test
Test whether uncaught exceptions are properly captured by Sentry.

**Steps:**
1. Navigate to the error test component (accessible from the development dashboard)
2. Click the "Trigger Test Error" button
3. Verify in the Sentry dashboard that the error appears with the correct context

### 2. React Component Error Boundary Test
Test that errors within React components are caught by error boundaries and reported.

**Steps:**
1. Navigate to any protected route
2. Trigger a component error using the development tools
3. Verify the error boundary catches the error and Sentry receives the report

### 3. API Error Reporting Test
Test that API errors are properly reported with context.

**Steps:**
1. Attempt an operation that will generate a backend API error
2. Verify that Sentry captures the error with API context
3. Check that the error includes relevant HTTP status codes and request details

### 4. Custom Context Test
Test that custom context is properly attached to error reports.

**Steps:**
1. Log in as a test user
2. Trigger an error on a protected route
3. Verify in Sentry that the error report includes user context

### 5. Performance Monitoring Test
Test that performance transactions are properly recorded.

**Steps:**
1. Navigate through a complete user journey (login → dashboard → feature use)
2. Check Sentry Performance tab for the recorded transaction
3. Verify that important spans are captured with appropriate names

## Troubleshooting Common Issues

### Missing Source Maps
If errors appear without proper stack traces:
- Ensure sourcemap generation is enabled in Vite config
- Verify that the `SENTRY_AUTH_TOKEN` is correctly configured
- Check build logs for any source map upload failures

### Authentication Errors
If Sentry rejects API requests:
- Verify the authentication token is valid and has not expired
- Ensure the project and organization slugs are correctly configured
- Check that the token has sufficient permissions for source map uploads

### Environment Configuration
If errors are reported to the wrong environment:
- Check the environment configuration in the Sentry initialization
- Verify that the correct DSN is being used for each environment
- Ensure that release tags are properly set during the build process
