
# Client Business Rules

## Status Management

### Status Transitions
- New clients start as "Prospect"
- Prospects can transition to "Active" when a contract is signed
- Active clients can be put "On Hold" (temporary suspension)
- Any status can transition to "Cancelled" (with reason required)

### Status Effects
- "Prospect" clients cannot have active contracts
- "On Hold" clients temporarily pause service delivery
- "Cancelled" clients have all services terminated

## Document Management

### Document Requirements
- Critical documents (contracts, insurance certificates) must have expiry date tracking
- System alerts when documents are approaching expiration
- Document version history is maintained

### Document Validation
- Insurance certificates must be validated for coverage amount
- Legal contracts must be approved by authorized personnel
- ABN/ACN documents must match database records

## Client Onboarding

### Required Information
- Basic client details (Name, ABN, Contact)
- At least one primary contact person
- Valid billing address
- Initial account manager assignment

### Onboarding Process
1. Create prospect record
2. Complete client profile
3. Verify ABN/ACN
4. Assign account manager
5. Set up billing information
6. Transition to "Active" status

## ABN/ACN Validation

### Validation Process
- ABN must be a valid 11-digit number according to ATO algorithm
- ACN must be a valid 9-digit number according to ASIC algorithm
- System verifies format but does not perform external validation
- Option to integrate with ABR lookup API for external validation

### Validation Errors
- Invalid format prevents client creation/update
- Warning shown if ABN/ACN appears to be for different entity than client name
- System logs validation attempts for audit purposes

## Client Communication

### Communication Preferences
- Clients can specify preferred contact methods
- Communication frequency can be configured
- Opt-out options must be provided for marketing communications

### Communication Logging
- All client communications must be logged
- Logs include date, time, method, content, and outcome
- Communication history available in client profile

## Archiving and Deletion

### Archiving Rules
- Clients with no active contracts for 12+ months can be archived
- Archived clients are not visible in standard searches
- Archiving preserves all client data

### Deletion Constraints
- Clients can only be deleted if they have no associated entities
- Deletion requires admin approval
- Soft deletion preferred (status change to "Cancelled")
- Hard deletion only in exceptional circumstances

## Client Relationship Management

### Account Manager Responsibilities
- Regular client check-ins based on relationship tier
- Quarterly relationship reviews
- Issue escalation protocol
- Client satisfaction monitoring

### Client Tiering
- Clients categorized by size, revenue, or strategic importance
- Tier determines service level and review frequency
- Tier changes trigger notification to relevant stakeholders

## Activity Feed Logging
The system logs the following client-related events:
- Client created/edited
- Status changed
- Documents uploaded/expired
- Contact information updated
- Billing information modified
- Account manager changed
