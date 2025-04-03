
# Supplier Data Model

## Core Entities

### Supplier
The primary entity representing an external service provider or contractor.

#### Basic Information
- **Supplier ID**: Unique identifier (UUID, Primary Key)
- **Supplier Name**: Business name (string, required, unique)
- **Individual Name**: Owner or primary contact (string, optional)
- **Phone**: Contact phone number
- **Email**: Primary contact email
- **Status**: Current supplier state (enum: active, inactive, pending, blacklisted)
- **ABN**: Australian Business Number (string, 11-digit with validation)
- **ACN**: Australian Company Number (string, optional)
- **Registered for GST**: Boolean flag for GST registration
- **Subcontractor Flag**: Indicates subcontractor relationship (boolean, default true)

#### Location Details
- **State**: Primary state of operation
- **Suburb**: Suburb name
- **Postcode**: Postal code
- **Mailing Address**: Postal address (if different)
- **Mailing State**: State for postal communications
- **Mailing Postcode**: Postal code for mailing

#### Business Details
- **Annual Value**: Estimated annual contract value (decimal)
- **Weekly Value**: Estimated weekly contract value (decimal)
- **Date of Master Agreement**: When master services agreement was signed
- **Link to Business Profile**: URL to external profile or website
- **Notes**: General supplier notes and comments

#### Compliance Information
- **LHL Applied**: Whether Labour Hire License is applied (boolean)
- **Onboarded to LinkSafe**: Safety compliance system status (boolean)
- **RCTI Accepted**: Recipient Created Tax Invoice acceptance (boolean)

#### Banking Information
- **Account Name**: Bank account name
- **BSB**: Bank State Branch code
- **Account Number**: Bank account number
- **Bank Name**: Financial institution name
- **Account Email**: Email for payment notifications

#### Documentation Links
- **Link to Agreement**: URL to master services agreement
- **Photo ACN**: Documentation of ACN verification
- **Photo ID Docs**: Identity documentation
- **Photo Public Liability**: Insurance certificate
- **Photo Work Cover**: Workers compensation insurance

#### Administrative Information
- **Created At**: Timestamp of creation
- **Updated At**: Timestamp of last modification

### Compliance Documents
Documents that verify supplier compliance with legal and contractual requirements.

- **Document ID**: Unique identifier (UUID, Primary Key)
- **Supplier ID**: Foreign key to suppliers table
- **Type**: Document category (enum: identity, public_liability, workcover, lhl)
- **Document Number**: Certificate or license number
- **Expiry Date**: Date when document expires
- **Amount Covered**: Insurance coverage amount (decimal)
- **Issuer Name**: Organization that issued the document
- **Verified By**: Employee who verified document
- **Verified At**: Timestamp of verification
- **File URL**: Link to stored document
- **Status**: Document validation status (enum: valid, expired, pending)

### Relationships

#### Contract Assignments
Many-to-many relationship between suppliers and contracts:
- **Contract ID**: Foreign key to contracts table
- **Supplier ID**: Foreign key to suppliers table
- **Assignment Type**: Role of supplier (enum: primary, secondary, periodical)
- **Start Date**: Assignment commencement date
- **End Date**: Assignment termination date
- **Rate**: Contract-specific rate
- **Hours Per Week**: Contracted hours
- **Active**: Whether assignment is currently active

#### Site Assignments
Many-to-many relationship between suppliers and sites:
- **Site ID**: Foreign key to sites table
- **Supplier ID**: Foreign key to suppliers table
- **Assignment Type**: Role at site (enum: primary, secondary, periodical)
- **Start Date**: When assignment begins
- **End Date**: When assignment terminates
- **Notes**: Assignment-specific notes

#### Work Order Fulfillment
Relationship between suppliers and work orders they fulfill:
- **Work Order ID**: Foreign key to work orders table
- **Supplier ID**: Foreign key to supplier assigned to fulfill work
- **Status**: Completion status
- **Actual Cost**: Final cost of work performed
- **Completion Documents**: Array of documentation links
- **Feedback**: Quality assessment information
