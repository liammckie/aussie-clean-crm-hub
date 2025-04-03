
# Client Management

## Overview
The Client Management module handles all aspects of client information, including basic details, contact information, billing preferences, and relationship history.

## Data Model

### Client Entity
The core Client entity contains the following information:

#### Basic Information
- **Client ID**: Unique identifier (UUID)
- **Business Name**: Legal business name
- **Trading Name**: Name the business operates under (if different)
- **ABN**: Australian Business Number (validated format)
- **ACN**: Australian Company Number (optional, validated format)
- **Industry**: Industry category
- **Status**: Client status (Active, Prospect, On Hold, Cancelled)
- **Onboarding Date**: Date client relationship began
- **Source**: How the client was acquired

#### Contact Information
- **Primary Contact**: Main contact person
  - Name
  - Position
  - Email
  - Phone
  - Mobile
- **Additional Contacts**: List of additional contacts
  - Contact Type (Billing, Operations, Emergency)
  - Name
  - Position
  - Email
  - Phone

#### Address Information
- **Billing Address**:
  - Street
  - Suburb
  - State
  - Postcode
- **Postal Address**: (if different from billing)
  - Street
  - Suburb
  - State
  - Postcode

#### Billing Information
- **Billing Cycle**: Weekly, Fortnightly, Monthly
- **Payment Terms**: Net 7, Net 14, Net 30
- **Payment Method**: Direct Debit, Credit Card, EFT
- **Credit Limit**: Maximum credit amount
- **Tax Status**: GST Registered, Not Registered

#### Documentation
- **Client Documents**: Contracts, agreements, certificates
  - Document Type
  - Upload Date
  - Expiry Date (if applicable)
  - Document File

#### Relationship Data
- **Account Manager**: Assigned account manager
- **Notes History**: Chronological record of client interactions
- **Relationship Rating**: Client relationship quality metric

## Business Rules

### ABN/ACN Validation
- ABN must be a valid 11-digit number according to ATO algorithm
- ACN must be a valid 9-digit number according to ASIC algorithm
- System verifies ABN/ACN format but does not perform external validation

### Status Transitions
- New clients start as "Prospect"
- Prospects can transition to "Active" when a contract is signed
- Active clients can be put "On Hold" (temporary suspension)
- Any status can transition to "Cancelled" (with reason required)

### Document Management
- Critical documents (contracts, insurance certificates) must have expiry date tracking
- System alerts when documents are approaching expiration
- Document version history is maintained

## User Interface Components

### Client List View
- Sortable, filterable list of all clients
- Quick status indicators
- Search functionality

### Client Detail View
- Tabbed interface for different client information categories
- Edit capabilities with permission controls
- Activity timeline

### Client Creation Workflow
- Multi-step form with validation
- ABN/ACN lookup integration
- Duplicate detection

## Integration Points

### External Systems
- Accounting system (Xero) for invoice and payment synchronization
- Email system for communication history
- Document management system for file storage

### Internal Modules
- Site Management: Sites associated with a client
- Contract Management: Contracts associated with a client
- Scheduling: Service schedules for client sites
- Billing: Invoice generation based on client terms

## Reports and Analytics
- Client acquisition metrics
- Client retention analytics
- Revenue by client
- Service frequency by client

## Permission Model
- View Clients: All staff
- Create Clients: Sales team, Managers
- Edit Client Basic Info: Account Managers, Admin
- Edit Billing Info: Finance team, Admin
- Delete Clients: Admin only

