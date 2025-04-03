
# Client Portal Module

## Overview
The Client Portal is a modern, mobile-friendly web interface tailored for clients of the commercial cleaning business. It provides transparency, live operational insights, document access, issue resolution, and KPI-driven reporting. It serves as a single source of truth by directly integrating with Contracts, Operations, HR, QA, Finance, and Document modules.

## Core Components
- Secure Authentication and Role-Based Access
- Dashboard with Site Performance Summaries
- Contract and Site Management
- Workbill Schedule Tracking
- Service Request Management
- Employee Compliance Visibility
- Quality Audit Reports and KPIs
- Document Repository
- Financial Transaction Management
- User Administration

## Quick Links
- [Portal Data Model](./client-portal/PORTAL_DATA_MODEL.md) - Core data entities and relationships
- [Business Rules](./client-portal/BUSINESS_RULES.md) - Core business logic and workflows
- [UI Components](./client-portal/UI_COMPONENTS.md) - Interface and interaction patterns
- [Integration Points](./client-portal/INTEGRATION_POINTS.md) - Connections to other modules and systems
- [Reports & Analytics](./client-portal/REPORTS_ANALYTICS.md) - Analysis and insights capabilities

## Permission Model

| Role         | View Contracts | View Financials | Submit Tickets | View QA | View Docs | View Staff | Manage Users |
|--------------|---------------|-----------------|---------------|---------|-----------|------------|--------------|
| Full Access  | ✅            | ✅              | ✅            | ✅      | ✅        | ✅         | ✅           |
| Site Manager | ✅ (site only)| ❌              | ✅            | ✅      | ✅        | ✅         | ❌           |
| Finance Only | ❌            | ✅              | ❌            | ❌      | ✅        | ❌         | ❌           |

## Future Enhancements
- QR sign-off with geotagged validation from site locations
- Automated weekly KPI email summary
- Contract renewal wizard for clients to request extensions
- Feedback survey linked to QA pass/fail events
- White-label option for enterprise clients
- Zapier connector for support tickets integration
- Scheduled reports via email (e.g., monthly QA + attendance)
- Mobile application with push notifications
