
/**
 * @jest-environment jsdom
 */
import { isValidABN, isValidACN, formatABN } from '../validators';

describe('Business Identifier Validators', () => {
  describe('ABN Validation', () => {
    it('should validate a correct ABN', () => {
      expect(isValidABN('51824753556')).toBe(true);
      expect(isValidABN('51 824 753 556')).toBe(true);
    });

    it('should reject an invalid ABN', () => {
      expect(isValidABN('51824753557')).toBe(false); // Invalid checksum
    });
    
    it('should reject ABNs of incorrect length', () => {
      expect(isValidABN('5182475355')).toBe(false); // Too short
      expect(isValidABN('518247535566')).toBe(false); // Too long
    });
    
    it('should reject ABNs with non-digit characters', () => {
      expect(isValidABN('5182475355X')).toBe(false);
    });
    
    it('should handle null or empty inputs', () => {
      expect(isValidABN('')).toBe(false);
      expect(isValidABN('   ')).toBe(false);
    });
  });
  
  describe('ACN Validation', () => {
    it('should validate a correct ACN', () => {
      expect(isValidACN('004085616')).toBe(true); // Microsoft Australia
      expect(isValidACN('004 085 616')).toBe(true);
    });
    
    it('should reject an invalid ACN', () => {
      expect(isValidACN('004085617')).toBe(false); // Invalid checksum
    });
    
    it('should reject ACNs of incorrect length', () => {
      expect(isValidACN('00408561')).toBe(false); // Too short
      expect(isValidACN('0040856166')).toBe(false); // Too long
    });
    
    it('should reject ACNs with non-digit characters', () => {
      expect(isValidACN('00408561A')).toBe(false);
    });
    
    it('should handle null or empty inputs', () => {
      expect(isValidACN('')).toBe(false);
      expect(isValidACN('   ')).toBe(false);
    });
  });
  
  describe('ABN Formatting', () => {
    it('should format ABNs correctly', () => {
      expect(formatABN('51824753556')).toBe('51 824 753 556');
    });
    
    it('should handle ABNs that are already formatted', () => {
      expect(formatABN('51 824 753 556')).toBe('51 824 753 556');
    });
    
    it('should handle invalid inputs by returning them unchanged', () => {
      expect(formatABN('invalid')).toBe('invalid');
    });
  });
});
