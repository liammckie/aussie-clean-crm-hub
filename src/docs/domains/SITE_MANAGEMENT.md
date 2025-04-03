
# Site Management

## Overview
The Site Management module is a foundational component of the Aussie Clean ERP system responsible for tracking all physical locations where services are delivered. It manages location data, site-specific configurations, service scheduling details, and compliance requirements for client properties.

## Data Model

### Core Entities

#### Site
The primary entity representing a physical location where cleaning or other services are delivered.

##### Basic Information
- **Site ID**: Unique identifier (UUID, Primary Key)
- **Client ID**: Foreign key reference to clients table
- **Site Code**: Unique reference code per client (auto-generated, e.g., ABC-001)
- **Site Name**: Descriptive name for the location
- **Status**: Current site state (enum: active, inactive, archived, pending_activation)
- **Region**: Geographical region (enum or foreign key to regions)
- **Business Unit**: Organizational division responsible (enum or foreign key)

##### Location Details
- **Address Line 1**: Primary street address
- **Address Line 2**: Additional address information (optional)
- **Suburb**: City or suburb name
- **State**: State or territory
- **Postcode**: Postal code
- **Country**: Country name or code
- **Latitude**: GPS coordinate (decimal, optional)
- **Longitude**: GPS coordinate (decimal, optional)

##### Site Characteristics
- **Site Type**: Property category (enum: office, retail, warehouse, industrial, etc.)
- **Square Meters**: Total cleanable area (decimal)
- **Induction Required**: Whether safety induction is needed (boolean)
- **Site Tags**: Array of categorization tags

##### Service Schedule
- **Cleaning Frequency**: Overall schedule (enum: daily, weekly, fortnightly, monthly)
- **Cleaning Days Schedule**: Structured object or array with:
  - Day of week
  - Start time
  - End time
  - Special instructions

##### Contact Information
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

##### Administrative Information
- **Area Manager ID**: Foreign key to employee who manages this site
- **Default Calendar ID**: Reference to service calendar configuration
- **Notes**: General site notes and comments
- **Created At**: Timestamp of creation
- **Updated At**: Timestamp of last modification

### Relationships

#### Supplier Assignments
Many-to-many relationship between sites and suppliers:
- **Supplier ID**: Foreign key to suppliers table
- **Assignment Type**: Role of supplier (enum: primary, secondary, periodical)
- **Start Date**: Assignment commencement date
- **End Date**: Assignment termination date
- **Rate**: Optional site-specific rate override
- **Active**: Whether assignment is currently active
- **Notes**: Assignment-specific notes

#### Employee Assignments
Many-to-many relationship between sites and internal employees:
- **Employee ID**: Foreign key to employees table
- **Work Type**: Nature of work (e.g., regular, periodical)
- **Hours Per Week**: Expected work duration
- **Assignment Start**: Start date for employee assignment
- **Assignment End**: End date for employee assignment

#### Compliance Metadata
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

#### Related Entities
- **Contract Sites**: Links site to service contracts
- **Work Orders**: Service instructions specific to this site
- **Site Documents**: Site-specific documentation
- **Site Visits**: Record of visits and inspections

## Business Rules

### Automatic Processing
1. **Site Code Generation**:
   - System auto-generates site_code using client prefix and numeric suffix
   - Format: {CLIENT_PREFIX}-{SEQUENTIAL_NUMBER} (e.g., ABC-001)

2. **Geolocation**:
   - If latitude/longitude not provided, system attempts geocoding based on address
   - Coordinates can be manually overridden if needed

3. **Document Management**:
   - System automatically creates document folder structure on site creation:
   - `/Clients/{client_id}/Sites/{site_id}/`
   - Appropriate subfolder structure for documents, floor plans, etc.

4. **Schedule Initialization**:
   - Default cleaning days created based on cleaning_frequency selection
   - Daily frequency pre-populates Monday-Friday schedule entries

### Validation Rules
1. **Required Fields**:
   - site_name, status, address_line1, suburb, state, postcode are mandatory
   - site_name must be unique within the same client

2. **Data Integrity**:
   - square_meters must be positive number if provided
   - If induction_required is true, at least one induction document or checklist must be linked

3. **Schedule Validation**:
   - cleaning_days_schedule must follow consistent JSON structure
   - Time entries must be valid and end time must be after start time

4. **Assignment Logic**:
   - Supplier and employee assignments cannot have contradictory primary assignments
   - Assignment date ranges must be valid (end after start)

### Status Transition Rules
1. **Site Lifecycle**:
   - New sites typically start as "pending_activation"
   - Transition to "active" when all setup requirements completed
   - "Inactive" temporarily suspends service delivery
   - "Archived" prevents new contracts and disables roster generation

2. **Status Effects**:
   - Status changes cascade notifications to relevant stakeholders
   - "Archived" status prevents work order generation
   - Region changes trigger notifications to area managers

## Integration Points

### External Systems
- **Mapping Services**: Geocoding and mapping visualization
- **Document Management**: Storage of site-specific documentation
- **Mobile Apps**: Field staff access to site details and check-in

### Internal Modules
- **Client Management**: Parent-child relationship with sites
- **Contract Management**: Sites linked to service agreements
- **Scheduling**: Service delivery planning based on site details
- **Work Orders**: Job instructions for specific sites
- **Quality Audits**: Site-specific assessment templates
- **Supplier Management**: Resource allocation to sites
- **Reporting**: Operational and compliance analysis

## Permission Model

| Role | Create | View | Edit | Archive | Delete |
|------|--------|------|------|---------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ (if no contracts) |
| Operations | ✅ | ✅ | ✅ | ✅ (region only) | ❌ |
| Account Manager | ✅ | ✅ | ❌ | ❌ | ❌ |
| Field Staff | ❌ | ✅ (assigned only) | ❌ | ❌ | ❌ |

## User Interface Components

### Primary Views
1. **Site List**:
   - Filterable, sortable list of all sites
   - Quick filtering by region, status, client
   - Map view toggle for geographical visualization
   - Bulk operations for multi-site updates

2. **Site Detail**:
   - Tabbed interface for different aspects of site information
   - Interactive map showing site location
   - Service schedule visualization
   - Linked contracts and work orders
   - Assignment management for suppliers and employees

3. **Creation Workflow**:
   - Multi-step form with validation
   - Address verification and geocoding
   - Template selection for similar sites
   - Compliance requirement definition
   - Service scheduling setup

### Key Workflows
1. **Site Onboarding**:
   - Basic information capture
   - Location verification and mapping
   - Compliance requirements definition
   - Supplier and staff assignment
   - Document attachment and verification

2. **Schedule Management**:
   - Visual calendar interface for service scheduling
   - Conflict detection and resolution
   - Exception handling for holidays and special events
   - Resource allocation optimization

3. **Compliance Management**:
   - Safety audit scheduling and tracking
   - Induction management for new staff
   - License and certification tracking
   - Site-specific safety protocol documentation

## Reports and Analytics

### Standard Reports
- **Site Distribution**: Geographic distribution of service locations
- **Compliance Status**: Overview of site compliance requirements and status
- **Supplier Coverage**: Analysis of supplier assignment across sites
- **Resource Utilization**: Staff and equipment allocation efficiency

### Operational Analytics
- **Travel Optimization**: Route efficiency for multi-site service delivery
- **Completion Rates**: Service fulfillment analysis by site
- **Schedule Adherence**: Actual vs. scheduled service delivery
- **Site Profitability**: Margin analysis by location

## Implementation Considerations

### Performance Optimization
- Efficient querying of site data with geospatial indexing
- Caching of frequently accessed site details
- Optimized loading of related entities (contracts, work orders)

### Extensibility
- Customizable site attributes through dynamic fields
- Pluggable compliance templates by industry or client type
- Flexible schedule definition capabilities

## Future Enhancements
- Support for alternate coordinates (entry point vs. building centroid)
- Attachment of floor plans with interactive element tagging
- Automated generation of compliance alerts for expiring credentials
- Grouping support for campus-style multi-site clusters
- Permission-aware map visualization with proximity search
- Supplier fallback or automatic reassignment for compliance breaches
- QR code generation for site-specific digital information access
- Integration with IoT devices for environmental monitoring

