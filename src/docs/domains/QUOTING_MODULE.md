
# Commercial Cleaning Quoting Module

## Overview
The Commercial Cleaning Quoting Module is an internal tool within the Aussie Clean ERP system designed to generate accurate labour cost estimates, pricing, and profitability metrics for multi-site cleaning proposals. It is specifically tailored for the Australian market using ISSA productivity benchmarks, adjusted for local conditions, and compliant with MA000022 (Cleaning Services Award).

## Data Model

### Core Entities

#### Quote
The primary entity representing a commercial cleaning quote proposal.

##### Basic Information
- **Quote ID**: Unique identifier (UUID, Primary Key)
- **Quote Code**: Human-readable reference code
- **Client ID**: Foreign key reference to clients table
- **Status**: Current state (enum: draft, pending_approval, approved, declined, expired)
- **Created By**: Employee who created the quote
- **Creation Date**: When quote was initially created
- **Expiry Date**: Date when quote offer expires
- **Last Modified**: Timestamp of most recent update
- **Version Number**: Incremental counter for quote revisions

##### Financial Details
- **Total Value**: Calculated total quote value
- **Weekly Value**: Calculated weekly revenue
- **Annual Value**: Calculated annual revenue
- **Margin Strategy**: Approach to margin calculation (fixed percentage, tiered, target profit)
- **Target Margin**: Desired profit margin percentage
- **Overhead Rate**: Applied overhead percentage or flat amount
- **Equipment Allowance**: Additional costs for equipment
- **One-off Setup Costs**: Initial non-recurring costs
- **Notes**: Additional pricing considerations

#### Quote Site Items
Many-to-many relationship between quotes and individual sites with site-specific configuration.

- **Quote ID**: Foreign key to quotes table
- **Site ID**: Foreign key to sites table
- **Site Area**: Total cleanable area in square meters
- **Site Hours**: Calculated total cleaning hours
- **Site Value**: Calculated site-specific quote value
- **Site Frequency**: Visit frequency (daily, weekly, monthly)
- **Service Start Date**: Proposed commencement date
- **Notes**: Site-specific considerations

#### Labour Plans
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

#### Quote Scope Items
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

#### Costing Configurations
System configuration for award rates, productivity standards, and calculation parameters.

- **Config ID**: Unique identifier
- **Effective Date**: When configuration becomes active
- **Award Matrix**: JSON structure mapping award levels, employment types and shift patterns to rates
- **Allowance Rates**: JSON structure of allowance types and amounts
- **Productivity Standards**: Default productivity rates by task and area type
- **Overhead Defaults**: Default overhead percentages by quote type
- **CPI Rate**: Current CPI rate for projections
- **Public Holiday Dates**: List of public holidays for rate calculations

## Business Rules

### Calculation Logic
1. **Task-Based Time Calculation**:
   - Each cleaning task has an associated productivity rate (area per hour or time per unit)
   - System calculates required hours based on area/units and productivity rate
   - Adjustments for frequency (daily, weekly, monthly) are applied
   - Site-level totals are aggregated from task-level calculations

2. **Award-Based Labour Costing**:
   - Labour costs are calculated using the MA000022 (Cleaning Services Award) structure
   - System applies appropriate rates based on:
     - Shift timing (early morning, standard day, evening, night)
     - Day of week (Monday-Friday, Saturday, Sunday)
     - Public holiday designation
     - Employment type (full-time, part-time, casual)
     - Classification level (Level 1-3)
   - Penalty rates are applied for:
     - Early shifts starting before 6am
     - Late shifts ending after 6pm
     - Night shifts (midnight to 8am)
     - Weekend work (Saturday/Sunday differential rates)
     - Public holidays (2.5x multiplier or configured rate)

3. **Allowance Application**:
   - System applies mandatory allowances per award:
     - Toilet cleaning allowance ($3.41 per shift)
     - Refuse collection allowance ($4.33 per shift)
     - First aid allowance ($15.56 per week)
     - Travel allowance (calculated at shift rate)
   - Optional allowances can be manually included:
     - Uniform reimbursement
     - Height/hot/cold work allowances
     - Meal allowances
     - Vehicle allowances

4. **Pricing Determination**:
   - Cost basis is established from labour + equipment + overheads
   - Margin is applied according to selected strategy:
     - Fixed percentage markup
     - Tiered margin based on quote value
     - Target profit amount
   - System calculates final price with breakdown by site

### Validation Rules
1. **Quote Completion Requirements**:
   - All sites must have at least one scope item
   - Labour plans must be defined for all required shift types
   - Pricing strategy must be selected before finalization
   - Expiry date must be in the future

2. **Productivity Standards**:
   - System flags significant deviations from standard productivity rates
   - Override requires explanation note
   - Historical comparison with similar sites is presented when available

3. **Margin Compliance**:
   - Minimum margin thresholds can be enforced based on quote type
   - Approvals required for quotes below target margins
   - Maximum discount percentages enforced by role permissions

## Integration Points

### External Systems
- **SignNow/DocuSign**: Quote acceptance and digital signature
- **Zapier**: Workflow automation for quote approval and contract generation
- **Labor Standards Database**: Synchronization with latest award rates

### Internal Modules
- **Client Management**: Client record linkage for quotes
- **Site Management**: Site details and specifications
- **Contract Management**: Conversion of approved quotes to contracts
- **Scheduling**: Labour plan translation to staffing requirements
- **Financial Reporting**: Quote values feed into sales pipeline metrics

## User Interface Components

### Primary Views
1. **Quote List**:
   - Filterable grid of all quotes
   - Status indicators and quick actions
   - Grouping by client, value, or status

2. **Quote Builder Interface**:
   - Multi-step wizard for quote creation
   - Site selector with site details panel
   - Task configuration interface with productivity calculators
   - Shift assignment and rate visualization
   - Real-time cost and margin calculation
   - What-if scenario comparison tool

3. **Labour Planning Console**:
   - Visual breakdown of labour requirements
   - Shift allocation interface
   - Award compliance verification
   - Staff type distribution (FT/PT/Casual mix)
   - Cost breakdown by classification and shift type

4. **Quote Preview & Export**:
   - Client-ready quote format preview
   - Detailed vs. summary view options
   - PDF/Excel export functionality
   - Internal vs. client-facing variants

### Key Workflows
1. **Quote Creation Process**:
   - Client and sites selection
   - Scope definition with task breakdown
   - Labour planning and shift allocation
   - Pricing strategy and margin setting
   - Review and finalization

2. **Quote Approval Workflow**:
   - Initial draft saved by estimator
   - Review by sales manager for accuracy
   - Financial approval for margin compliance
   - Operations review for delivery feasibility
   - Final approval and client presentation

3. **Quote to Contract Conversion**:
   - Approved quote selection
   - Additional contract terms definition
   - Contract document generation
   - Client acceptance tracking
   - Activation and implementation handover

## Permission Model

| Role | Create | Edit | Delete | Approve | Set Margin | View Costs |
|------|--------|------|--------|---------|------------|------------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sales Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Estimator | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Sales Rep | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Operations | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Finance | ❌ | ✅ (pricing only) | ❌ | ✅ | ✅ | ✅ |
| Client | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Reports and Analytics

### Standard Reports
- **Quote Pipeline**: Overview of quotes by status and value
- **Conversion Rates**: Quote to contract conversion analysis
- **Margin Analysis**: Breakdown of quotes by profitability
- **Productivity Benchmarks**: Comparison of quoted vs. standard productivity rates
- **Labour Distribution**: Analysis of labour plans by shift type and classification

### Financial Analysis
- **Cost Structure Analysis**: Breakdown of quote costs by category
- **Margin Variance**: Comparison of actual vs. target margins
- **Price Per Square Meter**: Comparative pricing across similar sites
- **Client Pricing Trends**: Historical pricing analysis by client

## Implementation Considerations

### Performance Optimization
- Caching of productivity standards and award rates
- Background calculation of complex scenarios
- Optimized query patterns for quote retrieval and reporting

### Extensibility
- Configurable calculation rules for easy adaptation to award changes
- Modular task definitions for adding new cleaning activities
- Pluggable margin strategies for different pricing models

## Future Enhancements
- **Overtime Auto-Detection**: Intelligent flagging of likely overtime scenarios
- **Shift Scheduler Simulation**: Visual planning tool for real-life feasibility checks
- **Staff Rostering Preview**: Award-compliant staffing model visualization
- **Task-Time Tuning**: Machine learning adjustment of productivity rates based on actual performance data
- **AI-Powered Suggestions**: Automated comparison with similar past quotes for optimization opportunities
- **Interactive Client Portal**: Self-service quote request and approval platform
