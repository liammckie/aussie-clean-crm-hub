
# Workflow Dependencies

## Overview

This document maps the key workflows in the Aussie Clean ERP system, showing their dependencies and interactions. Understanding these workflows is essential for maintaining and extending the system.

## Core Workflows

### 1. Authentication Workflow

**Dependencies:** None (entry point to system)

**Process Flow:**
1. User navigates to `/login`
2. Credentials submitted via LoginForm
3. AuthContext processes authentication
4. User redirected to Dashboard or previous location
5. Protected routes become accessible

**Key Components:**
- `Login.tsx`
- `LoginForm.tsx`
- `AuthContext.tsx`
- `ProtectedRoute` in `AppRoutes.tsx`

**Error Handling:**
- Authentication failures captured and displayed via toast notifications
- Sentry tracks authentication errors

### 2. Client Management Workflow

**Dependencies:** Authentication

**Process Flow:**

#### Client Creation:
1. User navigates to `/clients/new`
2. ClientForm filled and submitted
3. clientService.createClient validates data
4. Client API creates record in database
5. User redirected to client listing or detail

#### Client Viewing/Editing:
1. User navigates to `/clients`
2. ClientsTable displays list of clients
3. User selects client to view details
4. User navigates to `/clients/:id`
5. ClientDetail displays tabs for different aspects
6. User can edit details, contacts, and addresses

**Key Components:**
- `Clients.tsx`
- `ClientDetail.tsx`
- `EditClient.tsx`
- `NewClient.tsx`
- `ClientForm.tsx`
- `ContactForm.tsx`
- `AddressForm.tsx`

**Services:**
- `clientService`
- `validationService` (for ABN/ACN validation)

**Error Handling:**
- Form validation errors displayed inline
- API errors shown via toast notifications
- Validation errors categorized and handled separately

### 3. Address Management Workflow

**Dependencies:** Client or Site entity must exist

**Process Flow:**
1. Address form accessed via client or site detail page
2. Address data submitted with entity association
3. Address API creates or updates record
4. Parent entity UI refreshes to show updated addresses

**Key Components:**
- `AddressForm.tsx`
- `AddressTable.tsx`
- `UnifiedAddressForm.tsx`

**Services:**
- `unifiedApi.createAddress`
- `unifiedApi.updateAddress`

**Error Handling:**
- Form validation for required fields
- API error handling with appropriate messages

### 4. Contact Management Workflow

**Dependencies:** Client or Site entity must exist

**Process Flow:**
1. Contact form accessed via client or site detail page
2. Contact data submitted with entity association
3. Contact API creates or updates record
4. Parent entity UI refreshes to show updated contacts

**Key Components:**
- `ContactForm.tsx`
- `ContactsTable.tsx`
- `UnifiedContactForm.tsx`

**Services:**
- `unifiedApi.createContact`
- `unifiedApi.updateContact`

**Error Handling:**
- Form validation for required fields
- API error handling with appropriate messages

### 5. Contract Management Workflow

**Dependencies:** Client and Site entities must exist

**Process Flow:**
1. User navigates to `/contracts` or related contract creation
2. Contract form filled with client and site associations
3. Billing line items added
4. Contract submitted and created in database
5. Financial calculations performed

**Key Components:**
- `Contracts.tsx`
- `ContractsTable.tsx`
- `TabulatorContainer.tsx`

**Services:**
- `contractService`
- Database triggers for financial calculations

**Error Handling:**
- Form validation for contract requirements
- Business rule validation (e.g., valid date ranges)
- API error handling

## Cross-Cutting Concerns

### Error Handling

**Dependencies:** All workflows

**Process Flow:**
1. Error occurs in component, service, or API
2. Error captured and categorized
3. Appropriate handling based on error type:
   - Validation errors: displayed in form
   - API errors: toast notifications
   - Unexpected errors: Sentry reporting
4. User presented with appropriate recovery options

**Key Components:**
- `SentryErrorBoundary`
- `ErrorReporting`
- Toast notifications

### Data Synchronization

**Dependencies:** All data modification workflows

**Process Flow:**
1. Data changes made through API
2. React Query invalidates related queries
3. UI components re-render with updated data
4. Cache updated for future reference

**Key Services:**
- React Query's `useQuery` and `useMutation`
- Query invalidation patterns

## Workflow Dependency Graph

```
┌───────────────┐
│Authentication │
└───────┬───────┘
        │
┌───────▼───────┐      ┌───────────────┐
│    Client     │──────►    Address    │
│  Management   │      │  Management   │
└───────┬───────┘      └───────────────┘
        │
        │              ┌───────────────┐
        └──────────────►    Contact    │
        │              │  Management   │
        │              └───────────────┘
┌───────▼───────┐
│     Site      │
│  Management   │
└───────┬───────┘
        │
┌───────▼───────┐
│   Contract    │
│  Management   │
└───────┬───────┘
        │
┌───────▼───────┐
│   Financial   │
│   Reporting   │
└───────────────┘
```

## Critical Dependencies

### Type Definitions

The following type dependencies are critical to system function:

1. **AddressType** (in `form-types.ts`):
   - Used in AddressForm, AddressTable, and database schema
   - Changes must be propagated to all dependent components

2. **ContactType** (in `form-types.ts`):
   - Used in ContactForm, ContactsTable, and database schema
   - Changes must be propagated to all dependent components

3. **EntityType** (in `unified/types.ts`):
   - Used for associating addresses and contacts with entities
   - Critical for the unified API approach

### Service Dependencies

1. **ValidationService**:
   - Used by ClientService for ABN/ACN validation
   - Used by forms for client/business validation

2. **UnifiedAPI**:
   - Used by multiple domains for address and contact management
   - Changes affect multiple workflows

## Testing Dependencies

For proper system testing, the following dependencies should be considered:

1. **Authentication**:
   - Must be mocked or bypassed for testing other workflows

2. **Data Preparation**:
   - Clients must exist before testing site or contract creation
   - Sites must exist before testing contract creation

3. **Validation Rules**:
   - ABN/ACN validation must be testable without external services

## Improvement Opportunities

1. **Reduce Cross-Module Dependencies**:
   - Move shared types to common locations
   - Use dependency injection patterns for services

2. **Standardize Workflow Patterns**:
   - Create consistent patterns for CRUD operations
   - Standardize error handling across workflows

3. **Improve Data Flow Visibility**:
   - Add logging or monitoring for critical workflow steps
   - Implement better state visualization for complex workflows

4. **Enhance Testing Support**:
   - Create mock services for testing isolated workflows
   - Implement integration tests for key workflow dependencies
