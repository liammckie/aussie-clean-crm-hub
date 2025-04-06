
import { ClientFormData } from "@/services/client";
import { validationService } from "@/services/validation.service";
import { validateContactInfo } from "./db-type-helpers";

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
 * Prepares client data for submission to the API
 * - Cleans business identifiers
 * - Formats dates
 * - Validates required fields match database schema
 * - Validates contact information
 */
export function prepareClientDataForSubmission(data: ClientFormData): ClientFormData {
  // Create a new object to avoid mutating the original
  const preparedData: ClientFormData = { ...data };

  // Clean business identifiers
  if (preparedData.abn) {
    preparedData.abn = validationService.cleanBusinessIdentifier(preparedData.abn);
  }

  if (preparedData.acn) {
    preparedData.acn = validationService.cleanBusinessIdentifier(preparedData.acn);
  }

  // Clean phone field if present
  if (preparedData.phone) {
    preparedData.phone = preparedData.phone.trim();
  }

  // Ensure required fields have values to match database schema
  if (!preparedData.status) {
    preparedData.status = 'Prospect';
  }

  // Handle onboarding date
  if (!preparedData.onboarding_date) {
    // Set current date if not provided
    const today = new Date();
    preparedData.onboarding_date = today.toISOString().split('T')[0];
  } else if (typeof preparedData.onboarding_date === 'string') {
    // Ensure date is in YYYY-MM-DD format for database
    try {
      // Check if the string is already in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(preparedData.onboarding_date)) {
        // It's already in the correct format
      } else {
        const dateObj = new Date(preparedData.onboarding_date);
        if (!isNaN(dateObj.getTime())) {
          preparedData.onboarding_date = dateObj.toISOString().split('T')[0];
        } else {
          console.warn('Invalid date format for onboarding_date:', preparedData.onboarding_date);
          // If date parsing fails, use current date
          const today = new Date();
          preparedData.onboarding_date = today.toISOString().split('T')[0];
        }
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      // If date parsing fails, use current date
      const today = new Date();
      preparedData.onboarding_date = today.toISOString().split('T')[0];
    }
  }

  // Ensure country has a default value
  if (!preparedData.country) {
    preparedData.country = 'Australia';
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
    onboarding_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
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
    phone: '+61 2 9876 5432', // Added sample phone
    address: 'Corporate Park, Building C', // Added sample address
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
