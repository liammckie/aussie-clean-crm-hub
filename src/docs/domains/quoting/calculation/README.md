
# Quote Calculation Engine

This directory contains detailed documentation on the calculation engine that powers the Quoting Module.

## Key Components

- [Productivity Standards](./PRODUCTIVITY_STANDARDS.md) - Time and area calculations
- [Labour Costing](./LABOUR_COSTING.md) - Award-based rate application
- [Margin Rules](./MARGIN_RULES.md) - Pricing strategies and margins

## Integration Points

The calculation engine connects to several key systems:

- Award Engine: For up-to-date award rates and classifications
- Productivity Database: For industry standard benchmarks
- Client Pricing History: For consistent pricing recommendations

## Calculation Flow

1. Task specification with areas/units
2. Productivity application to determine hours
3. Shift allocation and award rate application
4. Allowance and overhead addition
5. Margin application and final pricing
