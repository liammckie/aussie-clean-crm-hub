
/**
 * Validates an Australian Business Number (ABN)
 * @param abn The ABN to validate
 * @returns True if the ABN is valid, false otherwise
 */
export function isValidABN(abn: string): boolean {
  // Remove spaces and check length
  const cleanABN = abn.replace(/\s/g, '');
  if (cleanABN.length !== 11 || !/^\d+$/.test(cleanABN)) {
    return false;
  }

  // ABN validation algorithm - weights used for the check
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  
  // Subtract 1 from first digit
  const digits = cleanABN.split('').map(Number);
  const first = digits[0] - 1;
  
  // Calculate the weighted sum
  let sum = first * weights[0];
  for (let i = 1; i < 11; i++) {
    sum += digits[i] * weights[i];
  }

  // Valid if the sum is divisible by 89
  return sum % 89 === 0;
}

/**
 * Validates an Australian Company Number (ACN)
 * @param acn The ACN to validate
 * @returns True if the ACN is valid, false otherwise
 */
export function isValidACN(acn: string): boolean {
  // Remove spaces and check length
  const cleanACN = acn.replace(/\s/g, '');
  if (cleanACN.length !== 9 || !/^\d+$/.test(cleanACN)) {
    return false;
  }

  // ACN validation algorithm
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  
  // Calculate the weighted sum
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleanACN[i]) * weights[i];
  }
  
  // Calculate the check digit
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;
  
  // Compare calculated check digit with the provided check digit
  return checkDigit === parseInt(cleanACN[8]);
}

/**
 * Formats an ABN with proper spacing for display
 * @param abn The ABN to format
 * @returns Formatted ABN string
 */
export function formatABN(abn: string): string {
  const cleanABN = abn.replace(/\s/g, '');
  if (cleanABN.length !== 11) return abn;
  
  // Format as XX XXX XXX XXX
  return `${cleanABN.slice(0, 2)} ${cleanABN.slice(2, 5)} ${cleanABN.slice(5, 8)} ${cleanABN.slice(8)}`;
}
