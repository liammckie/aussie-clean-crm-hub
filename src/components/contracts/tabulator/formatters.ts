
import { formatCurrency } from '@/utils/formatters';

/**
 * Format financial values to currency
 */
export const formatMoneyColumn = (cell: any) => {
  const value = cell.getValue();
  return formatCurrency(value);
};

/**
 * Creates a group header with financial summaries
 */
export const createGroupHeader = (value: string, count: number, data: any[]) => {
  let totalWeekly = 0;
  let totalMonthly = 0;
  let totalAnnual = 0;

  data.forEach((row: any) => {
    totalWeekly += parseFloat(row.total_weekly_value || 0);
    totalMonthly += parseFloat(row.total_monthly_value || 0);
    totalAnnual += parseFloat(row.total_annual_value || 0);
  });

  return `${value || 'Not Specified'} | Contracts: ${count} | Weekly: ${formatCurrency(totalWeekly)} | Monthly: ${formatCurrency(totalMonthly)} | Annual: ${formatCurrency(totalAnnual)}`;
};
