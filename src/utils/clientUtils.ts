
import { ClientStatus } from '@/types/database-schema';
import { ClientRecord } from '@/types/database-schema';

/**
 * Format date string to YYYY-MM-DD
 * @param date Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | undefined): string | undefined {
  if (!date) return undefined;
  
  if (typeof date === 'string') {
    // Check if the string is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Parse the string to a Date object
    date = new Date(date);
  }
  
  // Format the date to YYYY-MM-DD
  return date instanceof Date ? date.toISOString().split('T')[0] : undefined;
}

/**
 * Parse client data from form submission
 * @param formData Client form data
 * @returns Parsed client data
 */
export function parseClientData(formData: any): Partial<ClientRecord> {
  // Format date values if needed
  const onboarding_date = formData.onboarding_date 
    ? formatDate(formData.onboarding_date)
    : undefined;

  return {
    business_name: formData.business_name,
    trading_name: formData.trading_name,
    abn: formData.abn,
    acn: formData.acn,
    industry: formData.industry,
    status: formData.status as ClientStatus,
    onboarding_date, // Use the formatted date string
    source: formData.source,
    billing_cycle: formData.billing_cycle,
    payment_terms: formData.payment_terms,
    payment_method: formData.payment_method,
    tax_status: formData.tax_status,
    credit_limit: formData.credit_limit ? Number(formData.credit_limit) : undefined,
    address_line_1: formData.address_line_1,
    address_line_2: formData.address_line_2,
    suburb: formData.suburb,
    state: formData.state,
    postcode: formData.postcode,
    country: formData.country || 'Australia'
  };
}

/**
 * Get client display name
 * @param client Client data
 * @returns Display name string
 */
export function getClientDisplayName(client: Partial<ClientRecord>): string {
  if (!client) return 'Unknown Client';
  
  if (client.trading_name && typeof client.trading_name === 'string' && client.trading_name.trim()) {
    return client.trading_name;
  }
  
  return client.business_name || 'Unnamed Client';
}
