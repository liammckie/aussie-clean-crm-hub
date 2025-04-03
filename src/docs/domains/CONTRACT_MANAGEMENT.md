
# Contract Management

## Overview
The Contract Management module is the central component of the Aussie Clean ERP system that governs all service agreements between the company and its clients. It manages the entire contract lifecycle from creation and activation through renewals, modifications, and eventual termination or expiry. The module integrates with quoting, billing, operations, and reporting to ensure seamless service delivery and financial management.

## Data Model

### Core Entities

#### Contract
The primary entity representing a formal agreement between Aussie Clean and a client.

##### Basic Information
- **Contract ID**: Unique identifier (UUID, Primary Key)
- **Contract Code**: Unique reference code (string)
- **Client ID**: Foreign key reference to clients table
- **Status**: Current contract state (enum: draft, active, pending_approval, expired, terminated, cancelled)
- **Contract Type**: Agreement structure (enum: fixed, flexible, month-to-month, trial)
- **Service Type**: Primary service category (enum: cleaning, waste, hygiene, pest_control, etc.)
- **Start Date**: Contract commencement date
- **End Date**: Contract termination date
- **Review Date**: Optional date for contract review
- **Auto Renew**: Flag indicating automatic renewal (boolean)
- **Renewal Frequency**: How often contract renews (enum: monthly, annually, quarterly)
- **Linked Quote ID**: Optional foreign key to approved quote

##### Financial Details
- **Billing Frequency**: Invoice generation schedule (enum: monthly, quarterly, per_work_order, adhoc)
- **Rate Type**: Pricing structure (enum: fixed, indexed, tiered, per_work_order)
- **Rate Value**: Base service value (decimal)
- **Payment Terms**: Payment timeframe (enum: net_7, net_14, net_30, custom string)
- **Next Billing Date**: Scheduled date for next invoice generation
- **Not To Exceed Amount**: Maximum billing cap (decimal, optional)
- **Credit Cap**: Maximum credit allowed (decimal, optional)
- **Billing Notes**: Special billing instructions or notes
- **CPI Enabled**: Whether Consumer Price Index adjustments apply (boolean)
- **CPI Rate**: Percentage rate for adjustments (decimal, optional)
- **CPI Last Applied**: Date of last CPI adjustment
- **CPI Next Due**: Scheduled date for next CPI adjustment
- **Accrual Budget Annual**: Total annual accrual budget (decimal)
- **Accrual Allocated Weekly**: Weekly accrual allocation (decimal)

##### Administrative Information
- **Scope of Services**: Detailed service description (rich text or document URL)
- **Created By**: Employee who created the contract
- **Approved By**: Employee who approved the contract
- **Last Modified By**: Employee who last modified the contract
- **Created At**: Timestamp of creation
- **Updated At**: Timestamp of last modification
- **Locked At**: Timestamp when contract was locked/finalized

### Relationships

#### Contract Sites
Links contracts to physical service locations:
- **Contract ID**: Foreign key to contracts table
- **Site ID**: Foreign key to sites table
- **Start Date**: Site service commencement date
- **End Date**: Site service termination date

#### Contract Periodical Inclusions
Additional scheduled services beyond regular contract:
- **Contract ID**: Foreign key to contracts table
- **Service Name**: Description of periodical service
- **Included**: Whether service is included in base contract price
- **Client Charge**: Amount charged to client for service
- **Contractor Payment**: Amount paid to contractor for service
- **Last Completed On**: Date service was last performed
- **Frequency**: How often service is performed (e.g., Bi-annually)
- **Total SQM**: Area covered by periodical service
- **Comments**: Service-specific notes

#### Contract Documents
Files and documentation associated with the contract:
- **Contract ID**: Foreign key to contracts table
- **Document Type**: Category of document (original, signed_pdf, insurance_attachment, scope_doc, etc.)
- **File URL**: Link to stored document
- **Uploaded By**: Employee who uploaded the document
- **Uploaded At**: Timestamp of document upload

#### Contract Version History
Historical record of contract changes:
- **Version ID**: Unique identifier (UUID)
- **Contract ID**: Foreign key to contracts table
- **Version Number**: Incremental counter
- **Change Summary**: Description of changes
- **Change Type**: Category of change (enum: renewal, amendment, pricing_change, cpi_adjustment, termination)
- **Changed By**: Employee who made the change
- **Changed At**: Timestamp of change
- **Snapshot JSON**: Complete contract state at version point

## Business Rules

### Lifecycle Workflow
1. **Creation Phase**:
   - Contracts start in "draft" status
   - Can be created from approved quote or from scratch
   - Draft contracts can be freely modified

2. **Approval Process**:
   - Contracts require internal validation of scope, billing, sites, documents
   - Submission changes status to "pending_approval"
   - Approval workflow based on contract value and terms

3. **Activation Requirements**:
   - Final signature (can be linked via SignNow/Zapier)
   - Complete scope of services
   - Valid billing configuration
   - Required documents attached
   - Activation changes status to "active"

4. **Maintenance and Modifications**:
   - Amendments tracked via versioning system
   - CPI adjustments applied automatically if enabled
   - Each change creates new version history record
   - Substantive changes may require re-approval

5. **Renewal and Termination**:
   - Contracts with auto_renew flag are flagged for review before expiry
   - Manual renewal creates new version with updated dates
   - Early termination requires notes and approval
   - Status changes to "expired" after end date if not renewed
   - "Cancelled" status applies to contracts abandoned before activation

### Validation Rules
1. **Date Validation**:
   - End date must be after start date
   - Review date must be before end date
   - Next billing date must be valid based on frequency

2. **Financial Requirements**:
   - Rate value required for all except per_work_order contracts
   - If CPI enabled, rate and next application date are required
   - Billing frequency must be specified

3. **Document Requirements**:
   - Scope of services must be provided as text or document
   - Status changes to "active" require signed contract document

### CPI Escalation Logic
1. **Automatic Flagging**:
   - CPI-enabled contracts flagged for review before anniversary
   - CPI rate defined at contract level or global config fallback

2. **Recalculation Process**:
   - System triggers recalculation of rate value
   - New annual and weekly values calculated
   - Version created with type "cpi_adjustment"
   - CPI event recorded in Activities Feed

3. **Application Rules**:
   - CPI can be skipped with appropriate approval
   - Custom CPI rates can override default
   - CPI application updates last_applied and next_due dates

## Integration Points

### External Systems
- **SignNow/DocuSign**: Digital signature collection and tracking
- **Zapier**: Workflow automation for contract management
- **Xero**: Invoice generation based on contract billing rules
- **CRM**: Quote to contract conversion and client data synchronization

### Internal Modules
- **Quote Management**: Conversion of approved quotes to contracts
- **Site Management**: Sites where services are delivered
- **Scheduling**: Service delivery planning based on contract terms
- **Billing**: Invoice generation according to contract terms
- **Reporting**: Financial and operational analysis
- **Supplier Management**: Provider assignment and performance tracking

## User Interface Components

### Primary Views
1. **Contract List View**:
   - Searchable/filterable grid of all contracts
   - Status indicators with visual badges (Draft, Active, Pending, Expiring, Cancelled)
   - Quick actions for common operations
   - Columns: Client, Type, Service, Start/End, CPI Due, Auto Renew

2. **Contract Detail View**:
   - Overview panel: client, term, signed status
   - Tabbed interface:
     - Details: scope, site links, billing model, accruals
     - Periodicals: inclusion logic + rates
     - Billing: config, rate, CPI, next invoice
     - History: full version diff view
     - Docs: attached files
     - Logs: Activities Feed entries

3. **New Contract Wizard**:
   - Step 1: Client & Site selection
   - Step 2: Scope & Periodicals
   - Step 3: Billing configuration + Accruals
   - Step 4: Signed document upload or SignNow initiation
   - Step 5: Confirmation + Activate

### Key Workflows
1. **Contract Creation Process**:
   - Creation from quote or scratch
   - Internal approval workflow
   - Client signature collection
   - Activation and implementation

2. **Amendment Handling**:
   - Contract modification interface
   - Version documentation
   - Approval routing based on change type
   - Implementation of changes

3. **Renewal Process**:
   - Advance notification of upcoming renewals
   - Review of terms and performance
   - Price adjustment application
   - Extension documentation

## Permission Model

| Role | Create | View | Edit | Approve | Terminate | Cancel |
|------|--------|------|------|---------|-----------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sales | ✅ | ✅ | ✅ (draft only) | ❌ | ❌ | ❌ |
| Operations | ❌ | ✅ | ✅ (scope, sites) | ✅ (renewals) | ❌ | ❌ |
| Finance | ❌ | ✅ | ✅ (billing only) | ✅ (pricing) | ✅ | ✅ |

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

## Activities Feed Logging
The system logs the following contract-related events:
- Draft created/edited
- Scope updated
- CPI applied
- Rate changed
- Version saved (renewal or amendment)
- Terminated/cancelled (with reason)
- Signed deal form triggered (Zapier or UI)
- Accrual updated
- Periodicals updated

## Error Handling & Validations
- Prevention of activation without required elements:
  - Billing type
  - Signed contract
  - Valid start/end dates
- Blocking of duplicate contract codes
- Confirmation modals for critical actions (cancel, renewal)
- Informative error messages via UI hooks
- Access denied errors for permission violations

## Future Enhancements
- Bulk renewals + global CPI re-index tool
- SLA threshold linkage for QA compliance monitoring
- Contract health scoring dashboard (profitability + status + audit compliance)
- Multi-year cap + accrual waterfall tracking
- Auto-categorisation of contracts by risk/volume/complexity
