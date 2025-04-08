
/**
 * Format a number as currency
 * @param value The value to format
 * @param currency The currency code (default: AUD)
 * @param locale The locale to use for formatting (default: en-AU)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | undefined, currency: string = 'AUD', locale: string = 'en-AU'): string => {
  if (value === undefined || isNaN(value)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a percentage value
 * @param value The value to format (e.g., 0.25 for 25%)
 * @param decimals Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  if (isNaN(value)) {
    return '0%';
  }
  
  // Multiply by 100 to convert decimal to percentage
  const percentage = value * 100;
  
  return new Intl.NumberFormat('en-AU', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Calculate gross profit from revenue and cost
 * @param revenue Total revenue
 * @param cost Total cost
 * @returns Gross profit amount
 */
export const calculateGrossProfit = (revenue: number, cost: number): number => {
  return revenue - cost;
};

/**
 * Calculate gross profit margin as a decimal
 * @param revenue Total revenue
 * @param cost Total cost
 * @returns Gross profit margin as a decimal (e.g., 0.25 for 25%)
 */
export const calculateGrossProfitMargin = (revenue: number, cost: number): number => {
  if (revenue === 0) return 0;
  return (revenue - cost) / revenue;
};

/**
 * Calculate the amortized monthly value from an annual value
 * @param annualValue The annual value
 * @returns Monthly value
 */
export const calculateMonthlyFromAnnual = (annualValue: number): number => {
  return annualValue / 12;
};

/**
 * Calculate the amortized weekly value from an annual value
 * @param annualValue The annual value
 * @returns Weekly value
 */
export const calculateWeeklyFromAnnual = (annualValue: number): number => {
  return annualValue / 52;
};

/**
 * Financial metrics data structure
 */
export interface FinancialMetrics {
  revenue: number;
  cost: number;
  profit: number;
  marginPercentage: number;
}

/**
 * Financial breakdown structure with weekly, monthly, and annual metrics
 */
export interface FinancialBreakdown {
  weekly: FinancialMetrics;
  monthly: FinancialMetrics;
  annual: FinancialMetrics;
}

/**
 * Generate financial breakdown from weekly revenue and cost
 * @param weeklyRevenue Weekly revenue amount
 * @param weeklyCost Weekly cost amount
 * @returns Financial breakdown with weekly, monthly, and annual metrics
 */
export const generateFinancialBreakdown = (weeklyRevenue: number, weeklyCost: number): FinancialBreakdown => {
  // Weekly calculations
  const weeklyProfit = calculateGrossProfit(weeklyRevenue, weeklyCost);
  const weeklyMargin = calculateGrossProfitMargin(weeklyRevenue, weeklyCost);
  
  // Monthly calculations (assuming 4.33 weeks per month on average)
  const monthlyRevenue = weeklyRevenue * 4.33;
  const monthlyCost = weeklyCost * 4.33;
  const monthlyProfit = calculateGrossProfit(monthlyRevenue, monthlyCost);
  const monthlyMargin = calculateGrossProfitMargin(monthlyRevenue, monthlyCost);
  
  // Annual calculations (52 weeks per year)
  const annualRevenue = weeklyRevenue * 52;
  const annualCost = weeklyCost * 52;
  const annualProfit = calculateGrossProfit(annualRevenue, annualCost);
  const annualMargin = calculateGrossProfitMargin(annualRevenue, annualCost);
  
  return {
    weekly: {
      revenue: weeklyRevenue,
      cost: weeklyCost,
      profit: weeklyProfit,
      marginPercentage: weeklyMargin * 100
    },
    monthly: {
      revenue: monthlyRevenue,
      cost: monthlyCost,
      profit: monthlyProfit,
      marginPercentage: monthlyMargin * 100
    },
    annual: {
      revenue: annualRevenue,
      cost: annualCost,
      profit: annualProfit,
      marginPercentage: annualMargin * 100
    }
  };
};
