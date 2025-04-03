
# Site Management Module

## Overview
The Site Management module is a foundational component of the Aussie Clean ERP system responsible for tracking all physical locations where services are delivered. It manages location data, site-specific configurations, service scheduling details, and compliance requirements for client properties.

## Core Components
- Site Profile Management
- Location Tracking
- Service Configuration
- Compliance Requirements
- Supplier Assignment
- Employee Assignment
- Document Management
- Site Visit Recording

## Quick Links
- [Site Data Model](./site/SITE_DATA_MODEL.md) - Core data entities and relationships
- [Business Rules](./site/BUSINESS_RULES.md) - Core business logic and workflows
- [UI Components](./site/UI_COMPONENTS.md) - Interface and interaction patterns
- [Integration Points](./site/INTEGRATION_POINTS.md) - Connections to other modules and systems
- [Reports & Analytics](./site/REPORTS_ANALYTICS.md) - Analysis and insights capabilities

## Permission Model

| Role | Create | View | Edit | Archive | Delete |
|------|--------|------|------|---------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ (if no contracts) |
| Operations | ✅ | ✅ | ✅ | ✅ (region only) | ❌ |
| Account Manager | ✅ | ✅ | ❌ | ❌ | ❌ |
| Field Staff | ❌ | ✅ (assigned only) | ❌ | ❌ | ❌ |

## Future Enhancements
- Support for alternate coordinates (entry point vs. building centroid)
- Attachment of floor plans with interactive element tagging
- Automated generation of compliance alerts for expiring credentials
- Grouping support for campus-style multi-site clusters
- Permission-aware map visualization with proximity search
- Supplier fallback or automatic reassignment for compliance breaches
- QR code generation for site-specific digital information access
- Integration with IoT devices for environmental monitoring
