
# Coding Standards

## Overview
This document outlines the coding standards and best practices for the Aussie Clean ERP project. Following these standards ensures consistency, maintainability, and quality across the codebase.

## TypeScript and JavaScript

### General Guidelines
- Use TypeScript for all new code
- Maintain strict type checking (`strict: true` in tsconfig.json)
- Avoid using `any` type whenever possible
- Use interfaces for defining object shapes and function signatures
- Use type aliases for union types or complex type definitions
- Prefer immutability (use `const`, avoid mutation)

### Naming Conventions
- **Files & Directories**: Use kebab-case (e.g., `client-list.tsx`, `error-reporting.ts`)
- **Components**: Use PascalCase (e.g., `ClientList`, `ErrorBoundary`)
- **Interfaces**: Use PascalCase with "I" prefix or descriptive names (e.g., `IClient` or `ClientData`)
- **Type Aliases**: Use PascalCase (e.g., `ClientStatus`, `PaymentMethod`)
- **Functions**: Use camelCase (e.g., `fetchClientData`, `validateAbn`)
- **Variables**: Use camelCase (e.g., `clientList`, `isLoading`)
- **Constants**: Use UPPER_SNAKE_CASE for true constants (e.g., `MAX_CLIENTS`, `API_URL`)
- **Enums**: Use PascalCase (e.g., `ClientStatus`, `InvoiceType`)

### Code Style
- Indentation: 2 spaces
- Line length: ~100 characters
- Use semicolons at the end of statements
- Use single quotes for strings (unless the string contains single quotes)
- Add trailing commas in multi-line object/array literals
- Use explicit type annotations for function returns
- Use async/await instead of Promise chains

## React

### Component Structure
- One component per file (except for small related components)
- Use functional components with hooks
- Use arrow function syntax for component definitions
- Define prop types with TypeScript interfaces
- Destructure props in function parameters
- Keep components focused and small (under 200 lines of code)

### Hooks
- Follow the Rules of Hooks
- Use custom hooks to share stateful logic
- Keep hook logic focused on a single concern
- Prefix custom hooks with "use" (e.g., `useClients`, `useNotification`)
- Put complex hook logic in separate files

### JSX Style
- Use self-closing tags for components without children
- Use fragments (`<>...</>`) to avoid unnecessary divs
- One attribute per line when a component has multiple props
- Always use curly braces for dynamic values
- Always add key props to list items with stable, unique IDs

## Project Structure

### Directory Organization
- Group files by feature/domain rather than by type
- Keep related files close together
- Maintain a flat hierarchy when possible
- Use index files to simplify imports

### Import Order
1. External libraries
2. Internal modules
3. Component imports
4. Style/asset imports
5. Type imports

### Export Conventions
- Use named exports for utilities and helper functions
- Use default exports for components

## State Management

### React Query
- Use for all server state management
- Define query keys consistently
- Handle loading and error states
- Use proper caching strategies

### Context API
- Use for UI state that needs to be accessed by many components
- Keep contexts focused on specific domains
- Provide sensible default values
- Split context provider from definition when appropriate

## Error Handling

### Approach
- Use try/catch blocks around async operations
- Report errors to Sentry
- Display user-friendly error messages
- Log detailed error information for debugging
- Use error boundaries for component-level errors

### Error Boundaries
- Implement at the route level
- Provide fallback UI
- Report errors to monitoring system

## Comments and Documentation

### Code Comments
- Comment complex logic and business rules
- Use JSDoc comments for functions and interfaces
- Avoid obvious comments that duplicate what the code already clearly states
- Comment temporary solutions or workarounds with TODO

### Documentation
- Document all major components and modules
- Update documentation when code changes
- Include usage examples for reusable components
- Document edge cases and limitations

## Testing

### Unit Tests
- Write tests for all business logic
- Use Jest and React Testing Library
- Test behavior, not implementation
- Mock external dependencies
- Aim for high test coverage on critical paths

### Integration Tests
- Test component interactions
- Test feature workflows
- Verify error handling

## Performance

### Optimizations
- Memoize expensive calculations with useMemo
- Prevent unnecessary re-renders with React.memo
- Use useCallback for event handlers passed to child components
- Virtualize long lists
- Lazy load components and routes
- Optimize images and assets

## Accessibility

### Requirements
- Use semantic HTML elements
- Include proper ARIA attributes when necessary
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers
- Support common screen reader technologies

## Security

### Best Practices
- Sanitize user input
- Avoid storing sensitive information in client-side storage
- Implement proper authentication and authorization checks
- Protect against XSS and CSRF attacks
- Follow security updates for dependencies

