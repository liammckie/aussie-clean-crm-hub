
/**
 * Format a number as currency
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '$0.00';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  }).format(numValue);
}

/**
 * Format a date string to a localized format
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
