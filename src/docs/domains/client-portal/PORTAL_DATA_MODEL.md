
# Client Portal Data Model

## Core Entities

### ClientPortalUser
Represents a user with access to the client portal.

#### Attributes
- **user_id**: UUID (Primary Key)
- **client_id**: UUID (Foreign Key to Client)
- **first_name**: String
- **last_name**: String  
- **email**: String (unique, used for login)
- **phone**: String (optional)
- **role**: Enum (FullAccess, SiteManager, FinanceOnly)
- **status**: Enum (Active, Inactive, Pending)
- **last_login**: Timestamp
- **created_at**: Timestamp
- **updated_at**: Timestamp
- **password_reset_token**: String (nullable)
- **password_reset_expires**: Timestamp (nullable)

#### For SiteManager Role
- **managed_site_ids**: Array of UUIDs (Foreign Keys to Sites)

### ClientPortalSession
Tracks user sessions within the portal.

#### Attributes
- **session_id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key to ClientPortalUser)
- **started_at**: Timestamp
- **expired_at**: Timestamp (nullable)
- **ip_address**: String
- **user_agent**: String
- **device_type**: Enum (Desktop, Mobile, Tablet)

### ClientPortalServiceRequest
Service requests submitted through the portal.

#### Attributes
- **request_id**: UUID (Primary Key)
- **client_id**: UUID (Foreign Key to Client)
- **site_id**: UUID (Foreign Key to Site)
- **submitted_by**: UUID (Foreign Key to ClientPortalUser)
- **category**: Enum (AdditionalClean, Complaint, Hazard, Other)
- **priority**: Enum (Low, Medium, High, Critical)
- **description**: Text
- **status**: Enum (Open, InProgress, Closed)
- **created_at**: Timestamp
- **updated_at**: Timestamp
- **closed_at**: Timestamp (nullable)
- **assigned_to**: UUID (Foreign Key to Employee, nullable)
- **internal_notes**: Text (visible only to internal staff)
- **resolution_notes**: Text (visible to client)

### ClientPortalNotification
Notifications displayed to users in the portal.

#### Attributes
- **notification_id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key to ClientPortalUser, nullable if client-wide)
- **client_id**: UUID (Foreign Key to Client)
- **type**: Enum (ContractExpiry, DocumentExpiry, QAAlert, ServiceRequestUpdate, InvoiceDue)
- **title**: String
- **message**: Text
- **link_url**: String (optional, relative URL in portal)
- **is_read**: Boolean
- **created_at**: Timestamp
- **expires_at**: Timestamp (optional)

### ClientPortalActivity
Tracks all user activities within the portal for audit purposes.

#### Attributes
- **activity_id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key to ClientPortalUser)
- **timestamp**: Timestamp
- **action**: Enum (Login, Logout, ViewContract, DownloadDocument, SubmitRequest, UpdateRequest, ViewQA, ApproveQA, DisputeQA, ViewInvoice, PayInvoice)
- **entity_type**: String (e.g., "contract", "document", "qa_report")
- **entity_id**: UUID (Foreign Key to the relevant entity)
- **details**: JSONB (additional contextual information)
- **ip_address**: String

## Relationships

### ClientPortalUser to Client
- Many-to-one relationship
- Each ClientPortalUser belongs to exactly one Client
- A Client can have multiple ClientPortalUsers

### ClientPortalUser to Sites (for SiteManagers)
- Many-to-many relationship
- SiteManager users can be assigned to multiple sites
- Each site can have multiple SiteManager users

### ClientPortalServiceRequest to Site
- Many-to-one relationship
- Each service request is associated with exactly one site
- A site can have multiple service requests

### ClientPortalUser to ClientPortalActivity
- One-to-many relationship
- Each user can have multiple activity records
- Each activity record belongs to exactly one user

### ClientPortalNotification to ClientPortalUser
- Many-to-one relationship (for user-specific notifications)
- Each notification can target a specific user or be client-wide (null user_id)

## External Entity References

The Client Portal data model references these external entities:

- **Client**: Core client information
- **Site**: Physical locations where services are delivered
- **Contract**: Service agreements
- **Document**: Files and metadata
- **QAReport**: Quality audit reports
- **Invoice**: Financial transactions
- **Employee**: Internal staff assigned to service requests
- **WorkOrder**: Scheduled and completed work

## Data Validation Rules

- Email addresses must be unique across all ClientPortalUsers
- A user with SiteManager role must have at least one assigned site
- Service request descriptions must not be empty
- Password reset tokens expire after 24 hours
- User sessions expire after 8 hours of inactivity
- Service request attachments must be under 10MB and in approved formats (PDF, JPEG, PNG)
