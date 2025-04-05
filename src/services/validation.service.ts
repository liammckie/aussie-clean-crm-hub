
/**
 * Service for validating and formatting business identifiers
 */
export const validationService = {
  /**
   * Validates an Australian Business Number (ABN)
   * @param abn - The ABN to validate
   * @returns True if the ABN is valid, false otherwise
   */
  isValidABN: (abn: string | null | undefined): boolean => {
    if (!abn) return false;
    
    // Remove spaces and ensure it's 11 digits
    const cleanABN = abn.replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleanABN)) return false;
    
    // ABN validation algorithm
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    
    // Subtract 1 from the first digit for the check calculation
    const digits = cleanABN.split('').map(d => parseInt(d));
    digits[0] -= 1;
    
    // Calculate checksum
    const sum = weights.reduce((acc, weight, i) => acc + weight * digits[i], 0);
    
    // Valid if divisible by 89
    return sum % 89 === 0;
  },
  
  /**
   * Validates an Australian Company Number (ACN)
   * @param acn - The ACN to validate
   * @returns True if the ACN is valid, false otherwise
   */
  isValidACN: (acn: string | null | undefined): boolean => {
    if (!acn) return true; // ACN is optional, so null/undefined is acceptable
    
    // Remove spaces and check length
    const cleanACN = acn.replace(/\s/g, '');
    if (!/^\d{9}$/.test(cleanACN)) return false;
    
    // ACN validation algorithm
    const weights = [8, 7, 6, 5, 4, 3, 2, 1];
    const digits = cleanACN.slice(0, 8).split('').map(d => parseInt(d));
    
    // Calculate weighted sum
    const sum = weights.reduce((acc, weight, i) => acc + weight * digits[i], 0);
    
    // Calculate check digit (last digit)
    const remainder = sum % 10;
    const checkDigit = remainder === 0 ? 0 : 10 - remainder;
    
    // Compare with the calculated check digit
    return checkDigit === parseInt(cleanACN[8]);
  },
  
  /**
   * Formats an ABN with proper spacing for readability
   * Format: XX XXX XXX XXX
   * @param abn - The ABN to format
   * @returns Formatted ABN string
   */
  formatABN: (abn: string | null | undefined): string | null => {
    if (!abn) return null;
    
    const cleanABN = abn.replace(/\s/g, '');
    if (cleanABN.length !== 11) return cleanABN;
    
    return `${cleanABN.slice(0, 2)} ${cleanABN.slice(2, 5)} ${cleanABN.slice(5, 8)} ${cleanABN.slice(8, 11)}`;
  },
  
  /**
   * Formats an ACN by adding spaces for readability
   * Format: XXX XXX XXX
   * @param acn - The ACN to format
   * @returns Formatted ACN string
   */
  formatACN: (acn: string | null | undefined): string | null => {
    if (!acn) return null;
    
    const cleanACN = acn.replace(/\s/g, '');
    if (cleanACN.length !== 9) return cleanACN;
    
    return `${cleanACN.slice(0, 3)} ${cleanACN.slice(3, 6)} ${cleanACN.slice(6, 9)}`;
  },
  
  /**
   * Cleans an ABN or ACN by removing spaces and non-numeric characters
   * @param value - The value to clean
   * @returns Cleaned string with only digits
   */
  cleanBusinessIdentifier: (value: string | null | undefined): string | null => {
    if (!value) return null;
    return value.replace(/[^\d]/g, '');
  },
  
  /**
   * Validates ABN and returns a result object with validation status and error message
   * @param abn - The ABN to validate
   * @returns Validation result object
   */
  validateABN: (abn: string | null | undefined) => {
    if (!abn || abn.trim() === '') {
      return { valid: true }; // ABN is optional
    }
    
    const isValid = validationService.isValidABN(abn);
    return {
      valid: isValid,
      error: isValid ? undefined : 'Invalid ABN format or checksum'
    };
  },
  
  /**
   * Validates ACN and returns a result object with validation status and error message
   * @param acn - The ACN to validate
   * @returns Validation result object
   */
  validateACN: (acn: string | null | undefined) => {
    if (!acn || acn.trim() === '') {
      return { valid: true }; // ACN is optional
    }
    
    const isValid = validationService.isValidACN(acn);
    return {
      valid: isValid,
      error: isValid ? undefined : 'Invalid ACN format or checksum'
    };
  },
  
  /**
   * Formats business identifiers in an object
   * @param data - Object containing abn and/or acn fields
   * @returns New object with formatted identifiers
   */
  formatBusinessIdentifiers: (data: Record<string, any>) => {
    const result = { ...data };
    
    if (data.abn) {
      result.abn = validationService.formatABN(data.abn);
    }
    
    if (data.acn) {
      result.acn = validationService.formatACN(data.acn);
    }
    
    return result;
  }
};
