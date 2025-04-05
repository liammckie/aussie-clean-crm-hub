import { ClientFormData } from "@/services/client";
import { validationService } from "@/services/validation.service";

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
 * Prepares client data for submission to the API
 * - Cleans business identifiers
 * - Formats dates
 */
export function prepareClientDataForSubmission(data: ClientFormData) {
  // Create a new object to avoid mutating the original
  const preparedData = { ...data };

  // Clean business identifiers
  if (preparedData.abn) {
    preparedData.abn = validationService.cleanBusinessIdentifier(preparedData.abn);
  }

  if (preparedData.acn) {
    preparedData.acn = validationService.cleanBusinessIdentifier(preparedData.acn);
  }

  // Format date if present
  // We check for string type because onboarding_date is typed as string | null
  if (preparedData.onboarding_date) {
    // If it's already a string in YYYY-MM-DD format, keep it as is
    if (typeof preparedData.onboarding_date === 'string' && preparedData.onboarding_date.includes('-')) {
      // Ensure the date is in YYYY-MM-DD format for the database
      try {
        const dateObj = new Date(preparedData.onboarding_date);
        if (!isNaN(dateObj.getTime())) {
          preparedData.onboarding_date = dateObj.toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error formatting date:', error);
        // Keep original value if date parsing fails
      }
    }
  }

  return preparedData;
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
    status: 'Prospect',
    onboarding_date: '2023-10-15',
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
  };

  setFormData(sampleClient);
}
