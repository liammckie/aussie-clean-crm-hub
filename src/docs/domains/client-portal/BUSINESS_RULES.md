
# Client Portal Business Rules

## User Management

### Registration and Access
- New portal users can only be created by:
  - Internal administrators
  - Existing client users with FullAccess role
- User email addresses must be unique within the system
- Initial password setup requires email verification
- Three failed login attempts trigger a temporary account lock (15 minutes)
- Passwords must meet minimum security requirements:
  - At least 8 characters
  - Contains uppercase, lowercase, number, and special character

### Role Permissions
- **FullAccess**: Complete access to all client data across all sites
- **SiteManager**: 
  - Limited to viewing data for assigned sites only
  - Cannot access financial information
  - Cannot manage other users
- **FinanceOnly**: 
  - Can only access invoices and financial documents
  - Cannot view operational data like QA reports or service requests

### Session Management
- User sessions automatically expire after 8 hours of inactivity
- Only one active session allowed per user (logging in elsewhere terminates existing session)
- All session activities are logged for audit purposes
- IP address changes within a session trigger security verification

## Service Request Management

### Creation Rules
- Service requests require:
  - Site selection
  - Category
  - Description
  - Priority level
- Attachments are optional but limited to 10MB total size
- Critical priority requests trigger immediate notifications to operations team
- Duplicate detection prevents multiple identical requests within 24 hours

### Status Transitions
- New requests start with "Open" status
- Status can only progress forward: Open → InProgress → Closed
- Only internal staff can change status to "InProgress"
- Both internal staff and client users can close requests
- Closed requests cannot be reopened after 7 days
- All status changes require a comment

### Notification Rules
- Email notifications sent on:
  - Request creation (to operations team)
  - Status changes (to requester)
  - New comments (to all involved parties)
- In-app notifications appear for all request updates
- Unresolved high-priority requests escalate after 24 hours
- Automatic follow-up prompts for client feedback on closed requests

## Document Access

### Visibility Rules
- Documents are classified by visibility level:
  - Client-wide (visible to all client users)
  - Site-specific (visible only to users with access to that site)
  - Role-specific (visible only to users with specific roles)
- Expired documents remain visible but are clearly marked as expired
- Document access history is logged for compliance purposes

### Download Rules
- All document downloads are logged with user, timestamp, and IP address
- Batch downloads limited to 20 documents at once
- Sensitive documents may require acceptance of terms before download
- Downloaded documents contain watermarks with user information

## Quality Audit Reports

### Approval Workflow
- New QA reports require client review within 7 days
- Client can:
  - Approve the report
  - Dispute specific items (requires comments)
  - Request clarification (pauses the approval timeline)
- Approval automatically occurs if no action taken within 7 days
- Disputed items create follow-up tasks for QA team
- Final approved reports cannot be modified

### Performance Metrics
- QA scores are calculated based on weighted criteria
- Passing threshold is 85% or higher
- Trend analysis compares current scores to 3-month average
- Three consecutive failing scores trigger account management review
- Site-specific performance metrics are only visible to users with access to that site

## Invoice and Financial Management

### Viewing Rules
- Invoices are only visible to FullAccess and FinanceOnly roles
- Historical invoices remain accessible for 7 years
- Payment history includes all transactions and outstanding balances
- Aging reports categorize outstanding amounts by time periods

### Payment Handling
- Online payments are processed via secure gateway integration
- Partial payments are allowed with minimum thresholds
- Payment confirmations are provided immediately and via email
- Failed payments trigger system notifications and retry options

## Activity Logging

### Logged Events
The system logs the following client portal events:
- User logins and logouts
- Password changes and resets
- Document views and downloads
- Service request submissions and updates
- QA report approvals or disputes
- Invoice views and payments
- User management actions

### Retention Policy
- Activity logs are retained for 3 years
- Logs include user ID, timestamp, action, and relevant entity IDs
- IP address and device information is captured for security purposes
- Activity reports are available to internal administrators only

## System Notifications

### Delivery Rules
- Critical notifications appear as pop-ups requiring acknowledgment
- Standard notifications appear in notification center
- Email notifications follow user preferences
- Notification frequency is limited to prevent overwhelming users

### Expiration Rules
- Contract expiry notifications begin 60 days prior to expiration
- Document expiry notifications begin 30 days prior to expiration
- QA failure notifications expire after 14 days if addressed
- Service request update notifications expire after 7 days if read
