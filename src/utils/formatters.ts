
/**
 * Format number as currency
 * @param value Number to format as currency
 * @param currency Currency code (default: AUD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string | null | undefined, currency = 'AUD'): string {
  if (value === null || value === undefined) return '$0.00';
  
  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Return formatted currency
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}

/**
 * Format date to local format
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format percentage
 * @param value Number to format as percentage
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0%';
  
  return `${value}%`;
}

/**
 * Format a number with thousands separators
 * @param value Number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0';
  
  return new Intl.NumberFormat('en-AU').format(value);
}
