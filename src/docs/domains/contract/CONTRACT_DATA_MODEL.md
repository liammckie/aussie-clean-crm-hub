
# Contract Data Model

## Core Entities

### Contract
The primary entity representing a formal agreement between Aussie Clean and a client.

#### Basic Information
- **Contract ID**: Unique identifier (UUID, Primary Key)
- **Contract Code**: Unique reference code (string)
- **Client ID**: Foreign key reference to clients table
- **Status**: Current contract state (enum: draft, active, pending_approval, expired, terminated, cancelled)
- **Contract Type**: Agreement structure (enum: fixed, flexible, month-to-month, trial)
- **Service Type**: Primary service category (enum: cleaning, waste, hygiene, pest_control, etc.)
- **Start Date**: Contract commencement date
- **End Date**: Contract termination date
- **Review Date**: Optional date for contract review
- **Auto Renew**: Flag indicating automatic renewal (boolean)
- **Renewal Frequency**: How often contract renews (enum: monthly, annually, quarterly)
- **Linked Quote ID**: Optional foreign key to approved quote

#### Financial Details
- **Billing Frequency**: Invoice generation schedule (enum: monthly, quarterly, per_work_order, adhoc)
- **Rate Type**: Pricing structure (enum: fixed, indexed, tiered, per_work_order)
- **Rate Value**: Base service value (decimal)
- **Payment Terms**: Payment timeframe (enum: net_7, net_14, net_30, custom string)
- **Next Billing Date**: Scheduled date for next invoice generation
- **Not To Exceed Amount**: Maximum billing cap (decimal, optional)
- **Credit Cap**: Maximum credit allowed (decimal, optional)
- **Billing Notes**: Special billing instructions or notes
- **CPI Enabled**: Whether Consumer Price Index adjustments apply (boolean)
- **CPI Rate**: Percentage rate for adjustments (decimal, optional)
- **CPI Last Applied**: Date of last CPI adjustment
- **CPI Next Due**: Scheduled date for next CPI adjustment
- **Accrual Budget Annual**: Total annual accrual budget (decimal)
- **Accrual Allocated Weekly**: Weekly accrual allocation (decimal)

#### Administrative Information
- **Scope of Services**: Detailed service description (rich text or document URL)
- **Created By**: Employee who created the contract
- **Approved By**: Employee who approved the contract
- **Last Modified By**: Employee who last modified the contract
- **Created At**: Timestamp of creation
- **Updated At**: Timestamp of last modification
- **Locked At**: Timestamp when contract was locked/finalized

## Relationships

### Contract Sites
Links contracts to physical service locations:
- **Contract ID**: Foreign key to contracts table
- **Site ID**: Foreign key to sites table
- **Start Date**: Site service commencement date
- **End Date**: Site service termination date

### Contract Periodical Inclusions
Additional scheduled services beyond regular contract:
- **Contract ID**: Foreign key to contracts table
- **Service Name**: Description of periodical service
- **Included**: Whether service is included in base contract price
- **Client Charge**: Amount charged to client for service
- **Contractor Payment**: Amount paid to contractor for service
- **Last Completed On**: Date service was last performed
- **Frequency**: How often service is performed (e.g., Bi-annually)
- **Total SQM**: Area covered by periodical service
- **Comments**: Service-specific notes

### Contract Documents
Files and documentation associated with the contract:
- **Contract ID**: Foreign key to contracts table
- **Document Type**: Category of document (original, signed_pdf, insurance_attachment, scope_doc, etc.)
- **File URL**: Link to stored document
- **Uploaded By**: Employee who uploaded the document
- **Uploaded At**: Timestamp of document upload

### Contract Version History
Historical record of contract changes:
- **Version ID**: Unique identifier (UUID)
- **Contract ID**: Foreign key to contracts table
- **Version Number**: Incremental counter
- **Change Summary**: Description of changes
- **Change Type**: Category of change (enum: renewal, amendment, pricing_change, cpi_adjustment, termination)
- **Changed By**: Employee who made the change
- **Changed At**: Timestamp of change
- **Snapshot JSON**: Complete contract state at version point
