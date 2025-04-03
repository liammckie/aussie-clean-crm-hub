
# Employee Data Model

## Core Entities

### Employee
The central entity that represents workers within the organization.

#### Core Fields
- **employee_id**: UUID, Primary Key
- **first_name**: String
- **last_name**: String
- **known_as**: String (preferred name)
- **email**: String (personal email)
- **company_email**: String
- **phone_mobile**: String
- **phone_home**: String
- **address**: Complex Object (street, city, state, postcode)
- **dob**: Date
- **gender**: Enum
- **nationality**: String
- **marital_status**: Enum
- **job_title**: String
- **employment_type**: Enum (full_time, part_time, casual, contractor)
- **start_date**: Date
- **termination_date**: Date, nullable
- **status**: Enum (active, pending, terminated)
- **manager_id**: UUID, Foreign Key to Employee
- **external_id**: String (sync field with Employment Hero)
- **award_classification_id**: UUID, Foreign Key to Award Classification
- **cost_centre_id**: UUID, Foreign Key to Cost Centre

### Employment Hero Sync Fields
Fields synchronized from the Employment Hero platform:

#### Personal & Financial
- **superannuation_details**: Complex Object
- **bank_account_details**: Complex Object
- **tax_declaration**: Complex Object
- **emergency_contacts**: Array of Complex Objects
- **custom_fields**: JSON (contains shirt size, availability, etc.)

#### Work-Related
- **certifications**: Array of Certification Objects
- **payslips**: Array of Payslip References
- **teams**: Array of Team IDs
- **shift_assignments**: Array of Shift Assignment IDs
- **rostered_shifts**: Array of Rostered Shift IDs

### Employee Document
Tracks all documents associated with an employee.

- **document_id**: UUID, Primary Key
- **employee_id**: UUID, Foreign Key
- **document_type**: Enum (police_check, id, visa, certification, etc.)
- **upload_date**: DateTime
- **expiry_date**: Date, nullable
- **verification_status**: Enum (pending, verified, rejected)
- **upload_method**: Enum (manual, eh_sync)
- **file_reference**: String (path to file storage)
- **notes**: Text

### Emergency Contact
Stores emergency contact information for employees.

- **contact_id**: UUID, Primary Key
- **employee_id**: UUID, Foreign Key
- **name**: String
- **relationship**: String
- **phone_primary**: String
- **phone_secondary**: String
- **contact_type**: Enum (primary, secondary)
- **address**: Complex Object, nullable

### Induction Record
Tracks employee inductions for sites and roles.

- **induction_id**: UUID, Primary Key
- **employee_id**: UUID, Foreign Key
- **site_id**: UUID, Foreign Key, nullable
- **induction_type**: Enum (site, role, whs, etc.)
- **completion_date**: Date
- **inducted_by**: UUID, Foreign Key to Employee
- **status**: Enum (completed, pending)
- **notes**: Text
- **expiry_date**: Date, nullable

### Certification
Tracks employee certifications and licenses.

- **certification_id**: UUID, Primary Key
- **employee_id**: UUID, Foreign Key
- **certification_type**: Enum (license, training, check)
- **name**: String
- **issuing_authority**: String
- **issue_date**: Date
- **expiry_date**: Date, nullable
- **status**: Enum (approved, declined, expired)
- **reference_number**: String
- **document_id**: UUID, Foreign Key to Employee Document, nullable

### Leave Request
Records employee leave requests and approvals.

- **leave_id**: UUID, Primary Key
- **employee_id**: UUID, Foreign Key
- **start_date**: Date
- **end_date**: Date
- **hours**: Decimal
- **leave_category**: Enum (annual, sick, personal, etc.)
- **reason**: Text
- **status**: Enum (pending, approved, declined)
- **approved_by**: UUID, Foreign Key to Employee, nullable
- **approval_date**: DateTime, nullable
- **external_id**: String (for EH sync)

### Timesheet Entry
Tracks employee work hours for payroll.

- **timesheet_id**: UUID, Primary Key
- **employee_id**: UUID, Foreign Key
- **date**: Date
- **start_time**: Time
- **end_time**: Time
- **total_hours**: Decimal
- **break_duration**: Decimal
- **site_id**: UUID, Foreign Key, nullable
- **cost_centre_id**: UUID, Foreign Key, nullable
- **status**: Enum (draft, submitted, approved, rejected)
- **approved_by**: UUID, Foreign Key to Employee, nullable
- **approval_date**: DateTime, nullable
- **notes**: Text
- **external_id**: String (for EH sync)

## Relationships

- **Employee** to **Employee Document**: One-to-Many
- **Employee** to **Emergency Contact**: One-to-Many
- **Employee** to **Induction Record**: One-to-Many
- **Employee** to **Certification**: One-to-Many
- **Employee** to **Leave Request**: One-to-Many
- **Employee** to **Timesheet Entry**: One-to-Many
- **Employee** to **Employee** (Manager): Many-to-One
- **Employee** to **Award Classification**: Many-to-One
- **Employee** to **Cost Centre**: Many-to-One
