
# Work Order Workflow Documentation

## Overview
This document outlines the workflow for creating, managing, and closing work orders within the Aussie Clean ERP system. Work orders are the central operational unit that tracks the delivery of cleaning and maintenance services across client sites.

## Work Order Lifecycle

### 1. Creation Phase
- **Contract Association**: Each work order must be linked to an active contract
- **Site Selection**: Specifies which client site requires service
- **Service Specification**: Details the type of service required
- **Scheduling**: Defines when the work should be performed
- **Priority Assignment**: Sets the urgency level (low, medium, high, urgent)
- **Cost Estimation**: Projects the financial impact of the work

### 2. Assignment Phase
- **Supplier Selection**: Assign to a supplier linked to the contract
- **Task Breakdown**: Define discrete tasks that make up the work
- **Resource Allocation**: Specify equipment, materials, and staff requirements
- **Notifications**: Automatic alerts to assigned parties
- **Access Requirements**: Document site access procedures

### 3. Execution Phase
- **Work Commencement**: Supplier marks work as "in progress"
- **Task Updates**: Individual tasks are updated as they progress
- **Time Tracking**: Record actual time spent on work
- **Issue Reporting**: Document problems encountered during execution
- **Additional Requirements**: Record any scope changes or additional needs

### 4. Completion Phase
- **Task Verification**: All tasks marked as complete
- **Quality Assessment**: Optional QA check performed
- **Client Signoff**: Client verification of work completion
- **Documentation**: Photos and notes uploaded as evidence
- **Final Status Update**: Work order marked as "completed"

### 5. Financial Phase
- **Workbill Creation**: Financial record created for the work
- **Cost Reconciliation**: Compare actual costs against estimates
- **Invoice Generation**: Create client invoices (if billable)
- **Supplier Payment**: Process payment to service provider
- **Financial Closure**: All financial transactions completed

## State Transitions

| From State | To State | Trigger | Actions |
|------------|----------|---------|---------|
| - | Pending | Work order created | Notify operations team |
| Pending | Assigned | Supplier assigned | Notify supplier, update calendar |
| Assigned | In Progress | Supplier starts work | Start time tracking, notify client |
| In Progress | Completed | All tasks finished | QA check, client notification |
| Any State | Cancelled | Cancellation request | Notify all parties, document reason |

## Integration Points

### Contract Module
- Validates work order against contract terms
- Tracks work orders against contract budget
- Links to contract-specific pricing and SLAs

### Supplier Module
- Checks supplier availability and qualifications
- Updates supplier performance metrics
- Manages supplier compliance requirements

### Financial Module
- Generates invoices from completed work orders
- Tracks costs against budgets and contracts
- Manages supplier payments and client billing

### Quality Assurance Module
- Links QA inspections to specific work orders
- Tracks quality metrics across work types
- Identifies training and improvement needs

## Special Workflows

### Emergency Work Orders
- Bypass standard approval process
- Priority automatically set to "urgent"
- Expedited supplier assignment
- Real-time notifications to management

### Recurring Work Orders
- Template-based creation
- Automatic scheduling based on frequency
- Consolidated reporting for recurring work
- Performance trending across instances

### Work Order Disputes
- Client or supplier can raise disputes
- Documented resolution process
- Financial holds during dispute resolution
- Management escalation pathways

## Technical Implementation

### Row Level Security (RLS)
- Suppliers can only see their assigned work orders
- Clients can only see work orders for their sites
- Operations team can see all work orders
- Financial team can see completed work orders

### Audit Trail
- All status changes are logged with timestamp and user
- Financial changes require additional approval
- Document attachments are versioned
- Comments and notes are preserved chronologically

### Automation Rules
- SLA countdown timers based on priority
- Automatic escalation for overdue work
- Status change notifications
- Calendar integration for scheduling

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Scheduled Start | Must be in the future for new work orders | "Start date must be in the future" |
| Scheduled End | Must be after Scheduled Start | "End date must be after start date" |
| Contract ID | Must reference an active contract | "Selected contract is not active" |
| Site ID | Must be covered by the selected contract | "Selected site not covered by this contract" |
| Supplier ID | Must be linked to the contract | "Selected supplier is not approved for this contract" |

## Reports & Analytics

### Operational Dashboards
- Work Order Status Summary
- Average Completion Time by Service Type
- SLA Compliance Rates
- Regional Performance Comparisons

### Financial Analysis
- Cost per Work Order Type
- Variance Analysis (Estimated vs. Actual)
- Billing Efficiency Metrics
- Profitability by Work Type/Client/Region

### Performance Metrics
- On-Time Completion Rate
- First-Time Resolution Rate
- Client Satisfaction Scores
- Supplier Performance Rankings

## User Permissions

| Role | Create | View | Edit | Assign | Complete | Invoice | Delete |
|------|--------|------|------|--------|----------|---------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Operations | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Finance | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Client | ✅* | ✅* | ❌ | ❌ | ✅* | ❌ | ❌ |
| Supplier | ❌ | ✅** | ✅** | ❌ | ✅** | ❌ | ❌ |

* Limited to own sites
** Limited to assigned work orders

## Future Enhancements
- Mobile app for field service management
- IoT integration for automated work order creation
- AI-powered scheduling optimization
- Predictive maintenance algorithms
- Customer self-service work order portal
