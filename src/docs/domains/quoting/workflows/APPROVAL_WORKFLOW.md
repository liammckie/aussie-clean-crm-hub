
# Quote Approval Workflow

## Overview
The approval workflow ensures quotes meet company standards for accuracy, deliverability, and profitability before client presentation.

## Approval Stages

### 1. Initial Draft
- **Created by:** Estimator or Sales Representative
- **Status:** Draft
- **Actions:** Create, save, edit, calculate
- **Validation:** Basic completeness checks only
- **Notifications:** None at this stage

### 2. Sales Manager Review
- **Required for:** All quotes
- **Status:** Pending Sales Review
- **Focus areas:**
  - Scope completeness
  - Competitive pricing
  - Client relationship factors
  - Sales strategy alignment
- **Approval options:**
  - Approve
  - Return with comments
  - Edit directly
- **Notifications:** Sales manager notified when quote submitted

### 3. Operations Review
- **Required for:** Quotes over $50,000 annual value
- **Status:** Pending Operations Review
- **Focus areas:**
  - Deliverability assessment
  - Resource availability
  - Productivity rate validation
  - Staffing model viability
- **Approval options:**
  - Approve
  - Return with comments
  - Edit directly
- **Notifications:** Operations manager notified when sales approved

### 4. Financial Review
- **Required for:**
  - Quotes over $100,000 annual value
  - Quotes below minimum margin thresholds
  - Quotes with non-standard terms
- **Status:** Pending Financial Review
- **Focus areas:**
  - Margin compliance
  - Payment terms
  - Financial risk assessment
  - Contract term considerations
- **Approval options:**
  - Approve
  - Return with comments
  - Edit directly
- **Notifications:** Financial controller notified when operations approved

### 5. Final Approval
- **Required for:** Quotes over $250,000 annual value
- **Status:** Pending Final Approval
- **Approver:** Managing Director
- **Focus areas:**
  - Strategic alignment
  - Resource commitment
  - Long-term implications
  - Overall risk assessment
- **Approval options:**
  - Approve
  - Return with comments
  - Edit directly
- **Notifications:** Managing director notified when all prior approvals complete

## Approval Paths
Different quote types follow different approval paths:

### Standard Quotes (<$50,000/year)
1. Estimator/Sales Rep → Draft
2. Sales Manager → Approved

### Medium Quotes ($50,000-$100,000/year)
1. Estimator/Sales Rep → Draft
2. Sales Manager → Sales Approved
3. Operations Manager → Approved

### Large Quotes ($100,000-$250,000/year)
1. Estimator/Sales Rep → Draft
2. Sales Manager → Sales Approved
3. Operations Manager → Operations Approved
4. Financial Controller → Approved

### Major Quotes (>$250,000/year)
1. Estimator/Sales Rep → Draft
2. Sales Manager → Sales Approved
3. Operations Manager → Operations Approved
4. Financial Controller → Finance Approved
5. Managing Director → Approved

## Exception Handling

### Below Minimum Margin
- Additional approval required regardless of value
- Business case must be attached
- Time-limited approval (3-6 months)

### Expedited Approval
- Available for urgent client requirements
- Requires senior management pre-authorization
- 24-hour maximum turnaround commitment
- Post-approval review still conducted

## Approval Actions

### Approve
- Updates quote status to next approval stage
- Notifies next approver or quote owner if final
- Logs approval with timestamp and user

### Return for Amendment
- Updates quote status to "Requires Amendment"
- Returns to quote owner with comments
- Logs rejection with timestamp, user and reasons

### Edit Directly
- Approver makes changes during review
- Creates revision with change log
- Original creator notified of changes
