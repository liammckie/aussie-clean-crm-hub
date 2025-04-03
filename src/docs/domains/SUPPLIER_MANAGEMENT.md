
# Supplier Management

## Overview
The Supplier Management module is a core component of the Aussie Clean ERP system responsible for managing all external service providers, subcontractors, and vendors who deliver cleaning and related services on behalf of the company. This module handles supplier onboarding, compliance documentation, payment details, assignment management, and performance tracking.

## Core Components
- Supplier Profile Management
- Compliance Documentation Tracking
- Contract and Site Assignment
- Payment Processing
- Performance Monitoring
- Quality Assessment Integration

## Quick Links
- [Supplier Data Model](./supplier/SUPPLIER_DATA_MODEL.md) - Core data entities and relationships
- [Business Rules](./supplier/BUSINESS_RULES.md) - Core business logic and workflows
- [UI Components](./supplier/UI_COMPONENTS.md) - Interface and interaction patterns
- [Integration Points](./supplier/INTEGRATION_POINTS.md) - Connections to other modules and systems
- [Reports & Analytics](./supplier/REPORTS_ANALYTICS.md) - Analysis and insights capabilities

## Permission Model

| Role | View | Edit | Assign | Approve Payment | Deactivate | Delete |
|------|------|------|--------|----------------|------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Operations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Finance | ✅ | ✅ (bank/compliance only) | ❌ | ✅ | ❌ | ❌ |
| HR | ✅ | ✅ (compliance only) | ❌ | ❌ | ❌ | ❌ |

## Related Modules
- [Contract Management](./CONTRACT_MANAGEMENT.md) - For service agreement management
- [Site Management](./SITE_MANAGEMENT.md) - For location assignments
- [Supplier Portal](./SUPPLIER_PORTAL.md) - Self-service interface for suppliers
