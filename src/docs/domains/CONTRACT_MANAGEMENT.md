
# Contract Management

## Overview
The Contract Management module is the central component of the Aussie Clean ERP system that governs all service agreements between the company and its clients. It manages the entire contract lifecycle from creation and activation through renewals, modifications, and eventual termination or expiry.

## Data Model

### Core Entities

#### Contract
The primary entity representing a formal agreement between Aussie Clean and a client.

##### Basic Information
- **Contract ID**: Unique identifier (UUID, Primary Key)
- **Client ID**: Foreign key reference to clients table
- **Contract Code**: Unique reference code (string)
- **Status**: Current contract state (enum: draft, active, on_hold, expired, terminated, cancelled)
- **Contract Type**: Agreement structure (enum: fixed, flexible, month-to-month, trial)
- **Service Type**: Primary service category (enum: cleaning, waste, hygiene, pest_control, etc.)
- **Start Date**: Contract commencement date
- **End Date**: Contract termination date
- **Review Date**: Optional date for contract review
- **Auto Renew**: Flag indicating automatic renewal (boolean)
- **Renewal Frequency**: How often contract renews (enum: monthly, annually, etc.)

##### Financial Details
- **Contract Value Weekly**: Base weekly service value (decimal)
- **Billing Frequency**: Invoice generation schedule (enum: weekly, monthly, quarterly)
- **Payment Terms**: Payment timeframe (enum: net_7, net_14, net_30, custom string)
- **CPI Enabled**: Whether Consumer Price Index adjustments apply (boolean)
- **CPI Rate**: Percentage rate for adjustments (decimal, optional)
- **CPI Last Applied**: Date of last CPI adjustment
- **CPI Next Due**: Scheduled date for next CPI adjustment
- **Accrual Budget Annual**: Total annual accrual budget (decimal)
- **Accrual Allocated Weekly**: Weekly accrual allocation (decimal)

##### Administrative Information
- **Originating Salesperson ID**: Foreign key to employee who originated the contract
- **Scope of Work**: Detailed service description (rich text or document link)
- **Contract Notes**: General notes and comments
- **Last Modified At**: Timestamp of last modification
- **Signed Document ID**: Reference to signed contract document
- **Sign Date**: Date contract was signed

### Relationships

#### Supplier Assignments
Many-to-many relationship between contracts and suppliers:
- **Supplier ID**: Foreign key to suppliers table
- **Assignment Type**: Role of supplier (enum: primary, secondary, periodical)
- **Start Date**: Assignment commencement date
- **End Date**: Assignment termination date
- **Rate**: Agreed payment rate for supplier
- **Contracted Hours Per Week**: Expected work duration
- **Active**: Whether assignment is currently active
- **Notes**: Assignment-specific notes

#### Employee Assignments
Many-to-many relationship between contracts and internal employees:
- **Employee ID**: Foreign key to employees table
- **Work Type**: Nature of work (e.g., regular, periodical)
- **Hours Per Week**: Expected work duration
- **Assignment Start**: Start date for employee assignment
- **Assignment End**: End date for employee assignment

#### Periodical Services
Additional scheduled services beyond regular contract:
- **Service Name**: Description of periodical service
- **Included**: Whether service is included in base contract price
- **Charge Amount**: Additional charge if billed separately
- **Comments**: Service-specific notes

#### Related Entities
- **Contract Sites**: Links contract to physical service locations
- **Work Orders**: Service delivery instructions generated from contract
- **Invoices**: Billing records generated based on contract terms
- **Contract Versions**: Historical record of contract changes
- **Contract Periodicals**: Scheduled recurring services

## Business Rules

### Validation Rules
1. **Date Validation**:
   - End date must be after start date
   - Assignment periods must be valid date ranges

2. **Financial Requirements**:
   - Contract value weekly required for all except trial contracts
   - If CPI enabled, rate and next application date are required

3. **Document Requirements**:
   - Scope of work must be provided as text or document
   - Status changes to "active" require signed contract document

4. **Assignment Logic**:
   - Supplier and employee assignments must not overlap without explicit override
   - Primary supplier must be assigned for active contracts

### Status Transition Rules
1. **Creation to Activation**:
   - Contracts start in "draft" status
   - Transition to "active" requires signed document and approval
   - Activation triggers finance synchronization and work order generation

2. **Maintenance States**:
   - Active contracts can be placed "on_hold" (temporary suspension)
   - Contracts automatically transition to "expired" after end date
   - "Terminated" applies when ended before scheduled end date
   - "Cancelled" applies when voided before activation

3. **Modification Controls**:
   - Active contract changes require approval workflow
   - Changes to value, terms, or scope trigger version tracking
   - CPI adjustments follow automated schedule when enabled

## Versioning System

### Version Tracking
Contract versioning is triggered by changes to:
- Contract value
- Term length or dates
- Scope of work
- Periodical service inclusions

### Version Records
Each version contains:
- Change timestamp
- Modified fields
- Previous values
- New values
- Reason for change
- User who made change

## Integration Points

### External Systems
- **Accounting System**: Synchronizes contract values and billing schedules
- **Document Management**: Stores and retrieves contract documents
- **CRM**: Updates client relationship data based on contract status

### Internal Modules
- **Site Management**: Sites where services are delivered
- **Scheduling**: Service delivery planning based on contract terms
- **Billing**: Invoice generation according to contract terms
- **Reporting**: Financial and operational analysis
- **Supplier Management**: Provider assignment and performance tracking

## Permission Model

| Role | Create | View | Edit | Approve | Terminate | Cancel |
|------|--------|------|------|---------|-----------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sales | ✅ | ✅ | ✅ (draft only) | ❌ | ❌ | ❌ |
| Operations | ❌ | ✅ | ✅ (scope, value, assignments) | ✅ (renewals) | ❌ | ❌ |
| Finance | ❌ | ✅ | ✅ (billing only) | ✅ (pricing) | ✅ | ✅ |

## User Interface Components

### Primary Views
1. **Contract List**:
   - Filterable, sortable list of all contracts
   - Status indicators and quick actions
   - Grouping by client, status, or type

2. **Contract Detail**:
   - Tabbed interface for different aspects of contract
   - Timeline showing contract history and versions
   - Actions appropriate to contract status and user role

3. **Creation Workflow**:
   - Multi-step form with validation
   - Template selection
   - Client and site selection
   - Financial terms definition
   - Scheduling and resource allocation

### Key Workflows
1. **Contract Creation**:
   - Draft creation by sales team
   - Internal approval process
   - Client signature collection
   - Activation and implementation

2. **Renewal Process**:
   - Advance notification of upcoming renewals
   - Review of terms and performance
   - Price adjustment application
   - Extension documentation

3. **Modification Handling**:
   - Change request submission
   - Impact analysis
   - Approval routing
   - Version documentation
   - Implementation of changes

## Reports and Analytics

### Standard Reports
- **Contract Status Summary**: Overview of all contracts by status
- **Renewal Forecast**: Upcoming contract renewals by period
- **Value Analysis**: Contract value distribution by client, site, or service type
- **Change History**: Tracking of modifications and price adjustments

### Financial Analysis
- **Contract Profitability**: Margin analysis by contract
- **CPI Impact Projection**: Future value forecasting based on CPI schedules
- **Accrual Utilization**: Tracking of allocated vs. used accrual budget

## Implementation Considerations

### Performance Optimization
- Efficient querying of contract data with appropriate indexing
- Caching of frequently accessed contract details
- Background processing for version history and analytics

### Extensibility
- Plugin architecture for additional contract types
- Customizable workflow triggers and actions
- Configurable approval paths based on organizational structure

## Future Enhancements
- Contract profitability scoring (actual vs. forecast)
- CPI override logic for client exemptions
- Bulk renewal interface for multi-site contracts
- Dynamic term templates by service category
- Contract compliance checklist automation
- Budget module integration for spend tracking
- Automated supplier management rules
