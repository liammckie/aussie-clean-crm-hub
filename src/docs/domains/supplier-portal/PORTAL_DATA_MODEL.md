
# Supplier Portal Data Model

## Core Entities

### Supplier Account
The primary entity representing the supplier organization in the portal.

- **supplier_id**: UUID (Primary Key, foreign key to suppliers table)
- **business_name**: String (required)
- **abn**: String (11 digits, validated)
- **business_address**: JSON object (street, suburb, state, postcode)
- **business_phone**: String
- **business_email**: String (required, unique)
- **status**: Enum (active, inactive, suspended, pending_approval)
- **registration_date**: Timestamp
- **last_login**: Timestamp
- **subscription_tier**: Enum (standard, premium)
- **account_manager_id**: UUID (foreign key to internal staff)
- **onboarding_completed**: Boolean
- **compliance_status**: Enum (compliant, non_compliant, pending)
- **supplier_type**: Array of Enum (cleaning, maintenance, security, specialty)
- **service_areas**: Array of region codes
- **notes**: Text
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Supplier Users
Individual user accounts associated with a supplier.

- **user_id**: UUID (Primary Key)
- **supplier_id**: UUID (foreign key to supplier_accounts)
- **first_name**: String (required)
- **last_name**: String (required)
- **email**: String (required, unique)
- **phone**: String
- **role**: Enum (admin, operator, finance, staff)
- **status**: Enum (active, inactive, invited, locked)
- **avatar_url**: String (URL)
- **last_login**: Timestamp
- **password_reset_required**: Boolean
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Compliance Documents
Documents that verify supplier compliance with requirements.

- **document_id**: UUID (Primary Key)
- **supplier_id**: UUID (foreign key to supplier_accounts)
- **document_type**: Enum (insurance, identification, certification, agreement, workcover)
- **document_name**: String
- **document_number**: String
- **issue_date**: Date
- **expiry_date**: Date
- **status**: Enum (valid, pending, expired, rejected)
- **file_url**: String (URL)
- **file_size**: Number
- **issuer_name**: String
- **notes**: Text
- **verified_by**: UUID (foreign key to internal staff)
- **verified_at**: Timestamp
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Supplier Assignments
Work assignments allocated to suppliers.

- **assignment_id**: UUID (Primary Key)
- **supplier_id**: UUID (foreign key to supplier_accounts)
- **site_id**: UUID (foreign key to sites)
- **contract_id**: UUID (foreign key to contracts)
- **assignment_type**: Enum (regular, periodic, one_time, emergency)
- **status**: Enum (pending, accepted, rejected, in_progress, completed, cancelled)
- **start_date**: Date
- **end_date**: Date (optional)
- **recurrence_pattern**: JSON (for recurring assignments)
- **rate_type**: Enum (fixed, hourly, per_square_meter)
- **rate_amount**: Decimal
- **estimated_hours**: Decimal
- **description**: Text
- **special_instructions**: Text
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Workbills
Records of work performed by suppliers.

- **workbill_id**: UUID (Primary Key)
- **assignment_id**: UUID (foreign key to supplier_assignments)
- **supplier_id**: UUID (foreign key to supplier_accounts)
- **submitted_by**: UUID (foreign key to supplier_users)
- **scheduled_date**: Date
- **actual_start_time**: Timestamp
- **actual_end_time**: Timestamp
- **status**: Enum (draft, submitted, approved, rejected, paid)
- **rejection_reason**: Text
- **hours_worked**: Decimal
- **staff_count**: Integer
- **tasks_completed**: JSON Array
- **special_notes**: Text
- **client_signature**: JSON (name, timestamp, signature_image_url)
- **photos**: Array of URLs
- **gps_location**: Point (latitude, longitude)
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Payment Records
Financial transactions related to supplier payments.

- **payment_id**: UUID (Primary Key)
- **supplier_id**: UUID (foreign key to supplier_accounts)
- **payment_amount**: Decimal
- **payment_date**: Date
- **payment_method**: Enum (direct_deposit, check, other)
- **reference_number**: String
- **description**: Text
- **status**: Enum (pending, processed, failed)
- **related_workbills**: Array of workbill_ids
- **related_invoices**: Array of invoice_ids
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Quality Issues
Quality concerns related to supplier work.

- **issue_id**: UUID (Primary Key)
- **workbill_id**: UUID (foreign key to workbills)
- **supplier_id**: UUID (foreign key to supplier_accounts)
- **reported_by**: UUID
- **issue_type**: Enum (quality, attendance, safety, compliance, other)
- **severity**: Enum (low, medium, high, critical)
- **status**: Enum (open, acknowledged, in_progress, resolved, closed)
- **description**: Text
- **reported_date**: Timestamp
- **resolution_deadline**: Timestamp
- **resolution_notes**: Text
- **resolution_date**: Timestamp
- **photos**: Array of URLs
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Supplier Staff
Individual cleaning staff managed by the supplier.

- **staff_id**: UUID (Primary Key)
- **supplier_id**: UUID (foreign key to supplier_accounts)
- **first_name**: String
- **last_name**: String
- **email**: String
- **phone**: String
- **position**: String
- **employment_status**: Enum (full_time, part_time, casual, contractor)
- **linksafe_id**: String
- **induction_completed**: Boolean
- **induction_date**: Date
- **certifications**: JSON Array of certifications
- **available_days**: Array of weekday codes
- **preferred_regions**: Array of region codes
- **notes**: Text
- **created_at**: Timestamp
- **updated_at**: Timestamp

### Attendance Records
Records of supplier staff check-ins and check-outs at sites.

- **attendance_id**: UUID (Primary Key)
- **staff_id**: UUID (foreign key to supplier_staff)
- **supplier_id**: UUID (foreign key to supplier_accounts)
- **site_id**: UUID (foreign key to sites)
- **assignment_id**: UUID (foreign key to supplier_assignments)
- **check_in_time**: Timestamp
- **check_out_time**: Timestamp
- **check_in_location**: Point (latitude, longitude)
- **check_out_location**: Point (latitude, longitude)
- **status**: Enum (checked_in, checked_out, no_show, incomplete)
- **notes**: Text
- **verification_method**: Enum (app, qr_code, manual, linksafe)
- **created_at**: Timestamp
- **updated_at**: Timestamp

## Relationships

- **Supplier Account** to **Supplier Users**: One-to-many relationship where a supplier account can have multiple user accounts with different roles.
- **Supplier Account** to **Compliance Documents**: One-to-many relationship where a supplier must maintain multiple types of compliance documentation.
- **Supplier Account** to **Supplier Assignments**: One-to-many relationship where a supplier can be assigned to multiple sites and contracts.
- **Supplier Assignments** to **Workbills**: One-to-many relationship where each assignment can have multiple workbills over time.
- **Workbills** to **Payment Records**: Many-to-many relationship where multiple workbills can be associated with payment records.
- **Workbills** to **Quality Issues**: One-to-many relationship where quality issues can be raised against specific workbills.
- **Supplier Account** to **Supplier Staff**: One-to-many relationship where suppliers manage their own cleaning staff.
- **Supplier Staff** to **Attendance Records**: One-to-many relationship where staff members have multiple attendance records.
