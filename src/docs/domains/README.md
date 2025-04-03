
# Domain-Driven Design Structure

## Overview
The Aussie Clean ERP system is organized using a domain-driven design approach. This structure helps maintain clear boundaries between different business domains and promotes code organization that mirrors the business structure.

## Domain Structure
Each domain represents a distinct business capability or entity within the system:

- **Client Management** - Managing client information and relationships
- **Site Management** - Tracking physical locations where services are performed
- **Contract Management** - Managing service agreements and terms
- **Work Order Management** - Scheduling and tracking cleaning services
- **Finance Management** - Invoicing, payments, and financial reporting
- **Users Management** - User accounts, permissions, and access control
- **Supplier Management** - Managing vendor relationships and services

## Domain Organization
Each domain follows a consistent structure:

```
src/domains/<domain-name>/
├── api.ts                 # API interface for the domain
├── types.ts               # TypeScript types and interfaces
├── context/               # React context for state management
├── components/            # UI components specific to this domain
├── hooks/                 # Custom hooks for domain logic
├── utils/                 # Utility functions for the domain
├── services/              # Business logic and service classes
└── validation/            # Validation schemas (Zod, etc.)
```

## Key Principles

### Separation of Concerns
Each domain is responsible for its own data models, business logic, and UI components. Cross-domain dependencies are explicitly defined and kept to a minimum.

### Domain-Specific APIs
Each domain exposes a clean API that other domains can consume without needing to know the internal implementation details.

### Type Safety
Strong TypeScript types are defined for all domain entities to ensure type safety across the application.

### Business Logic Encapsulation
Business rules and logic are encapsulated within domain services, keeping the logic centralized and testable.

## Domain Communication

### Direct API Calls
Domains can directly call the APIs exposed by other domains when needed:

```typescript
import { clientService } from '@/domains/clients/api';
import { siteService } from '@/domains/sites/api';

// Contract creation using data from client and site domains
async function createContract(clientId, siteId, terms) {
  const client = await clientService.getClientById(clientId);
  const site = await siteService.getSiteById(siteId);
  
  // Validate cross-domain data
  if (!client || !site) {
    throw new Error('Invalid client or site');
  }
  
  // Create contract using data from multiple domains
  return contractService.createContract({
    clientId,
    clientName: client.name,
    siteId,
    siteAddress: site.address,
    terms
  });
}
```

### Global State When Needed
For truly global state (like authentication, current user, theme settings), React Context is used but kept minimal.

## Domain Documentation
Each domain maintains its own documentation in the `src/docs/domains/<domain-name>/` directory. The documentation includes:

- Overview of the domain's purpose and scope
- Data model documentation
- Business rules and constraints
- Integration points with other domains
- API documentation
- UI component documentation

## Implemented Domains

### Users Management (`src/domains/users/`)
- User account management
- Role-based access control
- Permission system
- Activity tracking

### Additional domains are being progressively implemented
