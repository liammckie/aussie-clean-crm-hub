
# Contract Business Rules

## Lifecycle Workflow

### 1. Creation Phase
- Contracts start in "draft" status
- Can be created from approved quote or from scratch
- Draft contracts can be freely modified

### 2. Approval Process
- Contracts require internal validation of scope, billing, sites, documents
- Submission changes status to "pending_approval"
- Approval workflow based on contract value and terms

### 3. Activation Requirements
- Final signature (can be linked via SignNow/Zapier)
- Complete scope of services
- Valid billing configuration
- Required documents attached
- Activation changes status to "active"

### 4. Maintenance and Modifications
- Amendments tracked via versioning system
- CPI adjustments applied automatically if enabled
- Each change creates new version history record
- Substantive changes may require re-approval

### 5. Renewal and Termination
- Contracts with auto_renew flag are flagged for review before expiry
- Manual renewal creates new version with updated dates
- Early termination requires notes and approval
- Status changes to "expired" after end date if not renewed
- "Cancelled" status applies to contracts abandoned before activation

## Validation Rules

### 1. Date Validation
- End date must be after start date
- Review date must be before end date
- Next billing date must be valid based on frequency

### 2. Financial Requirements
- Rate value required for all except per_work_order contracts
- If CPI enabled, rate and next application date are required
- Billing frequency must be specified

### 3. Document Requirements
- Scope of services must be provided as text or document
- Status changes to "active" require signed contract document

## CPI Escalation Logic

### 1. Automatic Flagging
- CPI-enabled contracts flagged for review before anniversary
- CPI rate defined at contract level or global config fallback

### 2. Recalculation Process
- System triggers recalculation of rate value
- New annual and weekly values calculated
- Version created with type "cpi_adjustment"
- CPI event recorded in Activities Feed

### 3. Application Rules
- CPI can be skipped with appropriate approval
- Custom CPI rates can override default
- CPI application updates last_applied and next_due dates

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
