
# Business Rules

## Calculation Logic

### 1. Task-Based Time Calculation
- Each cleaning task has an associated productivity rate (area per hour or time per unit)
- System calculates required hours based on area/units and productivity rate
- Adjustments for frequency (daily, weekly, monthly) are applied
- Site-level totals are aggregated from task-level calculations

### 2. Award-Based Labour Costing
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

### 3. Allowance Application
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

### 4. Pricing Determination
- Cost basis is established from labour + equipment + overheads
- Margin is applied according to selected strategy:
  - Fixed percentage markup
  - Tiered margin based on quote value
  - Target profit amount
- System calculates final price with breakdown by site

## Validation Rules

### 1. Quote Completion Requirements
- All sites must have at least one scope item
- Labour plans must be defined for all required shift types
- Pricing strategy must be selected before finalization
- Expiry date must be in the future

### 2. Productivity Standards
- System flags significant deviations from standard productivity rates
- Override requires explanation note
- Historical comparison with similar sites is presented when available

### 3. Margin Compliance
- Minimum margin thresholds can be enforced based on quote type
- Approvals required for quotes below target margins
- Maximum discount percentages enforced by role permissions
