
# Employment Hero Integration

## Overview
The Aussie Clean ERP system integrates with Employment Hero (EH) to streamline HR processes, reduce duplicate data entry, and ensure consistency across HR functions. This integration uses OAuth 2.0 for secure authentication and RESTful API endpoints for data synchronization.

## OAuth 2.0 Authentication

### Application Registration
- Register application with Employment Hero Developer Portal
- Store `client_id`, `client_secret`, and `redirect_uri` securely
- Configure appropriate scopes for API access

### Authentication Flow
1. Redirect user to `/oauth2/authorize` endpoint with required parameters
2. User authenticates with Employment Hero
3. EH redirects back with authorization code
4. Exchange code for access and refresh tokens via `/oauth2/token` endpoint
5. Store tokens securely in database
6. Implement token refresh mechanism (tokens expire after 15 minutes)

### Security Considerations
- Access tokens are stored encrypted
- Refresh tokens are used to obtain new access tokens
- All API requests use HTTPS
- Implement proper error handling for authentication failures

## API Synchronization Coverage

### Employee Data
- Endpoint: `/v1/organisations/:org_id/employees`
- Sync Direction: Bidirectional
- Sync Frequency: Daily or on-demand
- Key Fields: personal details, job information, status

### Pay Details
- Endpoint: `/employees/:id/pay_details`
- Sync Direction: EH to Aussie Clean
- Sync Frequency: On employee view or weekly
- Key Fields: pay rates, classification, effective dates

### Leave Requests
- Endpoint: `/leave_requests`
- Sync Direction: Bidirectional
- Sync Frequency: Real-time or hourly
- Key Fields: leave dates, type, status, approvals

### Timesheets
- Endpoint: `/timesheet_entries`
- Sync Direction: Bidirectional
- Sync Frequency: Daily or on-demand
- Key Fields: date, hours, site, approval status

### Payslips
- Endpoint: `/payslips`
- Sync Direction: EH to Aussie Clean
- Sync Frequency: After each pay run
- Key Fields: pay period, issue date, summary data

### Certifications
- Endpoint: `/certifications`
- Sync Direction: Bidirectional
- Sync Frequency: Daily or on validation
- Key Fields: type, expiry, verification status

### Policies
- Endpoint: `/policies`
- Sync Direction: EH to Aussie Clean
- Sync Frequency: Weekly
- Key Fields: policy content, acceptance status

### Banking & Super
- Endpoints: `/bank_accounts`, `/superannuation_detail`
- Sync Direction: EH to Aussie Clean
- Sync Frequency: On profile update
- Key Fields: account details, super fund information

### Custom Fields
- Endpoint: Custom fields API
- Sync Direction: Bidirectional
- Sync Frequency: On profile update
- Key Fields: Varies based on configuration

## Sync Error Handling

### Resilience Strategy
- Implement retry mechanism for failed API calls
- Log detailed error information for troubleshooting
- Fall back to manual entry if API is unavailable
- Flag records with sync issues for review

### Conflict Resolution
- Use timestamp-based conflict resolution
- Prioritize source system based on field ownership
- Maintain audit trail of sync conflicts
- Provide manual resolution interface for complex conflicts

## Data Mapping

### External ID Mapping
- All EH records are linked via `external_id`
- Maintain mapping table for EH IDs to internal entity IDs
- Handle scenario where an employee exists in one system but not the other

### Field Transformations
- Format conversions between systems (dates, enums)
- Default value handling for required fields
- Data validation before synchronization

## Sync Process

### Scheduled Synchronization
- Full sync: Daily during off-peak hours
- Incremental sync: Hourly for critical data
- On-demand sync: Triggered by user action or significant event
- Selective sync: Target specific data types

### Change Detection
- Use `updated_at` timestamps to identify changed records
- Implement checksum comparison for complex objects
- Track sync history to avoid redundant processing

## UI Components

### Sync Status Dashboard
- Overall sync health indicator
- Last successful sync timestamp
- Failed sync attempts with error details
- Manual sync trigger options

### Employee EH Link Status
- Indicator of EH link status on employee records
- Easy access to resolve linking issues
- View of external_id and sync status

## Future Enhancements

### Expanded API Coverage
- Leverage additional Employment Hero APIs as they become available
- Deeper integration with Learning Management System
- Enhanced payroll and time tracking integration

### Advanced Sync Features
- Real-time webhooks for immediate updates
- Bulk update optimization
- Customizable field mapping interface
- Historical data reconciliation tools
