import { ClientFormData } from "@/services/client";
import { validationService } from "@/services/validation.service";
import { validateContactInfo } from "./db-type-helpers";
import { ClientStatus } from '@/types/database-schema';

/**
 * Validates business identifiers (ABN, ACN)
 * @returns Error object if validation fails, null if valid
 */
export function validateBusinessIdentifiers({ abn, acn }: { abn?: string, acn?: string }) {
  if (abn) {
    const abnValidation = validationService.validateABN(abn);
    if (!abnValidation.valid) {
      return {
        category: 'validation' as const,
        message: abnValidation.error || "Invalid ABN",
        details: { field: 'abn' }
      };
    }
  }

  if (acn) {
    const acnValidation = validationService.validateACN(acn);
    if (!acnValidation.valid) {
      return {
        category: 'validation' as const,
        message: acnValidation.error || "Invalid ACN",
        details: { field: 'acn' }
      };
    }
  }

  return null;
}

/**
 * Validates client contact information (phone, email)
 * @returns Error object if validation fails, null if valid
 */
export function validateClientContactInfo({ phone, email }: { phone?: string, email?: string }) {
  const validationError = validateContactInfo({ phone, email });
  
  if (validationError) {
    return {
      category: 'validation' as const,
      message: validationError.message,
      details: { field: validationError.field }
    };
  }
  
  return null;
}

/**
 * Prepare client data for submission to the API
 */
export const prepareClientDataForSubmission = (formData: ClientFormData): Partial<ClientRecord> => {
  // Start with a copy of the form data
  const preparedData: Partial<ClientRecord> = { ...formData };
  
  // Format date if present
  if (preparedData.onboarding_date instanceof Date) {
    preparedData.onboarding_date = preparedData.onboarding_date.toISOString().split('T')[0];
  }

  // Convert credit limit to number if present
  if (typeof preparedData.credit_limit === 'string' && preparedData.credit_limit !== '') {
    preparedData.credit_limit = parseFloat(preparedData.credit_limit);
  }

  // Remove any temporary or UI-only fields that shouldn't be sent to the API
  // These fields don't exist in the actual database schema
  const fieldsToDelete: (keyof Partial<ClientRecord>)[] = [
    // Any UI-only fields that should be excluded from API calls
  ];

  fieldsToDelete.forEach(field => {
    if (field in preparedData) {
      delete preparedData[field];
    }
  });

  return preparedData;
};

/**
 * Alias function for prepareClientDataForSubmission, used for form data preparation
 * @param data Client form data to prepare
 * @returns Prepared client form data
 */
export function prepareClientFormData(data: ClientFormData): ClientFormData {
  return prepareClientDataForSubmission(data);
}

/**
 * Loads a sample client into the form for testing
 * @param setFormData Function to set form data
 */
export function loadSampleClientData(setFormData: (data: ClientFormData) => void) {
  const sampleClient: ClientFormData = {
    business_name: 'Aussie Clean Enterprises',
    trading_name: 'ACE Cleaning Services',
    abn: '83 914 571 673',
    acn: '000 000 019',
    industry: 'Commercial Cleaning',
    status: ClientStatus.PROSPECT,
    onboarding_date: new Date().toISOString().split('T')[0],
    source: 'Trade Show',
    billing_cycle: 'Monthly',
    payment_terms: 'Net 30',
    payment_method: 'Direct Debit',
    tax_status: 'GST Registered',
    credit_limit: 15000,
    address_line_1: '123 Business Avenue',
    address_line_2: 'Level 5, Tower B',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    country: 'Australia',
    phone: '+61 2 9876 5432',
    address: 'Corporate Park, Building C',
  };

  setFormData(sampleClient);
}

/**
 * Format a date string or Date object to display format (DD/MM/YYYY)
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDisplayDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('en-AU', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '';
  }
}
