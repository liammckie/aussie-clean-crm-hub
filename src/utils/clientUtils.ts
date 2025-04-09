
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
    onboarding_date: onboarding_date,
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

/**
 * Prepare client data for form submission
 * @param formData Client form data
 * @returns Prepared client data
 */
export function prepareClientDataForSubmission(formData: any): Partial<ClientRecord> {
  return parseClientData(formData);
}

/**
 * Load sample client data for testing
 * @param callback Callback function to handle the sample data
 */
export function loadSampleClientData(callback: (data: any) => void): void {
  const sampleData = {
    business_name: 'Sample Business LLC',
    trading_name: 'Sample Trading',
    abn: '12345678901',
    acn: '123456789',
    industry: 'Technology',
    status: ClientStatus.ACTIVE,
    onboarding_date: new Date().toISOString().split('T')[0],
    source: 'Website',
    billing_cycle: 'Monthly',
    payment_terms: 'Net 30',
    payment_method: 'Direct Deposit',
    tax_status: 'GST Registered',
    credit_limit: 10000,
    address_line_1: '123 Sample St',
    address_line_2: 'Suite 101',
    suburb: 'Sample Suburb',
    state: 'VIC',
    postcode: '3000',
    country: 'Australia'
  };
  
  callback(sampleData);
}

/**
 * Validate business identifiers like ABN and ACN
 * @param abn Australian Business Number
 * @param acn Australian Company Number
 * @returns Object containing validation results
 */
export function validateBusinessIdentifiers(abn?: string, acn?: string) {
  const results = {
    isValidABN: true,
    isValidACN: true,
    abnMessage: '',
    acnMessage: ''
  };
  
  // Validate ABN if provided
  if (abn) {
    const cleanABN = abn.replace(/\s/g, '');
    results.isValidABN = /^\d{11}$/.test(cleanABN);
    if (!results.isValidABN) {
      results.abnMessage = 'ABN must be 11 digits';
    }
  }
  
  // Validate ACN if provided
  if (acn) {
    const cleanACN = acn.replace(/\s/g, '');
    results.isValidACN = /^\d{9}$/.test(cleanACN);
    if (!results.isValidACN) {
      results.acnMessage = 'ACN must be 9 digits';
    }
  }
  
  return results;
}

/**
 * Prepare client form data with defaults
 * @param initialData Initial client data
 * @returns Prepared form data
 */
export function prepareClientFormData(initialData?: any): any {
  return {
    business_name: initialData?.business_name || '',
    trading_name: initialData?.trading_name || '',
    abn: initialData?.abn || '',
    acn: initialData?.acn || '',
    industry: initialData?.industry || '',
    status: initialData?.status || ClientStatus.PROSPECT,
    onboarding_date: initialData?.onboarding_date 
      ? formatDate(initialData.onboarding_date) 
      : formatDate(new Date()),
    source: initialData?.source || '',
    billing_cycle: initialData?.billing_cycle || '',
    payment_terms: initialData?.payment_terms || '',
    payment_method: initialData?.payment_method || '',
    tax_status: initialData?.tax_status || '',
    credit_limit: initialData?.credit_limit !== undefined 
      ? Number(initialData.credit_limit) 
      : undefined,
    address_line_1: initialData?.address_line_1 || '',
    address_line_2: initialData?.address_line_2 || '',
    suburb: initialData?.suburb || '',
    state: initialData?.state || '',
    postcode: initialData?.postcode || '',
    country: initialData?.country || 'Australia',
  };
}
