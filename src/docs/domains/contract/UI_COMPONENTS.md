
# Contract UI Components

## Primary Views

### 1. Contract List View
- Searchable/filterable grid of all contracts
- Status indicators with visual badges (Draft, Active, Pending, Expiring, Cancelled)
- Quick actions for common operations
- Columns: Client, Type, Service, Start/End, CPI Due, Auto Renew

### 2. Contract Detail View
- Overview panel: client, term, signed status
- Tabbed interface:
  - Details: scope, site links, billing model, accruals
  - Periodicals: inclusion logic + rates
  - Billing: config, rate, CPI, next invoice
  - History: full version diff view
  - Docs: attached files
  - Logs: Activities Feed entries

### 3. New Contract Wizard
- Step 1: Client & Site selection
- Step 2: Scope & Periodicals
- Step 3: Billing configuration + Accruals
- Step 4: Signed document upload or SignNow initiation
- Step 5: Confirmation + Activate

## Key Workflows

### 1. Contract Creation Process
- Creation from quote or scratch
- Internal approval workflow
- Client signature collection
- Activation and implementation

### 2. Amendment Handling
- Contract modification interface
- Version documentation
- Approval routing based on change type
- Implementation of changes

### 3. Renewal Process
- Advance notification of upcoming renewals
- Review of terms and performance
- Price adjustment application
- Extension documentation
