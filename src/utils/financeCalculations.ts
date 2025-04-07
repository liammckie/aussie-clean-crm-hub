
/**
 * Finance calculation utilities for revenue, cost and profit calculations
 */

/**
 * Calculate profit amount from revenue and cost
 */
export function calculateProfit(revenue: number, cost: number): number {
  return revenue - cost;
}

/**
 * Calculate profit margin percentage
 * @returns Profit margin as a percentage (0-100)
 */
export function calculateProfitMargin(revenue: number, cost: number): number {
  if (!revenue || revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}

/**
 * Calculate monthly value from weekly value
 */
export function weeklyToMonthly(weeklyValue: number): number {
  return (weeklyValue * 52) / 12;
}

/**
 * Calculate annual value from weekly value
 */
export function weeklyToAnnual(weeklyValue: number): number {
  return weeklyValue * 52;
}

/**
 * Calculate weekly value from monthly value
 */
export function monthlyToWeekly(monthlyValue: number): number {
  return (monthlyValue * 12) / 52;
}

/**
 * Calculate weekly value from annual value
 */
export function annualToWeekly(annualValue: number): number {
  return annualValue / 52;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null) return '0%';
  return new Intl.NumberFormat('en-AU', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

/**
 * Calculate revenue/cost breakdown by frequency
 */
export interface FinancialBreakdown {
  weekly: {
    revenue: number;
    cost: number;
    profit: number;
    marginPercentage: number;
  };
  monthly: {
    revenue: number;
    cost: number;
    profit: number;
    marginPercentage: number;
  };
  annual: {
    revenue: number;
    cost: number;
    profit: number;
    marginPercentage: number;
  };
}

/**
 * Generate a complete financial breakdown from weekly values
 */
export function generateFinancialBreakdown(weeklyRevenue: number, weeklyCost: number): FinancialBreakdown {
  const weeklyProfit = calculateProfit(weeklyRevenue, weeklyCost);
  const weeklyMargin = calculateProfitMargin(weeklyRevenue, weeklyCost);
  
  const monthlyRevenue = weeklyToMonthly(weeklyRevenue);
  const monthlyCost = weeklyToMonthly(weeklyCost);
  const monthlyProfit = calculateProfit(monthlyRevenue, monthlyCost);
  const monthlyMargin = calculateProfitMargin(monthlyRevenue, monthlyCost);
  
  const annualRevenue = weeklyToAnnual(weeklyRevenue);
  const annualCost = weeklyToAnnual(weeklyCost);
  const annualProfit = calculateProfit(annualRevenue, annualCost);
  const annualMargin = calculateProfitMargin(annualRevenue, annualCost);
  
  return {
    weekly: {
      revenue: weeklyRevenue,
      cost: weeklyCost,
      profit: weeklyProfit,
      marginPercentage: weeklyMargin
    },
    monthly: {
      revenue: monthlyRevenue,
      cost: monthlyCost,
      profit: monthlyProfit,
      marginPercentage: monthlyMargin
    },
    annual: {
      revenue: annualRevenue,
      cost: annualCost,
      profit: annualProfit,
      marginPercentage: annualMargin
    }
  };
}
