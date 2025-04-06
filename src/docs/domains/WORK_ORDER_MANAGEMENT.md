
# Work Order Management

## Overview
The Work Order Management module is a core component of the Aussie Clean ERP system that tracks and manages operational tasks from creation to completion. It provides a structured workflow for assigning, tracking, and billing service delivery across sites, contracts, and suppliers. This module bridges the gap between contracts, operations, and finance, ensuring that all service activities are properly documented and accounted for.

## Core Components
- Work Order Creation and Assignment
- Task Management and Tracking
- Supplier Work Assignment
- Financial Tracking and Billing
- Operational Performance Metrics
- Quality Assessment Integration

## Quick Links
- [Work Order Data Model](#data-model)
- [Business Rules](#business-rules)
- [UI Components](#ui-components)
- [Integration Points](#integration-points)
- [Reports & Analytics](#reports-analytics)

## Permission Model

| Role | Create | View | Edit | Assign | Complete | Delete |
|------|--------|------|------|--------|----------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Operations | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Finance | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Supplier | ❌ | 🔹 | 🔹 | ❌ | 🔹 | ❌ |

*🔹 Restricted to own assignments only*

## Data Model

### Work Orders
The primary entity representing a scheduled service task:

#### Basic Information
- **Work Order ID**: Unique identifier (UUID, Primary Key)
- **Work Order Number**: Unique reference code (string)
- **Title**: Brief description of the work (string)
- **Description**: Detailed description of work to be performed
- **Status**: Current state (enum: pending, assigned, in_progress, completed, cancelled)
- **Priority**: Urgency level (enum: low, medium, high, urgent)
- **Service Type**: Category of service (string)

#### Scheduling
- **Scheduled Start**: Planned start date/time
- **Scheduled End**: Planned completion date/time
- **Actual Start**: When work actually began
- **Actual End**: When work was actually completed

#### Relationships
- **Contract ID**: Foreign key to contracts table
- **Client ID**: Foreign key to clients table
- **Site ID**: Foreign key to sites table
- **Supplier ID**: Optional foreign key to assigned supplier
- **Created By**: User who created the work order
- **Updated By**: User who last modified the work order

#### Financial
- **Billing Method**: How to bill for this work (string)
- **Estimated Cost**: Projected cost before work begins
- **Actual Cost**: Final cost after completion

### Work Order Tasks
Breaks down work orders into discrete tasks:

- **Task ID**: Unique identifier (UUID, Primary Key)
- **Work Order ID**: Foreign key to work_orders table
- **Task Name**: Brief name of the task
- **Description**: Detailed description of the task
- **Status**: Current state (enum: pending, in_progress, completed, cancelled)
- **Estimated Time**: Projected time to complete (numeric)
- **Actual Time**: Time actually taken (numeric)
- **Completed At**: When task was marked complete
- **Completed By**: User who completed the task

### Workbills
Handles financial tracking for work orders:

- **Workbill ID**: Unique identifier (UUID, Primary Key)
- **Work Order ID**: Foreign key to work_orders table
- **Supplier ID**: Optional foreign key to suppliers table
- **Status**: Payment status (enum: pending, approved, paid, disputed)
- **Amount**: Total billable amount
- **Hours Worked**: Total time spent on work order
- **Pay Rate**: Rate paid to supplier/worker
- **Invoice Number**: Reference to external invoice
- **Invoice Date**: When invoice was issued
- **Payment Date**: When payment was made
- **Payment Reference**: External payment reference
- **Notes**: Additional billing notes

## Business Rules

### Work Order Creation
1. Each work order must be linked to a valid site and contract
2. Scheduled dates must be within the contract term dates
3. Priority levels determine response and completion timeframes
4. Estimated costs should be validated against contract budget limits

### Work Order Assignment
1. Suppliers can only be assigned to work orders if they have an active contract link
2. Notification to assigned supplier is automatic on assignment
3. Status changes to "assigned" when a supplier is linked

### Task Management
1. Work orders can contain multiple tasks
2. Work order cannot be marked complete until all tasks are complete
3. Task completion requires photo evidence for quality control

### Financial Rules
1. Workbills can only be created for completed work orders
2. Approval workflow required for workbills above specified threshold
3. Workbill amount cannot exceed 120% of estimated cost without approval

## Integration Points

### Contract Management
- Draws scope and pricing information from linked contract
- Validates work against contract terms and SLAs
- Updates contract utilization metrics

### Supplier Management
- Assigns suppliers from approved contract supplier list
- Updates supplier performance metrics
- Drives supplier compliance requirements

### Financial System
- Generates invoice data for completed work orders
- Tracks payment status and reconciliation
- Provides cost reporting for financial analysis

### Quality Assessment
- Integrates with QA inspections and ratings
- Links customer feedback to specific work orders
- Tracks compliance with service level agreements

## Reports & Analytics

### Operational Reports
- Work Order Status Summary by Site/Client
- Average Completion Time by Service Type
- Supplier Assignment and Completion Rates
- Schedule Adherence and SLA Compliance

### Financial Reports
- Work Order Cost vs. Budget Analysis
- Billing Efficiency (Time to Invoice)
- Supplier Cost Analysis
- Profitability by Work Order Type

### Performance Dashboards
- Real-time Work Order Status Metrics
- Team/Supplier Performance Comparisons
- Client Satisfaction by Work Order Type
- Trend Analysis of Operational Efficiency

## Future Enhancements
- Mobile application for field staff
- GPS tracking of work order attendance
- Customer portal for work order requests
- Automated scheduling optimization
- Predictive maintenance work orders
