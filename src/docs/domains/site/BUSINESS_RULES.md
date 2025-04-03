
# Site Business Rules

## Automatic Processing

### Site Code Generation
- System auto-generates site_code using client prefix and numeric suffix
- Format: {CLIENT_PREFIX}-{SEQUENTIAL_NUMBER} (e.g., ABC-001)
- Codes are unique within a client's sites
- Cannot be manually edited after creation

### Geolocation
- If latitude/longitude not provided, system attempts geocoding based on address
- Coordinates can be manually overridden if needed
- Map visualization uses these coordinates
- Proximity search relies on accurate coordinates

### Document Management
- System automatically creates document folder structure on site creation
- Folder path: `/Clients/{client_id}/Sites/{site_id}/`
- Appropriate subfolder structure for documents, floor plans, etc.
- Version control maintained for all documents

### Schedule Initialization
- Default cleaning days created based on cleaning_frequency selection
- Daily frequency pre-populates Monday-Friday schedule entries
- Weekly frequency prompts for preferred day
- Custom schedules can override default patterns

## Validation Rules

### Required Fields
- site_name, status, address_line1, suburb, state, postcode are mandatory
- site_name must be unique within the same client
- region must be selected from predefined list
- site_type must be selected from predefined categories

### Data Integrity
- square_meters must be positive number if provided
- If induction_required is true, at least one induction document or checklist must be linked
- Contact information must include at least one primary contact
- Address must be valid and geocodable

### Schedule Validation
- cleaning_days_schedule must follow consistent JSON structure
- Time entries must be valid and end time must be after start time
- Schedule conflicts are identified and flagged
- Schedule changes trigger notifications to relevant stakeholders

### Assignment Logic
- Supplier and employee assignments cannot have contradictory primary assignments
- Assignment date ranges must be valid (end after start)
- Assignment conflicts are identified and require resolution
- Rate overrides must be justified and approved

## Status Transition Rules

### Site Lifecycle
1. **Pending Activation**:
   - Initial status for new sites
   - Incomplete setup, cannot generate work orders
   - Transitions to "Active" when setup complete

2. **Active**:
   - Fully operational status
   - Work orders can be generated
   - Services scheduled and delivered
   - Can transition to "Inactive" or "Archived"

3. **Inactive**:
   - Temporarily suspends service delivery
   - Maintains all site data and relationships
   - Can return to "Active" when needed
   - Typically used for seasonal or temporarily closed locations

4. **Archived**:
   - End-of-life status for sites no longer serviced
   - Prevents new contracts and disables roster generation
   - Preserves historical data for reporting
   - Rarely returns to active status

### Status Effects
- Status changes cascade notifications to relevant stakeholders
- "Archived" status prevents work order generation
- Region changes trigger notifications to area managers
- Status changes affect resource allocation and scheduling

## Site Assignment Rules

### Supplier Assignment
- Sites can have one primary supplier
- Multiple secondary suppliers allowed
- Periodical suppliers for specialized services
- Assignment changes require approval workflow
- Rate overrides follow approval hierarchy

### Employee Assignment
- Employees must have required certifications for site
- Induction requirements must be satisfied before assignment
- Assignment conflicts with leave are prevented
- Assignment changes trigger notifications
- Hours per week must align with employment contract

## Compliance Requirements

### Induction Management
- Sites with induction_required=true enforce induction completion
- Induction records link employees to sites
- Expired inductions prevent employee assignment
- Compliance reporting tracks induction status

### Access Control
- Access protocols must be documented for after-hours service
- Key management follows secure handling procedures
- Alarm codes follow masking and secure storage protocols
- Access changes require proper authorization

### Safety Audits
- Regular safety audits scheduled based on site type
- Audit findings link to site compliance records
- Critical findings trigger immediate notification
- Audit schedule enforcement through automated reminders

## Activity Feed Logging
The system logs the following site-related events:
- Site created/edited
- Status changed
- Supplier/employee assigned or removed
- Documents uploaded/expired
- Compliance status changes
- Schedule modifications
- Visits and inspections recorded
