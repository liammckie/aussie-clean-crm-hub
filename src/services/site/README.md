# Site Service Module

This module provides functionality for managing site data in the application.

## Components

- **types.ts**: Type definitions for site data structures
- **api.ts**: API functions for CRUD operations on site data
- **service.ts**: Service functions that handle business logic and error handling

## API Functions

The site API provides the following functions:

- `fetchAllSites()`: Get all sites
- `fetchSiteById(id)`: Get a site by ID
- `createSite(data)`: Create a new site
- `updateSite(id, data)`: Update an existing site
- `deleteSite(id)`: Delete a site
- `fetchClientSites(clientId)`: Get all sites for a specific client

## Service Functions

The site service provides the following functions:

- `getSites()`: Get all sites with error handling
- `getSiteById(id)`: Get a site by ID with error handling
- `createSite(data)`: Create a new site with error handling
- `updateSite(id, data)`: Update an existing site with error handling
- `deleteSite(id)`: Delete a site with error handling
- `getClientSites(clientId)`: Get all sites for a specific client with error handling

## Type Definitions

- `SiteData`: Complete site data structure
- `SiteInsertData`: Data structure for creating a new site
- `SiteUpdateData`: Data structure for updating an existing site

## Aliases (for backward compatibility)

- `addSite` → `createSite`
- `editSite` → `updateSite`
- `removeSite` → `deleteSite`

## Example Usage

```typescript
import { createSite, getSites } from '@/services/site/service';

// Get all sites
const sitesResponse = await getSites();
if (isApiSuccess(sitesResponse)) {
  const sites = sitesResponse.data;
  // Use sites data
}

// Create a new site
const newSite = {
  site_name: 'New Office',
  site_code: 'NO001',
  client_id: '123',
  // ...other required fields
};
const createResponse = await createSite(newSite);
if (isApiSuccess(createResponse)) {
  // Site created successfully
}
```
