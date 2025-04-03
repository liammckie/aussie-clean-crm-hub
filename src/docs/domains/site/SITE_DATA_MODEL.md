
# Site Data Model

## Core Entities

### Site
The primary entity representing a physical location where cleaning or other services are delivered.

#### Basic Information
- **Site ID**: Unique identifier (UUID, Primary Key)
- **Client ID**: Foreign key reference to clients table
- **Site Code**: Unique reference code per client (auto-generated, e.g., ABC-001)
- **Site Name**: Descriptive name for the location
- **Status**: Current site state (enum: active, inactive, archived, pending_activation)
- **Region**: Geographical region (enum or foreign key to regions)
- **Business Unit**: Organizational division responsible (enum or foreign key)

#### Location Details
- **Address Line 1**: Primary street address
- **Address Line 2**: Additional address information (optional)
- **Suburb**: City or suburb name
- **State**: State or territory
- **Postcode**: Postal code
- **Country**: Country name or code
- **Latitude**: GPS coordinate (decimal, optional)
- **Longitude**: GPS coordinate (decimal, optional)

#### Site Characteristics
- **Site Type**: Property category (enum: office, retail, warehouse, industrial, etc.)
- **Square Meters**: Total cleanable area (decimal)
- **Induction Required**: Whether safety induction is needed (boolean)
- **Site Tags**: Array of categorization tags

#### Service Schedule
- **Cleaning Frequency**: Overall schedule (enum: daily, weekly, fortnightly, monthly)
- **Cleaning Days Schedule**: Structured object or array with:
  - Day of week
  - Start time
  - End time
  - Special instructions

#### Contact Information
- **Site Contact Name**: Primary on-site contact person
- **Site Contact Email**: Email for site contact
- **Site Contact Phone**: Phone number for site contact
- **Site Contacts**: Array or linked table of additional contacts with:
  - Contact type (enum: primary, emergency, facilities, security)
  - Name
  - Position
  - Email
  - Phone
  - Available hours

#### Administrative Information
- **Area Manager ID**: Foreign key to employee who manages this site
- **Default Calendar ID**: Reference to service calendar configuration
- **Notes**: General site notes and comments
- **Created At**: Timestamp of creation
- **Updated At**: Timestamp of last modification

## Relationships

### Supplier Assignments
Many-to-many relationship between sites and suppliers:
- **Supplier ID**: Foreign key to suppliers table
- **Assignment Type**: Role of supplier (enum: primary, secondary, periodical)
- **Start Date**: Assignment commencement date
- **End Date**: Assignment termination date
- **Rate**: Optional site-specific rate override
- **Active**: Whether assignment is currently active
- **Notes**: Assignment-specific notes

### Employee Assignments
Many-to-many relationship between sites and internal employees:
- **Employee ID**: Foreign key to employees table
- **Work Type**: Nature of work (e.g., regular, periodical)
- **Hours Per Week**: Expected work duration
- **Assignment Start**: Start date for employee assignment
- **Assignment End**: End date for employee assignment

### Compliance Metadata
Site-specific compliance requirements:
- **Site Compliance Profile ID**: Foreign key to compliance templates
- **Site Access Protocols**: Structured object with:
  - Alarm codes
  - Key storage information
  - After-hours entry procedures
- **License Required**: Whether special licensing is needed (boolean)
- **License Expiry Date**: Date when license expires
- **Last Safety Audit Date**: When the last audit was performed
- **Next Safety Audit Due**: Scheduled date for next audit

### Related Entities
- **Contract Sites**: Links site to service contracts
- **Work Orders**: Service instructions specific to this site
- **Site Documents**: Site-specific documentation
- **Site Visits**: Record of visits and inspections

## Data Validation Rules
- Site name must be unique per client
- Address fields must be properly formatted
- Latitude/Longitude must be valid coordinates
- Square meters must be positive number
- Required fields: Site Name, Status, Address Line 1, Suburb, State, Postcode
