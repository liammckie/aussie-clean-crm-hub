
import { isValidABN, isValidACN, formatABN } from '@/utils/validators';

/**
 * ValidationService - Provides validation functions for business identifiers
 */
export const validationService = {
  /**
   * Validates an Australian Business Number (ABN)
   * @param abn The ABN to validate
   * @returns Validation result with an optional error message
   */
  validateABN(abn: string | null | undefined): { valid: boolean; error?: string } {
    if (!abn) {
      return { valid: true }; // ABN is optional in our system
    }
    
    const cleanABN = abn.replace(/\s/g, '');
    if (!isValidABN(cleanABN)) {
      return { 
        valid: false, 
        error: 'Invalid ABN format. Please enter a valid 11-digit ABN.' 
      };
    }
    
    return { valid: true };
  },

  /**
   * Validates an Australian Company Number (ACN)
   * @param acn The ACN to validate
   * @returns Validation result with an optional error message
   */
  validateACN(acn: string | null | undefined): { valid: boolean; error?: string } {
    if (!acn) {
      return { valid: true }; // ACN is optional in our system
    }
    
    const cleanACN = acn.replace(/\s/g, '');
    if (!isValidACN(cleanACN)) {
      return { 
        valid: false, 
        error: 'Invalid ACN format. Please enter a valid 9-digit ACN.' 
      };
    }
    
    return { valid: true };
  },

  /**
   * Formats business identifiers for display and storage
   */
  formatBusinessIdentifiers(data: { 
    abn?: string | null; 
    acn?: string | null;
  }): { 
    abn?: string | null; 
    acn?: string | null;
  } {
    const formatted = { ...data };
    
    if (formatted.abn) {
      formatted.abn = formatABN(formatted.abn);
    }
    
    if (formatted.acn) {
      // Format ACN as XX XXX XXX
      const cleanACN = formatted.acn.replace(/\s/g, '');
      if (cleanACN.length === 9) {
        formatted.acn = `${cleanACN.slice(0, 2)} ${cleanACN.slice(2, 5)} ${cleanACN.slice(5)}`;
      }
    }
    
    return formatted;
  }
};
