
# Commercial Cleaning Quoting Module

## Overview
The Commercial Cleaning Quoting Module is a comprehensive tool within the Aussie Clean ERP system designed to generate accurate labour cost estimates, pricing, and profitability metrics for multi-site cleaning proposals. Specifically tailored for the Australian market, it leverages ISSA productivity benchmarks and is fully compliant with MA000022 (Cleaning Services Award).

## Core Components
- Quote Management
- Labour Cost Calculation
- Site-Specific Configurations 
- Productivity Standards
- Award Compliance Integration
- Margin Calculation & Pricing
- Approval Workflows

## Quick Links
- [Quote Data Model](./quoting/QUOTE_DATA_MODEL.md)
- [Business Rules](./quoting/BUSINESS_RULES.md)
- [UI Components](./quoting/UI_COMPONENTS.md)
- [Integration Points](./quoting/INTEGRATION_POINTS.md)
- [Reports & Analytics](./quoting/REPORTS_ANALYTICS.md)

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

## Future Enhancements
- Overtime Auto-Detection
- Shift Scheduler Simulation
- Staff Rostering Preview
- Task-Time Tuning with ML
- AI-Powered Optimization Suggestions
- Interactive Client Portal
