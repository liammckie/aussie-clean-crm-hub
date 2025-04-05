
# Error Handling & Validation

## Overview
This document outlines the comprehensive error handling and validation approach implemented in the Aussie Clean ERP system. Proper error handling and validation are critical for maintaining data integrity, providing clear user feedback, and ensuring system reliability.

## Recent Enhancements

### Code Splitting
We now implement code splitting using React.lazy and Suspense, which improves initial load time by only loading necessary components.

### React Query Optimizations
Queries now use appropriate staleTime and cacheTime settings to reduce unnecessary refetches and improve performance:
- Short stale time (1 minute) for frequently changing data
- Standard stale time (5 minutes) for most data
- Long stale time (30 minutes) for rarely changing data
- Infinite stale time for static data

### Enhanced Error Boundaries
We've implemented a robust error boundary system that:
- Captures and reports errors to Sentry
- Provides retry mechanisms with configurable attempt limits
- Supports automatic reset on route change
- Includes detailed error reporting and logging

## Validation Patterns

### ABN/ACN Validation

#### Implementation Details
- **Format Validation**: 
  - ABN must be 11 digits with valid checksum
  - ACN must be 9 digits with valid checksum
- **Uniqueness Check**: 
  - System prevents duplicate ABN/ACN entries
  - Validation occurs before database insertion
- **Error Messaging**:
  - Format errors: "Invalid ABN – please enter an 11-digit number with valid checksum"
  - Duplicate errors: "This ABN is already registered to another entity"

#### Technical Implementation
- **Validation Algorithms**: 
  - ABN validation using weighted sum method per ATO specifications
  - ACN validation using ASIC algorithm
- **Client-side Validation**: Immediate feedback during form entry
- **Server-side Validation**: Double-check before database operations

### Required Fields & Custom Errors

#### Core Principles
- **Field-Specific Validation**: Each field has appropriate validation rules
- **Contextual Error Messages**: Error messages are specific to the field and error type
- **Inline Validation**: Immediate feedback as users enter data
- **Submission Validation**: Comprehensive check before form submission

#### Example Required Fields by Entity
- **Client Entity**:
  - Business Name
  - ABN/ACN
  - Primary Contact Name
  - Primary Contact Email
  - Status

- **Contract Entity**:
  - Start Date
  - End Date
  - Client Reference
  - Scope of Work
  - Assigned Responsible Person

#### Error Message Examples
- Missing client name: "Business name is required for client registration"
- Invalid date range: "Contract end date must be after start date"
- Missing assignment: "Please select an assigned supplier or internal responsible person"

### Business Rules Enforcement

#### Data Integrity Rules
- **Relationship Preservation**:
  - Clients with active Sites/Contracts cannot be deleted
  - Sites with active Contracts cannot be deleted
- **Status Transitions**:
  - Defined state machines for status changes (e.g., Prospect → Active → Archived)
  - Validation of allowed transitions

#### Implementation Approach
- **Soft Deletion**: Records are archived rather than physically deleted
- **Cascading Archives**: Option to archive related entities
- **Validation Messages**:
  - "Client cannot be deleted while it has active sites or contracts"
  - "Please archive or reassign associated records first"

#### Technical Enforcement
- **Database Constraints**: Foreign key constraints prevent orphaned records
- **Application Logic**: Business rules enforced at service layer
- **API Validation**: Rules checked before database operations

## Error Handling Architecture

### Service Layer Error Handling
Our service layer implements a structured error handling approach:

```typescript
try {
  // Operation code
  
  // Success tracking
  logSuccess('operation', 'entity', { context });
  return data;
} catch (error) {
  // Structured error handling
  return handleSupabaseError(
    error, 
    'User-friendly message', 
    { operation: 'operationName', entityId: id }
  ).details as null;
}
```

### Error Categories
We categorize errors to provide appropriate responses:

1. **Validation Errors**: User input problems
2. **Authentication Errors**: Login/permissions issues
3. **Permission Errors**: Authorization failures
4. **Network Errors**: Connection problems
5. **Database Errors**: Data storage issues
6. **Server Errors**: Backend system failures
7. **Unknown Errors**: Uncategorized issues

### Error Monitoring
We use Sentry for error monitoring with:

- **Breadcrumbs**: Track user journey before errors
- **Context**: Add business context to errors
- **User Information**: Associate errors with sessions
- **Performance Tracking**: Monitor operation timing
- **Error Categorization**: Group similar issues

## User Feedback & Exception Handling

### Frontend Validation
- **Real-Time Validation**: Immediate feedback during data entry
- **Form-Level Validation**: Comprehensive check before submission
- **Visual Cues**: Clear indication of errors (red highlights, icons)
- **Accessibility**: Error messages compatible with screen readers

### Backend Validation
- **API Validation Layer**: Validates all incoming requests
- **Service Validation**: Business rule validation in service layer
- **Database Constraints**: Final safeguard at database level

### Exception Handling Strategy
- **Structured Responses**: Consistent error response format
- **Error Categorization**:
  - Validation Errors: User-correctable input problems
  - Business Rule Violations: Process or state-based restrictions
  - System Errors: Internal failures requiring technical support
- **Logging Levels**:
  - Validation issues logged at INFO level
  - Business rule violations at WARNING level
  - System errors at ERROR level with stack traces

### React Error Boundaries
We implement React Error Boundaries to:
- Prevent entire UI crashes from component errors
- Provide graceful fallbacks for users
- Capture error details for debugging
- Enable recovery without full page refresh

## Technical Implementation Guide

### Validation Framework
- **Centralized Validation**: Core validation library used across the application
- **Rule Definitions**: Declarative validation rules for entities
- **Custom Validators**: Framework for business-specific validation logic

### Error Handling Best Practices
- **Try-Catch Patterns**: Strategic exception handling around critical operations
- **Promise Rejection Handling**: Proper handling of async/await exceptions
- **Global Error Handlers**: Catching uncaught exceptions at application boundaries
- **Error Boundaries**: Component-level error containment for UI

### Logging and Monitoring
- **Structured Logging**: JSON-formatted logs with consistent fields
- **Correlation IDs**: Request tracking across system components
- **Error Aggregation**: Dashboard for monitoring error rates and patterns
- **Alerting**: Notifications for critical error conditions

## Performance Optimizations

### Code Splitting
- Lazy loading of routes and components
- Performance tracking of component loading times
- Fallback UI during loading

### React Query Caching
- Optimized stale times based on data volatility
- Appropriate cache retention policies
- Performance tracking of query execution

## Testing Approach

### Validation Testing
- Unit tests for validation functions
- Integration tests for form validation
- Boundary testing for edge cases

### Error Path Testing
- Simulate network failures
- Test database constraints
- Verify error messages
- Validate recovery paths
