
/**
 * Format date to display format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format currency number
 * @param value Number value to format as currency
 * @param currency Currency code (default: AUD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | null | undefined, currency = 'AUD'): string {
  if (value === null || value === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(value);
}

/**
 * Format percentage value
 * @param value Number value to format as percentage
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0%';
  
  return `${value}%`;
}
