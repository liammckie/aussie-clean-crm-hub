
# Labour Costing

## Award Application
The labour costing module applies the appropriate award rates from MA000022 (Cleaning Services Award) based on various factors.

## Rate Structure

### Base Classification Rates
| Level | Classification | Description | Base Hourly Rate |
|-------|---------------|-------------|-----------------|
| 1 | Cleaning Service Employee Level 1 | Standard cleaning duties | $24.10 |
| 2 | Cleaning Service Employee Level 2 | Specialized cleaning duties | $25.01 |
| 3 | Cleaning Service Employee Level 3 | Supervisory duties | $26.24 |

### Penalty Rates
Penalty rates are applied as multipliers to the base rate:

| Time Period | Monday-Friday | Saturday | Sunday | Public Holiday |
|-------------|--------------|----------|--------|---------------|
| 6am-6pm | 1.0 | 1.5 | 2.0 | 2.5 |
| 6pm-12am | 1.15 | 1.5 | 2.0 | 2.5 |
| 12am-6am | 1.3 | 1.5 | 2.0 | 2.5 |

### Employment Type Factors
Different employment types receive different rates:

| Employment Type | Factor Description |
|-----------------|-------------------|
| Full-time | Base rate + applicable penalties |
| Part-time | Base rate + applicable penalties |
| Casual | Base rate + 25% casual loading + applicable penalties |

## Allowance Application

### Mandatory Allowances
These allowances are automatically applied when relevant conditions are met:
- Toilet cleaning allowance: $3.41 per shift
- Refuse collection allowance: $4.33 per shift
- First aid allowance: $15.56 per week
- Leading hand allowance: $1.03 per hour (3-10 employees)

### Optional Allowances
These allowances can be manually selected:
- Cold work disability allowance: $3.71 per shift
- Hot work disability allowance: $0.72-$1.01 per hour
- Height work allowance: $0.87-$2.75 per hour
- Broken shift allowance: $4.80 per day
- Meal allowance: $14.78 per occasion

## Shift Definition
Labour costs are organized into shifts with:
- Start and end times
- Day of week
- Recurring pattern (daily, weekly, etc.)
- Required classifications

## Overhead Application
Labour costs are increased by:
- Superannuation: 11% of base wages
- Workers compensation: 2.5-4.5% (state-dependent)
- Payroll tax: 4.75-6.85% (state-dependent)
- Leave loading: 17.5% of leave accrual
- Administration: 5-10% (configurable)
