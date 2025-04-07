
import { formatCurrency } from '@/utils/formatters';

/**
 * Format financial values to currency
 */
export const formatMoneyColumn = (cell: any) => {
  const value = cell.getValue();
  if (value === null || value === undefined) return '';
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

/**
 * Format status values with color-coded badges
 */
export const statusFormatter = (cell: any) => {
  const value = cell.getValue();
  if (!value) return '';
  
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-amber-100 text-amber-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    draft: 'bg-slate-100 text-slate-800',
    expired: 'bg-gray-100 text-gray-800'
  };
  
  const colorClass = statusColors[value.toLowerCase()] || 'bg-gray-100 text-gray-800';
  
  const badge = document.createElement('span');
  badge.className = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`;
  badge.textContent = value;
  
  return badge;
};

/**
 * Format date values
 */
export const dateFormatter = (cell: any) => {
  const value = cell.getValue();
  if (!value) return '';
  
  try {
    const date = new Date(value);
    return date.toLocaleDateString();
  } catch (e) {
    return value;
  }
};
