
# Aussie Clean ERP System Overview

## System Architecture

### Core Principles

The Aussie Clean ERP system is built on the following architectural principles:

1. **Modular Domain-Driven Design**: Each business domain (clients, sites, contracts) is organized into separate modules with their own components, services, and types.

2. **Type Safety**: Comprehensive TypeScript typing system ensures data consistency across the application.

3. **Centralized Error Handling**: All errors are captured through Sentry and processed through standardized error handling patterns.

4. **Component Abstraction**: UI components are abstracted for reusability across different domains.

5. **Service Layer Pattern**: Business logic is contained in service layers, separating it from UI components.

### Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query for server state, Context API for UI state
- **Form Handling**: React Hook Form with Zod validation
- **Data Storage**: Supabase (PostgreSQL)
- **Error Monitoring**: Sentry
- **Build System**: Vite

### System Layers

```
┌─────────────────────────────────────────┐
│              UI Components              │
│  (pages, forms, tables, display cards)  │
├─────────────────────────────────────────┤
│           Component Hooks               │
│     (data fetching, form handling)      │
├─────────────────────────────────────────┤
│           Service Layer                 │
│  (business logic, validation, mapping)  │
├─────────────────────────────────────────┤
│              API Layer                  │
│       (Supabase API interaction)        │
├─────────────────────────────────────────┤
│            Database Layer               │
│     (PostgreSQL tables, functions)      │
└─────────────────────────────────────────┘
```

## Key Dependencies and Flow

### Core Domain Dependencies

```
                ┌───────────┐
                │   Auth    │
                └─────┬─────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
│   Clients   │ │   Sites   │ │ Contracts │
└───────┬─────┘ └─────┬─────┘ └─────┬─────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
                ┌─────▼─────┐
                │ Financial │
                │ Reporting │
                └───────────┘
```

### Component → Service → API Flow

```
User Action → React Component → React Hook → Service Layer → API Layer → Database
    ↑                                                                      │
    └──────────────────────────────────────────────────────────────────────┘
                            Data returned to UI
```

## Type System Overview

### Domain-Specific Types

Each domain has its own type definition files:
- `src/services/client/types.ts`
- `src/services/site/types.ts`
- `src/services/contract/types.ts`

### Cross-Domain Types

Shared types that cross domain boundaries:
- `src/types/form-types.ts`: Standardized form data types
- `src/services/unified/types.ts`: Unified entity types

### Type Flow

```
Database Schema → API Response Types → Service Layer Types → UI Component Props
```

## Workflow Documentation

### Client Management Workflow

1. **Client Creation**
   - Form validation (ABN/ACN)
   - Client record creation
   - Status management

2. **Client Information Management**
   - Address management
   - Contact management
   - Document association

### Site Management Workflow

1. **Site Creation**
   - Client association
   - Address information
   - Site-specific requirements

2. **Site Scheduling**
   - Service scheduling
   - Staff assignment

### Contract Management Workflow

1. **Contract Creation**
   - Client and site association
   - Service definition
   - Pricing structure

2. **Contract Financial Tracking**
   - Billing line items
   - Revenue tracking
   - Budget management

## Data Consistency Rules

To maintain consistency across the system, the following rules should be followed:

1. **Type Definitions**: 
   - Always use types from their canonical source
   - Re-export types rather than redefining them
   - Use `export type` for re-exporting types when `isolatedModules` is enabled

2. **Address Types**:
   - Use the `AddressType` from `src/types/form-types.ts`
   - Valid address types: 'billing', 'postal', 'physical', 'shipping', 'head_office', 'branch', 'residential', 'commercial', 'warehouse', 'site'

3. **Contact Types**:
   - Use the `ContactType` from `src/types/form-types.ts`
   - Valid contact types: 'client_primary', 'client_site', 'supplier', 'employee', 'hr_payroll', 'emergency', 'subcontractor', 'sales_lead'

4. **Entity Types**:
   - Use the `EntityType` from `src/services/unified/types.ts`
   - Valid entity types: 'client', 'supplier', 'employee', 'site', 'internal'

## Code Organization Standards

1. **Component Structure**:
   - Components should be kept under 200 lines
   - Extract repeatable patterns into separate components
   - Use composition over inheritance

2. **Service Layer Structure**:
   - Separate business logic from API calls
   - Follow the pattern of `service.ts`, `api.ts`, and `types.ts` for each domain
   - Export from index.ts for clean imports

3. **Documentation Standards**:
   - Each domain should have its own documentation folder
   - Update documentation when making significant changes
   - Follow the standard templates for consistency

## Error Handling Strategy

1. **Error Categories**:
   - Validation errors (form inputs, API payloads)
   - API errors (connection issues, server errors)
   - Application errors (runtime errors, state management)

2. **Error Flow**:
   - Client-side validation using Zod schemas
   - API error handling with standardized formats
   - Error capturing with Sentry
   - User-friendly error messages via toast notifications

## Improvement Roadmap

### Short-term Improvements

1. **Type System Consistency**:
   - Audit and align all type definitions
   - Resolve current type inconsistencies
   - Implement better type sharing

2. **Component Refactoring**:
   - Break down large components (AddressForm, etc.)
   - Extract reusable patterns

3. **Service Layer Optimization**:
   - Break down large service files
   - Improve error handling patterns

### Medium-term Improvements

1. **Documentation Enhancement**:
   - Better linking between code and documentation
   - Interactive documentation system
   - Type diagram generation

2. **Testing Coverage**:
   - Increase unit test coverage
   - Implement integration tests for critical flows

3. **Performance Optimization**:
   - Implement better caching strategies
   - Optimize large data queries

## System Architecture Diagram

```
┌──────────────────┐        ┌──────────────────┐         ┌──────────────────┐
│  Auth Context    │        │  React Router    │         │  Error Boundary  │
└────────┬─────────┘        └────────┬─────────┘         └─────────┬────────┘
         │                           │                             │
         └───────────────────┬───────┴─────────────────────┬──────┘
                             │                             │
                     ┌───────┴─────────┐                   │
                     │                 │                   │
              ┌──────▼──────┐   ┌──────▼──────┐    ┌───────▼────────┐
              │   Pages     │   │ Components  │    │  QueryClient   │
              └──────┬──────┘   └──────┬──────┘    └───────┬────────┘
                     │                 │                   │
        ┌────────────┴─────────┬───────┴──────────┐        │
        │                      │                  │        │
┌───────▼────────┐    ┌───────▼────────┐  ┌───────▼───────▼┐
│ Client Domain  │    │  Site Domain   │  │Contract Domain │
└───────┬────────┘    └───────┬────────┘  └───────┬────────┘
        │                     │                   │
        └─────────────────────┼───────────────────┘
                              │
                      ┌───────▼────────┐
                      │  Supabase API  │
                      └───────┬────────┘
                              │
                      ┌───────▼────────┐
                      │   Database     │
                      └────────────────┘
```

## Conclusion

This document provides a comprehensive overview of the Aussie Clean ERP system architecture, dependencies, and workflows. It should be used as a reference for understanding the system and as a guide for maintaining consistency when making changes.

As the system evolves, this document should be updated to reflect changes in architecture, dependencies, and workflows.
