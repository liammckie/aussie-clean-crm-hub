
# Client Data Model

## Core Entities

### Client Entity
The core Client entity contains the following information:

#### Basic Information
- **Client ID**: Unique identifier (UUID, Primary Key)
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

## Relationships

### Client to Sites
- One-to-many relationship
- Client can have multiple service locations
- Each site belongs to exactly one client

### Client to Contacts
- One-to-many relationship
- Client can have multiple contact persons
- Each contact is associated with exactly one client

### Client to Contracts
- One-to-many relationship
- Client can have multiple service agreements
- Each contract is associated with exactly one client

### Client to Documents
- One-to-many relationship
- Client can have multiple documents
- Each document belongs to exactly one client

## Data Validation Rules
- ABN must be a valid 11-digit number according to ATO algorithm
- ACN must be a valid 9-digit number according to ASIC algorithm
- Email addresses must follow standard format validation
- Phone numbers must follow Australian format validation
- Required fields: Business Name, ABN, Primary Contact, Billing Address
