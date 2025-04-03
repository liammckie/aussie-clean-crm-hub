
# Quote Data Model

## Core Entities

### Quote
The primary entity representing a commercial cleaning quote proposal.

#### Basic Information
- **Quote ID**: Unique identifier (UUID, Primary Key)
- **Quote Code**: Human-readable reference code
- **Client ID**: Foreign key reference to clients table
- **Status**: Current state (enum: draft, pending_approval, approved, declined, expired)
- **Created By**: Employee who created the quote
- **Creation Date**: When quote was initially created
- **Expiry Date**: Date when quote offer expires
- **Last Modified**: Timestamp of most recent update
- **Version Number**: Incremental counter for quote revisions

#### Financial Details
- **Total Value**: Calculated total quote value
- **Weekly Value**: Calculated weekly revenue
- **Annual Value**: Calculated annual revenue
- **Margin Strategy**: Approach to margin calculation (fixed percentage, tiered, target profit)
- **Target Margin**: Desired profit margin percentage
- **Overhead Rate**: Applied overhead percentage or flat amount
- **Equipment Allowance**: Additional costs for equipment
- **One-off Setup Costs**: Initial non-recurring costs
- **Notes**: Additional pricing considerations

### Quote Site Items
Many-to-many relationship between quotes and individual sites with site-specific configuration.

- **Quote ID**: Foreign key to quotes table
- **Site ID**: Foreign key to sites table
- **Site Area**: Total cleanable area in square meters
- **Site Hours**: Calculated total cleaning hours
- **Site Value**: Calculated site-specific quote value
- **Site Frequency**: Visit frequency (daily, weekly, monthly)
- **Service Start Date**: Proposed commencement date
- **Notes**: Site-specific considerations

### Labour Plans
Detailed breakdown of labour requirements and costs.

- **Quote ID**: Foreign key to quotes table
- **Site ID**: Optional foreign key to sites table (for site-specific plans)
- **Award Level**: Classification level (Level 1-3)
- **Employment Type**: Worker category (full-time, part-time, casual)
- **Weekday Hours**: Standard weekday hours
- **Weekend Hours**: Weekend hours
- **Public Holiday Hours**: Hours on public holidays
- **Weekday Rate**: Applied hourly rate for weekdays
- **Weekend Rate**: Applied hourly rate for weekends
- **Holiday Rate**: Applied hourly rate for public holidays
- **Allowances**: Additional payments required by award
- **Overtime Hours**: Expected overtime hours
- **Overtime Rate**: Applied overtime rate

### Quote Scope Items
Detailed breakdown of cleaning tasks with productivity-based calculations.

- **Quote ID**: Foreign key to quotes table
- **Site ID**: Foreign key to sites table
- **Task Type**: Type of cleaning activity (vacuum, mop, dust, etc.)
- **Area Type**: Surface or space type (carpet, hard floor, toilets, etc.)
- **Quantity**: Number of units (rooms, fixtures, area)
- **Unit Type**: Measurement unit (sqm, fixture, room)
- **Frequency**: How often task is performed (daily, weekly, monthly)
- **Productivity Rate**: Square meters per hour or time per unit
- **Calculated Hours**: Total hours based on productivity and quantity
- **Shift ID**: Reference to shift classification for rate determination
- **Award Level**: Level of cleaner required (Level 1-3)
- **Employment Type**: Type of employment (full-time, part-time, casual)
- **Allowances**: Array of applicable allowances
- **Notes**: Task-specific notes

### Costing Configurations
System configuration for award rates, productivity standards, and calculation parameters.

- **Config ID**: Unique identifier
- **Effective Date**: When configuration becomes active
- **Award Matrix**: JSON structure mapping award levels, employment types and shift patterns to rates
- **Allowance Rates**: JSON structure of allowance types and amounts
- **Productivity Standards**: Default productivity rates by task and area type
- **Overhead Defaults**: Default overhead percentages by quote type
- **CPI Rate**: Current CPI rate for projections
- **Public Holiday Dates**: List of public holidays for rate calculations
