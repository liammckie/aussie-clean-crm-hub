
# Build Error Resolution Guide

## Overview
This document provides guidance for resolving common build errors in the Aussie Clean ERP system. It covers TypeScript errors, Vite build issues, and React-specific problems that developers might encounter.

## TypeScript Errors

### Type Mismatch Errors

#### Symptom
```
Type 'X' is not assignable to type 'Y'
```

#### Common Causes
- Passing incorrect props to components
- API response structure changed
- Missing nullable check

#### Resolution Steps
1. Compare the actual type with the expected type
2. Check for null/undefined handling
3. Update interface definitions if API changed
4. Use type assertions only as a last resort
5. Add type guards for complex conditions

#### Example Fix
```typescript
// Before
function processClient(client: Client) {
  return client.sites.map(site => site.name);
}

// After
function processClient(client: Client) {
  return (client.sites ?? []).map(site => site.name);
}
```

### Missing Properties

#### Symptom
```
Property 'X' does not exist on type 'Y'
```

#### Common Causes
- Incomplete interface definitions
- Accessing properties before data is loaded
- Typos in property names

#### Resolution Steps
1. Verify property exists in the actual data
2. Update interface to include missing property
3. Add optional chaining for potentially undefined properties
4. Add loading state checks

#### Example Fix
```typescript
// Before
return <div>{client.contactPerson.name}</div>

// After
return <div>{client?.contactPerson?.name}</div>
```

### Generic Type Errors

#### Symptom
```
Type 'X' does not satisfy the constraint 'Y'
```

#### Common Causes
- Incorrect generic type parameters
- Using incompatible types with generic functions
- Missing required properties in generic objects

#### Resolution Steps
1. Review the generic type constraints
2. Ensure passed types include all required properties
3. Add explicit type parameters if inference fails
4. Consider creating more specific interfaces

#### Example Fix
```typescript
// Before
const result = useQuery('clients');

// After
const result = useQuery<ClientResponse, Error>('clients');
```

## React-Specific Errors

### Hook Rules Violations

#### Symptom
```
React Hook "useX" is called conditionally...
```

#### Common Causes
- Calling hooks inside conditionals
- Calling hooks inside loops
- Calling hooks inside nested functions

#### Resolution Steps
1. Move hook calls to the top level of component
2. Use conditional rendering instead of conditional hooks
3. Extract conditional logic into separate components

#### Example Fix
```typescript
// Before
function Component() {
  if (condition) {
    useEffect(() => {
      // ...
    }, []);
  }
}

// After
function Component() {
  useEffect(() => {
    if (condition) {
      // ...
    }
  }, [condition]);
}
```

### Missing Dependencies

#### Symptom
```
React Hook useEffect has a missing dependency: 'X'
```

#### Common Causes
- Omitting variables from dependency arrays
- Using object references that change on each render
- Using functions that are recreated on each render

#### Resolution Steps
1. Add missing dependencies to the array
2. Memoize objects with useMemo
3. Memoize functions with useCallback
4. Consider if the effect should run less frequently

#### Example Fix
```typescript
// Before
useEffect(() => {
  fetchData(clientId);
}, []); // Missing dependency

// After
useEffect(() => {
  fetchData(clientId);
}, [clientId]);
```

### Invalid JSX

#### Symptom
```
Type 'X' is not assignable to type 'ReactNode'
```

#### Common Causes
- Returning objects or invalid types in JSX
- Incorrect component prop types
- Invalid children types

#### Resolution Steps
1. Ensure components return valid JSX
2. Convert objects to strings or JSX
3. Check component prop type definitions
4. Use fragments for multiple elements

#### Example Fix
```typescript
// Before
return <div>{JSON.stringify(client)}</div>;

// After
return (
  <div>
    <span>{client.name}</span>
    <span>{client.email}</span>
  </div>
);
```

## Vite Build Issues

### Import Errors

#### Symptom
```
Could not resolve import 'X' from 'Y'
```

#### Common Causes
- Missing files or incorrect paths
- Circular dependencies
- Case sensitivity issues in imports
- Missing file extensions in imports

#### Resolution Steps
1. Verify file exists at the specified path
2. Check for case mismatches in import paths
3. Use absolute imports with '@/' prefix
4. Resolve circular dependencies

#### Example Fix
```typescript
// Before
import { Client } from '../types/client';

// After
import { Client } from '@/types/client';
```

### Chunk Loading Errors

#### Symptom
```
Loading chunk X failed
```

#### Common Causes
- Dynamic imports failing
- Code splitting issues
- Network problems loading chunks

#### Resolution Steps
1. Use error boundaries to catch chunk loading failures
2. Implement retry logic for dynamic imports
3. Review code splitting configuration
4. Consider reducing chunk size

#### Example Fix
```typescript
// Before
const Component = React.lazy(() => import('./HeavyComponent'));

// After
const Component = React.lazy(() => 
  import('./HeavyComponent').catch(error => {
    console.error('Failed to load component', error);
    return import('./FallbackComponent');
  })
);
```

### Environment Variable Issues

#### Symptom
```
process.env.X is undefined
```

#### Common Causes
- Missing environment variables
- Incorrect variable naming
- Not prefixing with VITE_

#### Resolution Steps
1. Ensure variables are prefixed with VITE_
2. Check .env files for correct variable names
3. Verify variables are available in build environment
4. Use import.meta.env instead of process.env

#### Example Fix
```typescript
// Before
const apiKey = process.env.API_KEY;

// After
const apiKey = import.meta.env.VITE_API_KEY;
```

## CSS and Styling Issues

### Tailwind Class Issues

#### Symptom
```
Unknown Tailwind class 'X'
```

#### Common Causes
- Typos in class names
- Using custom classes without defining them
- Using non-standard Tailwind utility

#### Resolution Steps
1. Check for typos in class names
2. Verify custom classes are defined in tailwind.config.js
3. Use Tailwind IntelliSense extension
4. Review Tailwind documentation for correct utility names

#### Example Fix
```tsx
// Before
<div className="bg-primary-700 text-sm">Content</div>

// After
<div className="bg-primary-700 text-sm">Content</div>
```

### CSS Module Issues

#### Symptom
```
Cannot find module './styles.module.css'
```

#### Common Causes
- Incorrect file path
- Missing CSS module file
- Vite configuration issues

#### Resolution Steps
1. Verify CSS module file exists
2. Check file extension (.module.css)
3. Ensure Vite is configured for CSS modules
4. Try clearing the cache and rebuilding

#### Example Fix
```typescript
// Before
import styles from './styles.module.css';

// After
import styles from './Component.module.css';
```

## Performance Warnings

### Large Bundle Size

#### Symptom
```
Chunk X exceeds the recommended size limit
```

#### Common Causes
- Large dependencies
- Inefficient code splitting
- Importing entire libraries instead of specific functions

#### Resolution Steps
1. Analyze bundle with rollup-plugin-visualizer
2. Implement code splitting for large components
3. Use dynamic imports for routes
4. Import only needed functions from libraries

#### Example Fix
```typescript
// Before
import * as lodash from 'lodash';

// After
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

### Render Performance

#### Symptom
```
Component X took too long to render
```

#### Common Causes
- Expensive calculations during render
- Missing memoization
- Rendering too many items

#### Resolution Steps
1. Move expensive calculations to useMemo
2. Use virtualization for long lists
3. Implement pagination for large datasets
4. Split complex components into smaller ones

#### Example Fix
```typescript
// Before
function ClientList({ clients }) {
  const sortedClients = clients.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ul>
      {sortedClients.map(client => <li key={client.id}>{client.name}</li>)}
    </ul>
  );
}

// After
function ClientList({ clients }) {
  const sortedClients = useMemo(() => 
    clients.sort((a, b) => a.name.localeCompare(b.name)),
    [clients]
  );
  
  return (
    <ul>
      {sortedClients.map(client => <li key={client.id}>{client.name}</li>)}
    </ul>
  );
}
```

## Debugging Techniques

### Vite Build Debugging

#### Steps
1. Run build with debug logging:
   ```
   VITE_DEBUG=true npm run build
   ```
2. Examine verbose output for errors
3. Use source maps to trace build issues
4. Check browser console for runtime errors

### TypeScript Configuration Issues

#### Debugging Approach
1. Temporarily disable strict checks to isolate issue:
   ```
   // tsconfig.json
   "strict": false
   ```
2. Re-enable individual strict flags one by one
3. Use `// @ts-ignore` to isolate problematic lines
4. Generate type declaration files for inspection

### React DevTools

#### Debugging Steps
1. Install React DevTools browser extension
2. Examine component props and state
3. Profile renders to identify performance issues
4. Check for unexpected re-renders
5. Verify hook dependencies

## Common Solutions

### Type Assertion Safety
Use type assertions cautiously and only after validation:

```typescript
function assertIsClient(data: unknown): asserts data is Client {
  if (!data || typeof data !== 'object') throw new Error('Not a client object');
  if (!('id' in data)) throw new Error('Missing client ID');
  // Additional validation...
}

function processClientData(data: unknown) {
  assertIsClient(data);
  // Now TypeScript knows data is Client
  return data.id;
}
```

### Error Boundary Implementation
Wrap component trees with error boundaries to prevent cascading failures:

```typescript
import { ErrorBoundary } from '@/components/error/SentryRouteError';

function SafeClientView() {
  return (
    <ErrorBoundary>
      <ClientDetails />
    </ErrorBoundary>
  );
}
```

### Dynamic Import with Error Handling
Safe pattern for code splitting:

```typescript
const ClientModule = React.lazy(() => 
  import('./ClientModule')
    .catch(error => {
      console.error('Failed to load client module', error);
      return import('./FallbackModule');
    })
);
```
