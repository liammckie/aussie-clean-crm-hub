
# System Documentation

## Overview
This documentation provides comprehensive information about the Aussie Clean ERP system, including architecture, components, workflows, and troubleshooting procedures.

## Documentation Structure

### Error Handling and Monitoring
- [Error Log](./ERROR_LOG.md) - Configuration and history of system errors
- [Sentry Testing Guide](./sentry-test.md) - Procedures for testing error reporting

### System Architecture
- [System Overview](./architecture/OVERVIEW.md) - High-level architecture and component relationships
- [Data Flow](./architecture/DATA_FLOW.md) - How data moves through the system
- [Security Model](./architecture/SECURITY.md) - Authentication, authorization, and data protection
- [Workflow Engine](./architecture/WORKFLOW_ENGINE.md) - Business process automation

### Development Guidelines
- [Coding Standards](./development/CODING_STANDARDS.md) - Style guides and best practices
- [Type System](./development/TYPE_SYSTEM.md) - TypeScript type usage and conventions
- [Component Library](./development/COMPONENT_LIBRARY.md) - UI component documentation
- [State Management](./development/STATE_MANAGEMENT.md) - Application state patterns
- [Error Handling](./development/ERROR_HANDLING.md) - Error handling strategies
- [UI/UX Guidelines](./development/UI_UX_GUIDELINES.md) - Interface design principles
- [Build Error Resolution](./development/BUILD_ERROR_RESOLUTION.md) - Common build issues and solutions
- [Schema Changelog](./development/SCHEMA_CHANGELOG.md) - Database schema evolution
- [Type Inconsistencies](./development/TYPE_INCONSISTENCIES.md) - Type system issues and solutions

### Domain Modules
Each domain module follows a standardized structure with a main overview document and subdirectory containing detailed documentation:

- [Client Management](./domains/CLIENT_MANAGEMENT.md) - Client relationship management
- [Site Management](./domains/SITE_MANAGEMENT.md) - Physical location management
- [HR Management](./domains/HR_MANAGEMENT.md) - Employee and contractor management
- [Contract Management](./domains/CONTRACT_MANAGEMENT.md) - Service agreement lifecycle
- [Sales Management](./domains/SALES_MODULE.md) - Sales pipeline and opportunity tracking
- [Quoting Module](./domains/QUOTING_MODULE.md) - Commercial cleaning quoting system
- [Award Engine](./domains/AWARD_ENGINE.md) - Award compliance calculations
- [Financial Reporting](./domains/FINANCIAL_REPORTING.md) - Financial analysis and reporting
- [Supplier Management](./domains/SUPPLIER_MANAGEMENT.md) - Vendor relationship management
- [Client Portal](./domains/CLIENT_PORTAL.md) - Client self-service interface

### Operational Procedures
- [Deployment](./operations/DEPLOYMENT.md) - Deployment processes and environments
- [Monitoring](./operations/MONITORING.md) - System monitoring and alerting
- [Backup and Recovery](./operations/BACKUP_RECOVERY.md) - Data backup and disaster recovery

### Integration Points
- [External APIs](./integrations/EXTERNAL_APIS.md) - Documentation of external API integrations
- [Authentication Services](./integrations/AUTHENTICATION.md) - Authentication service integrations

## Documentation Templates
- [Domain Documentation Template](./templates/DOMAIN_TEMPLATE.md) - Standard template for domain documentation

## Maintaining Documentation

### Guidelines
1. Keep documentation up-to-date with code changes
2. Document all major system components and workflows
3. Include troubleshooting guides for common issues
4. Use consistent formatting and terminology
5. Follow the standardized domain structure for all modules

### Documentation Process
1. Update relevant documentation when implementing new features
2. Review documentation during code reviews
3. Test documentation procedures regularly
4. Maintain a changelog of significant documentation updates
