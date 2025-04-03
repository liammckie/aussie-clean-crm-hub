
# System Architecture Overview

## Introduction
Aussie Clean ERP is a comprehensive system designed to manage cleaning service operations, including client management, site management, scheduling, and billing. This document provides a high-level overview of the system architecture.

## Architecture Principles
- **Modular Design**: The system is organized into domain-specific modules that encapsulate related functionality
- **Separation of Concerns**: UI, business logic, and data access are separated
- **Type Safety**: TypeScript is used throughout to ensure type safety
- **Responsive Design**: The UI adapts to different screen sizes and devices
- **Error Resilience**: Comprehensive error handling and reporting

## System Layers

### Presentation Layer
- **React Components**: UI components built with React and TypeScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library providing consistent design elements
- **React Router**: Client-side routing

### Application Layer
- **React Query**: Data fetching, caching, and state management
- **Context API**: Global state management for authentication and application state
- **Custom Hooks**: Encapsulated business logic and component behavior

### Data Layer
- **Supabase Client**: API client for interacting with the backend
- **Type-Safe Queries**: Strongly typed database access
- **Data Transformations**: Conversion between API and domain models

### Infrastructure
- **Sentry**: Error monitoring and reporting
- **Vite**: Development and build tooling
- **GitHub Actions**: CI/CD pipeline

## Key Components

### Authentication
- JWT-based authentication
- Role-based access control
- Session management

### Client Management
- Client information storage and retrieval
- Client relationship history
- Document management

### Site Management
- Site details and specifications
- Site-specific requirements
- Site access information

### Scheduling
- Service scheduling
- Staff assignment
- Recurring service patterns

### Reporting
- Financial reports
- Operational metrics
- Performance dashboards

## Data Flow
1. User interactions trigger component events
2. Events invoke application layer functions
3. Application layer performs business logic
4. Data layer executes database operations
5. Results propagate back through the layers
6. UI updates to reflect the new state

## Deployment Architecture
- Frontend deployed on Vercel
- Backend services on Supabase
- File storage on Supabase Storage
- Monitoring with Sentry

## Security Considerations
- All API requests are authenticated
- Sensitive data is encrypted
- Row-level security enforced in the database
- HTTPS for all communications

