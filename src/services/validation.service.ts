
import { isValidABN, isValidACN, formatABN } from '@/utils/validators';

/**
 * Service for handling validation of business data
 */
export const validationService = {
  /**
   * Validate an Australian Business Number (ABN)
   */
  validateABN: (abn: string | null | undefined) => {
    // If ABN is not provided, it's valid (since it's optional)
    if (!abn) return { valid: true };
    
    // Validate the ABN format
    if (!isValidABN(abn)) {
      return { 
        valid: false, 
        error: 'Invalid ABN - please enter an 11-digit number with valid checksum' 
      };
    }
    
    return { valid: true };
  },
  
  /**
   * Validate an Australian Company Number (ACN)
   */
  validateACN: (acn: string | null | undefined) => {
    // If ACN is not provided, it's valid (since it's optional)
    if (!acn) return { valid: true };
    
    // Validate the ACN format
    if (!isValidACN(acn)) {
      return { 
        valid: false, 
        error: 'Invalid ACN - please enter a 9-digit number with valid checksum' 
      };
    }
    
    return { valid: true };
  },
  
  /**
   * Format business identifiers (ABN/ACN) in a consistent way
   */
  formatBusinessIdentifiers: (data: any) => {
    const result = { ...data };
    
    // Format ABN if present
    if (data.abn) {
      result.abn = formatABN(data.abn);
    }
    
    // Format ACN if present - add spaces after positions 2 and 5
    if (data.acn) {
      const clean = data.acn.replace(/\s/g, '');
      if (clean.length === 9) {
        result.acn = `${clean.substring(0, 2)} ${clean.substring(2, 5)} ${clean.substring(5)}`;
      }
    }
    
    return result;
  }
};
