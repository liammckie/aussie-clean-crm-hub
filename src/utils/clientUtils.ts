
import { ClientFormData } from '@/services/client.service';
import { validationService } from '@/services/validation.service';

/**
 * Prepare client data for submission by cleaning/formatting fields
 */
export const prepareClientDataForSubmission = (data: ClientFormData): ClientFormData => {
  return {
    ...data,
    // Clean business identifiers
    abn: data.abn ? validationService.cleanBusinessIdentifier(data.abn) : null,
    acn: data.acn ? validationService.cleanBusinessIdentifier(data.acn) : null,
    // Ensure nullable fields are properly handled
    trading_name: data.trading_name || null,
    industry: data.industry || null,
    source: data.source || null,
    onboarding_date: data.onboarding_date || null,
    billing_cycle: data.billing_cycle || null,
    payment_terms: data.payment_terms || null,
    payment_method: data.payment_method || null,
    tax_status: data.tax_status || null,
    credit_limit: data.credit_limit || null
  };
};

/**
 * Format client data for display
 */
export const formatClientDataForDisplay = (client: any) => {
  if (!client) return null;
  
  return {
    ...client,
    // Format business identifiers for display
    abn: client.abn ? validationService.formatABN(client.abn) : null,
    acn: client.acn ? validationService.formatACN(client.acn) : null,
    // Format dates if needed
    onboarding_date: client.onboarding_date 
      ? new Date(client.onboarding_date).toLocaleDateString() 
      : null
  };
};

/**
 * Validate client data
 */
export const validateClientData = (data: ClientFormData) => {
  const errors: Record<string, string> = {};
  
  // Validate ABN if provided
  if (data.abn) {
    const cleanABN = validationService.cleanBusinessIdentifier(data.abn);
    if (!validationService.isValidABN(cleanABN)) {
      errors.abn = 'Invalid ABN format or checksum';
    }
  }
  
  // Validate ACN if provided
  if (data.acn) {
    const cleanACN = validationService.cleanBusinessIdentifier(data.acn);
    if (!validationService.isValidACN(cleanACN)) {
      errors.acn = 'Invalid ACN format or checksum';
    }
  }
  
  // Required fields
  if (!data.business_name || data.business_name.trim() === '') {
    errors.business_name = 'Business name is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
