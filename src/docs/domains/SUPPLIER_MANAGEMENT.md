
# Supplier Management

## Overview
The Supplier Management module is a core component of the Aussie Clean ERP system responsible for managing all external service providers, subcontractors, and vendors who deliver cleaning and related services on behalf of the company. This module handles supplier onboarding, compliance documentation, payment details, assignment management, and performance tracking.

## Data Model

### Core Entities

#### Supplier
The primary entity representing an external service provider or contractor.

##### Basic Information
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

##### Location Details
- **State**: Primary state of operation
- **Suburb**: Suburb name
- **Postcode**: Postal code
- **Mailing Address**: Postal address (if different)
- **Mailing State**: State for postal communications
- **Mailing Postcode**: Postal code for mailing

##### Business Details
- **Annual Value**: Estimated annual contract value (decimal)
- **Weekly Value**: Estimated weekly contract value (decimal)
- **Date of Master Agreement**: When master services agreement was signed
- **Link to Business Profile**: URL to external profile or website
- **Notes**: General supplier notes and comments

##### Compliance Information
- **LHL Applied**: Whether Labour Hire License is applied (boolean)
- **Onboarded to LinkSafe**: Safety compliance system status (boolean)
- **RCTI Accepted**: Recipient Created Tax Invoice acceptance (boolean)

##### Banking Information
- **Account Name**: Bank account name
- **BSB**: Bank State Branch code
- **Account Number**: Bank account number
- **Bank Name**: Financial institution name
- **Account Email**: Email for payment notifications

##### Documentation Links
- **Link to Agreement**: URL to master services agreement
- **Photo ACN**: Documentation of ACN verification
- **Photo ID Docs**: Identity documentation
- **Photo Public Liability**: Insurance certificate
- **Photo Work Cover**: Workers compensation insurance

##### Administrative Information
- **Created At**: Timestamp of creation
- **Updated At**: Timestamp of last modification

#### Compliance Documents
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

## Business Rules

### Validation Rules
1. **ABN Validation**:
   - ABN must be valid 11-digit number with correct checksum
   - System validates ABN format and checksum algorithm

2. **ACN Validation**:
   - ACN must be 9 digits if provided
   - System validates ACN format

3. **Document Requirements**:
   - Photo URLs must link to verified files in document management system
   - Supplier cannot be assigned to work without valid insurance, ID, and workers compensation documentation
   - Document expiration dates must be in the future for active suppliers

4. **Payment Information**:
   - Complete banking details (account_email, bsb, account_number) required for payment processing
   - RCTI acceptance must be confirmed for auto-invoice generation

### Compliance Logic
1. **Document Expiry Handling**:
   - Labour Hire License (LHL) expiry automatically blocks work order assignment (VIC-specific compliance rule)
   - Supplier automatically flagged as non_compliant if any required document is expired
   - Workcover and public liability insurance required unless specifically exempted by policy
   - System generates alerts 30 days before document expiry

2. **Onboarding Requirements**:
   - If onboarded_to_linksafe = false, system prevents assignment to high-risk sites
   - Master services agreement upload required before activating supplier
   - All required documentation must be verified before supplier status can be set to "active"

3. **Status Management**:
   - "Blacklisted" status prevents all new assignments and automatically notifies management
   - Status changes to "inactive" if compliance documents expire without renewal
   - Reactivation requires management approval and documentation review

## Integration Points

### External Systems
- **LinkSafe**: Safety compliance management system
- **ABN Lookup**: Validation of ABN details against Australian Business Register
- **Document Storage System**: Management of compliance documentation
- **Payment Gateway**: Secure handling of payment information
- **SMS/Email Gateway**: Notification of compliance status and expiry alerts

### Internal Modules
- **Contract Management**: Supplier assignment to service agreements
- **Site Management**: Supplier assignment to service locations
- **Work Order Management**: Task assignment and fulfillment
- **Payment Processing**: Supplier payment generation
- **Scheduling**: Resource allocation based on supplier availability
- **Quality Management**: Supplier performance tracking

## Permission Model

| Role | View | Edit | Assign | Approve Payment | Deactivate | Delete |
|------|------|------|--------|----------------|------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Operations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Finance | ✅ | ✅ (bank/compliance only) | ❌ | ✅ | ❌ | ❌ |
| HR | ✅ | ✅ (compliance only) | ❌ | ❌ | ❌ | ❌ |

## User Interface Components

### Primary Views
1. **Supplier List**:
   - Filterable table showing all suppliers
   - Quick filtering by compliance status, service type, document expiry
   - Color-coded status indicators for compliance issues
   - Sortable columns for key supplier attributes

2. **Supplier Detail**:
   - Tabbed interface for different aspects of supplier information:
     - Profile: Basic information and contact details
     - Documents: Compliance documentation with expiry tracking
     - Assignments: Current contract and site assignments
     - Payment: Banking information and payment history
     - Notes: Communication and issue tracking

3. **Compliance Dashboard**:
   - Visual overview of supplier compliance status
   - Document expiry monitor with countdown indicators
   - Notification center for pending renewals
   - Bulk action capabilities for document processing

4. **Assignment Management**:
   - Work assignment console for matching suppliers to jobs
   - Availability and compliance-based filtering
   - Geographic mapping for efficient resource allocation
   - Conflict detection for overlapping assignments

### Key Workflows
1. **Supplier Onboarding**:
   - Multi-step wizard for supplier registration
   - Document upload and verification process
   - Compliance checklist verification
   - Banking information collection
   - Master agreement signing process

2. **Compliance Management**:
   - Document renewal notification system
   - Verification workflow for uploaded documents
   - Escalation path for non-compliant suppliers
   - Audit trail of compliance history

3. **Assignment Optimization**:
   - Rules-based supplier matching to work orders
   - Geographic optimization to reduce travel time
   - Skills and compliance-based filtering
   - Conflict resolution for overlapping assignments

4. **Performance Tracking**:
   - Quality assessment collection
   - Client feedback integration
   - Historical performance scoring
   - Supplier rating and ranking system

## Reports and Analytics

### Standard Reports
- **Compliance Status Report**: Overview of all suppliers and their document status
- **Expiry Calendar**: Timeline of upcoming document renewals
- **Supplier Utilization**: Analysis of supplier assignment and capacity
- **Payment Summary**: Financial overview of supplier payments
- **Performance Analysis**: Quality ratings and issue tracking

### Operational Analytics
- **Supplier Capacity Planning**: Resource allocation and availability forecasting
- **Compliance Risk Assessment**: Identification of high-risk suppliers
- **Geographic Coverage Analysis**: Mapping of supplier service areas
- **Cost Optimization**: Rate comparison and spend analysis
- **Quality Trend Analysis**: Performance metrics over time

## Implementation Considerations

### Performance Optimization
- Efficient querying of supplier data with indexing on frequently filtered fields
- Caching of compliance status calculations
- Optimized document storage and retrieval
- Background processing for compliance checks

### Security
- Encryption of banking information
- Role-based access control for sensitive data
- Audit logging of all changes to supplier records
- Secure document storage with access controls

## Future Enhancements
- Supplier self-service portal for document uploads and profile management
- Geo-fenced supplier assignment with auto-recommendation engine
- Compliance dashboard with drill-down capabilities by region and service type
- Supplier blacklist history with formal reinstatement workflow
- LinkSafe webhook integration for automatic status updates
- Document template standardization and enforcement
- Mobile app for suppliers to update availability and accept assignments
- Automated ABN/ACN verification through Australian Business Register API
- Supplier performance scoring algorithm for assignment prioritization
- Integrated background checking for high-security sites

