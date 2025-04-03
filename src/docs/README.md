
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

### Development Guidelines
- [Coding Standards](./development/CODING_STANDARDS.md) - Style guides and best practices
- [Type System](./development/TYPE_SYSTEM.md) - TypeScript type usage and conventions
- [Component Library](./development/COMPONENT_LIBRARY.md) - UI component documentation
- [State Management](./development/STATE_MANAGEMENT.md) - Application state patterns

### Domain Modules
- [Client Management](./domains/CLIENT_MANAGEMENT.md) - Client data model and operations
- [Site Management](./domains/SITE_MANAGEMENT.md) - Site data model and operations
- [Contract Management](./domains/CONTRACT_MANAGEMENT.md) - Contract data model and operations
- [Sales Management](./domains/SALES_MODULE.md) - Sales lifecycle management
- [Quoting Module](./domains/QUOTING_MODULE.md) - Commercial cleaning quoting system
- [Award Engine](./domains/AWARD_ENGINE.md) - Award compliance calculations
- [Scheduling](./domains/SCHEDULING.md) - Scheduling system documentation
- [Billing](./domains/BILLING.md) - Billing system documentation

### Operational Procedures
- [Deployment](./operations/DEPLOYMENT.md) - Deployment processes and environments
- [Monitoring](./operations/MONITORING.md) - System monitoring and alerting
- [Backup and Recovery](./operations/BACKUP_RECOVERY.md) - Data backup and disaster recovery

### Integration Points
- [External APIs](./integrations/EXTERNAL_APIS.md) - Documentation of external API integrations
- [Authentication Services](./integrations/AUTHENTICATION.md) - Authentication service integrations

## Maintaining Documentation

### Guidelines
1. Keep documentation up-to-date with code changes
2. Document all major system components and workflows
3. Include troubleshooting guides for common issues
4. Use consistent formatting and terminology

### Documentation Process
1. Update relevant documentation when implementing new features
2. Review documentation during code reviews
3. Test documentation procedures regularly
4. Maintain a changelog of significant documentation updates
