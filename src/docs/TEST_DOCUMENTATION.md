
# Testing Guide

This document provides information about testing in the project and how to run tests.

## Unit Tests

Unit tests are written using Jest and are located in `__tests__` folders adjacent to the code they test.

### Running Tests

To run the tests:

```bash
npm test
```

Or for a specific test file:

```bash
npm test -- src/utils/__tests__/validators.test.ts
```

## Test Coverage

To run tests with coverage reports:

```bash
npm test -- --coverage
```

## Testing Business Rules

The validation tests ensure our application correctly validates and formats Australian business identifiers:

- ABN (Australian Business Number) validation and formatting
- ACN (Australian Company Number) validation and formatting

These tests help ensure the application conforms to Australian business standards and prevents invalid data from entering the system.

## Error Logging Integration

Tests also cover the integration with our error reporting system to ensure errors are properly logged, categorized, and displayed to users.

## Adding New Tests

When adding new functionality:

1. Create tests in a `__tests__` folder adjacent to the code
2. Follow the existing pattern of `describe` and `it` blocks
3. Ensure all edge cases are covered
4. Run tests to verify they pass

Remember to update this documentation when significant changes to the testing approach are made.
