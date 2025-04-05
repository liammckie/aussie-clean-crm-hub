
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

  // Format date if it's a Date object
  if (preparedData.onboarding_date instanceof Date) {
    preparedData.onboarding_date = preparedData.onboarding_date.toISOString().split('T')[0];
  }

  return preparedData;
}
