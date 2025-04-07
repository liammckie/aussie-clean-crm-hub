
# Financial Module Documentation

## Overview
The Financial Module in our ERP system provides comprehensive financial analysis at multiple entity levels (Client, Site, Contract). It delivers accurate, real-time financial insights while maintaining data consistency throughout the system.

## Key Features

### 1. Multi-Level Financial Reporting
The system supports financial reporting at three hierarchical levels:

- **Contract Level**: Most granular financial view with direct revenue and costs for individual service agreements
- **Site Level**: Aggregated view of all contracts at a physical location
- **Client Level**: Consolidated view of all sites and contracts for a client

### 2. Profit & Loss Analysis
Each level includes:
- Revenue tracking
- Cost analysis
- Profit margin calculations
- Comparative performance metrics

### 3. Financial Calculations

Financial calculations are standardized across the system using the `financeCalculations.ts` utility:

```typescript
// Weekly base values
const weeklyRevenue = 2500;
const weeklyCost = 1750;

// Generate breakdowns for all time periods
const financials = generateFinancialBreakdown(weeklyRevenue, weeklyCost);

// Access values
console.log(financials.weekly.profit); // Weekly profit
console.log(financials.monthly.marginPercentage); // Monthly margin %
console.log(financials.annual.revenue); // Annual revenue
```

### 4. Financial Components

**FinancialSummaryCard**
- Displays revenue, cost, and profit metrics
- Supports weekly, monthly, and annual views
- Color-coded profit metrics
- Optional loading state

**ClientFinancialMetrics**
- Focused on client-specific financial metrics
- Shows site count, revenue, cost, and profit
- Designed for client detail pages

## Implementation Guide

### Adding Financial Data to a Page

```tsx
import { FinancialSummaryCard } from '@/components/financial/FinancialSummaryCard';
import { generateFinancialBreakdown } from '@/utils/financeCalculations';

// Get financial data from API or calculate it
const weeklyRevenue = contract.total_weekly_value || 0;
const weeklyCost = contract.supplier_cost_weekly || 0;
const financialMetrics = generateFinancialBreakdown(weeklyRevenue, weeklyCost);

// Use the component
<FinancialSummaryCard
  title="Contract Financial Summary"
  weekly={financialMetrics.weekly}
  monthly={financialMetrics.monthly}
  annual={financialMetrics.annual}
/>
```

### Future Development

Planned enhancements for the Financial Module:
- Integration with accounting software (Xero, MYOB)
- Cash flow forecasting
- Budget vs. actual analysis
- Financial trend charts and projections
- Custom reporting periods
