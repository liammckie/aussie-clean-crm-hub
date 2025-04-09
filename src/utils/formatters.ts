import { UnifiedAddressRecord } from '@/services/unified/types';

/**
 * Format an address record into an array of display lines
 * @param address Address record to format
 * @returns Array of address lines
 */
export function formatAddressDisplay(address: UnifiedAddressRecord): string[] {
  const lines: string[] = [];

  if (address.address_line_1) {
    lines.push(address.address_line_1);
  }

  if (address.address_line_2) {
    lines.push(address.address_line_2);
  }

  const cityLine: string[] = [];
  if (address.suburb) {
    cityLine.push(address.suburb);
  }
  if (address.state) {
    cityLine.push(address.state);
  }
  if (address.postcode) {
    cityLine.push(address.postcode);
  }

  if (cityLine.length > 0) {
    lines.push(cityLine.join(' '));
  }

  if (address.country && address.country !== 'Australia') {
    lines.push(address.country);
  }

  return lines;
}

/**
 * Format an address record into a single line
 * @param address Address record to format
 * @returns Single line address string
 */
export function formatAddressOneLine(address?: Partial<UnifiedAddressRecord>): string {
  if (!address) return '';

  const parts: string[] = [];

  if (address.address_line_1) {
    parts.push(address.address_line_1);
  }

  if (address.suburb) {
    parts.push(address.suburb);
  }

  if (address.state) {
    parts.push(address.state);
  }

  if (parts.length === 0) return '';

  return parts.join(', ');
}

/**
 * Format a currency value with a specified locale and currency code
 * @param value Number to format
 * @param locale Locale to use for formatting (default: 'en-AU')
 * @param currency Currency code to use (default: 'AUD')
 * @returns Formatted currency string
 */
export function formatCurrency(value?: number | null, locale: string = 'en-AU', currency: string = 'AUD'): string {
  if (value === undefined || value === null) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
