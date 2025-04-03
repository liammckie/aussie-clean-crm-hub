
# Supplier Management Business Rules

## Validation Rules
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

## Compliance Logic
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
