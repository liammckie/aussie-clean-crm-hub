
# Supplier Portal Business Rules

## Account Management

### Registration Process
1. **Registration Approval**:
   - New supplier registrations must be approved by an internal administrator before activation
   - Required fields: Business name, ABN, contact details, business address
   - ABN must be validated with Australian Business Register

2. **Supplier Status Rules**:
   - Only suppliers with 'active' status can access assignments and submit workbills
   - 'suspended' suppliers retain access to historical data but cannot accept new work
   - 'inactive' suppliers cannot log in to the portal
   - System automatically flags suppliers with expired critical documents as 'non_compliant'

3. **User Management**:
   - Supplier Admin role can create and manage user accounts for their organization
   - Maximum 10 user accounts per supplier by default (configurable per supplier)
   - Email addresses must be unique across the entire portal
   - Password policy requires minimum 10 characters with numbers and special characters

## Compliance Management

### Document Requirements
1. **Mandatory Documents**:
   - Public Liability Insurance (minimum $10M coverage)
   - Workers Compensation Insurance (if applicable)
   - Business Registration Certificate
   - Master Services Agreement (signed)
   - Photo ID for all Administrative users

2. **Document Validation Rules**:
   - All documents must be in PDF, JPG, or PNG format
   - Maximum file size: 10MB per document
   - Insurance documents must include policy number and expiry date
   - Documents are verified by internal staff before being marked as 'valid'

3. **Expiry Handling**:
   - System sends notifications 30, 14, and 3 days before document expiry
   - Grace period of 7 days after expiry before supplier marked as 'non_compliant'
   - Critical document expiry (insurance, certifications) blocks new assignment acceptance

## Assignment Management

### Assignment Allocation
1. **Eligibility Rules**:
   - Suppliers must be 'active' and 'compliant' to receive new assignments
   - Assignments are matched based on supplier type, service areas, and availability
   - Suppliers can only view assignments allocated specifically to them
   - Suppliers must accept or reject assignments within 24 hours

2. **Capacity Management**:
   - System checks for scheduling conflicts before offering assignments
   - Maximum weekly hours capacity set per supplier account
   - Overallocation warnings triggered when approaching capacity limits

3. **Assignment Status Transitions**:
   - New assignments enter 'pending' status until supplier accepts or rejects
   - Accepted assignments become 'in_progress' on start date
   - Assignments are 'completed' when all associated workbills are approved
   - Cancelled assignments require reason code and documentation

## Workbill Management

### Submission Rules
1. **Completion Requirements**:
   - Workbills must be submitted within 24 hours of service completion
   - Required fields: Start/end times, tasks completed, staff count
   - Photos required for specific assignment types (periodic, first-time)
   - GPS location stamp required for mobile submissions

2. **Validation Checks**:
   - Hours worked must be within ±20% of estimated hours (configurable)
   - Start time must be within 15 minutes of scheduled time
   - System verifies that staff were checked in at location via LinkSafe
   - Duplicate workbill detection for same site/date combination

3. **Approval Process**:
   - All workbills require review by Operations team
   - Rejected workbills must include reason and can be resubmitted once
   - Auto-approval after 3 business days if not reviewed (configurable)
   - Workbill status affects payment eligibility

## Payment Processing

### Payment Rules
1. **Payment Eligibility**:
   - Only approved workbills are eligible for payment
   - System calculates payment amounts based on assignment rates and hours worked
   - Deductions applied for validated quality issues or incomplete work
   - Payments batched weekly according to configured payment cycle

2. **Statement Generation**:
   - Payment statements generated on the 1st and 15th of each month
   - Statements include all workbills, approved amounts, and deductions
   - Suppliers must review and accept statements before payment processing
   - Disputed items flagged for review by Finance team

3. **Tax Handling**:
   - System automatically applies GST calculations based on supplier GST status
   - Recipient Created Tax Invoice (RCTI) generated for suppliers with RCTI agreement
   - Tax summary available for export at end of financial year

## Quality Assurance

### Quality Management
1. **Issue Reporting**:
   - Quality issues can be raised against specific workbills
   - Suppliers notified immediately when issues reported
   - Response required within 24 hours for critical issues
   - Supporting evidence (photos) required for quality disputes

2. **Resolution Process**:
   - Suppliers must acknowledge issues before submitting resolution
   - Resolution plans required for 'high' and 'critical' severity issues
   - Resolution deadlines based on issue severity:
     - Critical: 24 hours
     - High: 48 hours
     - Medium: 72 hours
     - Low: 5 business days
   - Unresolved issues affect supplier performance rating

3. **Performance Impact**:
   - Quality issues factored into supplier performance score
   - Repeated similar issues trigger automatic review of supplier status
   - Three critical issues within 30 days results in suspension pending review
   - Performance affects future assignment eligibility

## Attendance Management

### Check-in/Check-out Rules
1. **Verification Requirements**:
   - Staff must check in/out via mobile app or LinkSafe integration
   - Check-in location must be within 100 meters of site location
   - Check-in must be within 15 minutes of scheduled start time
   - Late check-ins automatically flagged to supplier admin

2. **Attendance Validation**:
   - Minimum time on site enforced based on assignment type
   - Early departures require approval or explanation
   - No-shows automatically generate notification to Operations team
   - Staff substitutions must be pre-approved or documented

3. **Geofencing Logic**:
   - Site boundaries defined by geofence configuration
   - Multiple check-in points required for large sites
   - Random geo-verification requests during shift for compliance
   - Offline mode available with location verification upon reconnection
