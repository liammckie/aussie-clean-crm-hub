
# Onboarding & Training

## Onboarding Workflow

### Process Overview
The employee onboarding process in Aussie Clean ERP ensures all new hires are properly registered, documented, and prepared for their roles.

#### Workflow Steps
1. **Initiation**
   - HR creates a new employee record
   - Alternatively, triggered via accepted Employment Hero invite
   - System generates a unique onboarding link

2. **Personal Information Collection**
   - Employee receives onboarding email with secure link
   - Employee completes digital forms:
     - Personal details (name, address, contact)
     - Tax File Number declaration
     - Superannuation choice form
     - Emergency contact information
     - Bank account details for payroll

3. **Policy Acceptance**
   - Digital sign-off on company policies
   - Acknowledgment of procedures and guidelines
   - Record of acceptance timestamp and version

4. **Document Submission**
   - Upload of required identification documents
   - Work eligibility verification (visa, citizenship)
   - Qualification and certification evidence
   - Previous employment references

5. **Employment Hero Integration**
   - Completion of EH checklist items
   - Registration in EH system
   - Assignment of EH-based training modules

6. **Induction Assignment**
   - Scheduling of induction sessions
   - Assignment of site-specific inductions
   - WHS training requirements

7. **Completion**
   - Onboarding status automatically updated to "Complete"
   - All documents logged to Employee Document Register
   - Notification sent to manager and HR

### Onboarding Status Tracking
- **Not Started**: Employee record created but onboarding not initiated
- **In Progress**: Employee has started but not completed all required steps
- **Waiting for Verification**: All steps completed, pending HR verification
- **Complete**: All requirements satisfied and verified
- **Incomplete**: Onboarding stalled or abandoned

## Induction Management

### Site Inductions
- Site-specific safety procedures and protocols
- Access requirements and security information
- Emergency procedures and contacts
- Facilities orientation

### Role-based Inductions
- Job-specific training requirements
- Equipment operation procedures
- Quality standards and protocols
- Reporting relationships and communication channels

### WHS Inductions
- General workplace health and safety
- Risk assessment procedures
- Incident reporting protocols
- Personal protective equipment requirements

### Induction Record Tracking
- **induction_id**: Unique identifier
- **employee_id**: Associated employee
- **site_id**: Relevant site (if applicable)
- **induction_type**: Category of induction
- **completion_date**: Date of successful completion
- **inducted_by**: Responsible trainer/manager
- **status**: Completion status (completed, pending)
- **notes**: Additional information or observations
- **expiry_date**: Renewal date (if applicable)

## Certification Management

### Certification Types
- **Licenses**: Driver's license, forklift license, etc.
- **Training Certificates**: First aid, confined space, etc.
- **Background Checks**: Police check, working with children
- **Qualifications**: Trade certificates, degrees

### Certification Tracking Fields
- Certificate name and type
- Issuing authority
- Issue and expiry dates
- Verification status
- Reference/license number
- Associated documents

### Employment Hero Integration
- EH provides list of assigned certifications
- Synchronization of certification status and details
- Automatic updates based on EH verification

### Compliance Enforcement
- System prevents assignment to jobs requiring expired certifications
- Notification system for upcoming certification expiry
- Dashboard highlighting certification compliance issues
- Manual upload capability for certifications outside EH

## Skills Matrix

### Matrix Structure
- Visual representation of skills vs. employees
- Color-coded proficiency levels
- Certification and training status indicators
- Experience level tracking

### Business Applications
- Identify qualified personnel for specific tasks
- Highlight training gaps across the organization
- Support resource allocation decisions
- Enable strategic training program development

### Implementation
- Role-based skill requirements mapping
- Individual skill assessment and verification
- Regular review and update process
- Integration with training and development planning

## Training Management

### Training Program Types
- Mandatory compliance training
- Role-specific technical training
- Professional development
- Leadership and management training

### Training Record Tracking
- Course/program details
- Completion status and date
- Assessment results
- Trainer/provider information
- Renewal/refresher requirements

### LinkSafe Integration
- Integration with LinkSafe training platform
- Automatic record synchronization
- Compliance reporting
- Training content delivery

## Document Compliance

### Document Types
- Identification (passport, driver's license)
- Right to work (visas, citizenship)
- Qualifications and certifications
- Training records
- Signed policies and agreements

### Tracking Mechanism
- **Type**: Document classification
- **Expiry Date**: When document requires renewal
- **Verification Status**: Review and approval status
- **Upload Method**: Manual or EH sync
- **Employee Association**: Related employee record

### Compliance Features
- Centralized document repository in employee record
- Visibility through compliance dashboard
- Automated reminder system before expiry
- Full audit trail of document history

## UI Components

### Onboarding Portal
- Step-by-step guided interface
- Progress tracking indicators
- Document upload functionality
- Form validation and assistance

### Skills Matrix View
- Matrix visualization with filtering options
- Export capabilities for reporting
- Drill-down for detailed employee skills
- Training gap analysis tools

### Training Dashboard
- Upcoming and completed training schedule
- Compliance status indicators
- Training request workflow
- Resource allocation view

### Document Compliance Center
- Expiry calendar and alert system
- Bulk document processing
- Verification workflow interface
- Compliance reporting tools
