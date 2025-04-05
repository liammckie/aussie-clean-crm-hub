
import { ClientFormData } from '@/services/client/types';
import { validationService } from '@/services/validation.service';

/**
 * Prepare client data for submission by cleaning/formatting fields
 */
export const prepareClientDataForSubmission = (data: ClientFormData): Record<string, any> => {
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
 * Validate client data for business rules compliance
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

/**
 * Function to check and validate business identifiers
 */
export const validateBusinessIdentifiers = (client: Pick<ClientFormData, 'abn' | 'acn'>): ValidationErrorResponse | null => {
  // ABN validation (if provided)
  if (client.abn) {
    const cleanABN = validationService.cleanBusinessIdentifier(client.abn);
    if (!validationService.isValidABN(cleanABN)) {
      return {
        category: 'validation',
        message: 'Invalid ABN provided. Please check and try again.',
        details: { field: 'abn' }
      };
    }
  }
  
  // ACN validation (if provided)
  if (client.acn) {
    const cleanACN = validationService.cleanBusinessIdentifier(client.acn);
    if (!validationService.isValidACN(cleanACN)) {
      return {
        category: 'validation',
        message: 'Invalid ACN provided. Please check and try again.',
        details: { field: 'acn' }
      };
    }
  }

  return null;
};
