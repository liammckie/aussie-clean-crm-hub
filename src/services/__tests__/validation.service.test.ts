
/**
 * @jest-environment jsdom
 */
import { validationService } from '../validation.service';
import { describe, it, expect } from '@jest/globals';

describe('Validation Service', () => {
  describe('ABN Validation', () => {
    it('should validate a correct ABN', () => {
      const result = validationService.validateABN('51824753556');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject an invalid ABN', () => {
      const result = validationService.validateABN('51824753557');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty inputs as valid (since ABN is optional)', () => {
      expect(validationService.validateABN(null).valid).toBe(true);
      expect(validationService.validateABN(undefined).valid).toBe(true);
      expect(validationService.validateABN('').valid).toBe(true);
    });
  });

  describe('ACN Validation', () => {
    it('should validate a correct ACN', () => {
      const result = validationService.validateACN('004085616');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject an invalid ACN', () => {
      const result = validationService.validateACN('004085617');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty inputs as valid (since ACN is optional)', () => {
      expect(validationService.validateACN(null).valid).toBe(true);
      expect(validationService.validateACN(undefined).valid).toBe(true);
      expect(validationService.validateACN('').valid).toBe(true);
    });
  });

  describe('Business Identifier Formatting', () => {
    it('should format ABN correctly', () => {
      const data = { abn: '51824753556', acn: null };
      const formatted = validationService.formatBusinessIdentifiers(data);
      expect(formatted.abn).toBe('51 824 753 556');
    });

    it('should format ACN correctly', () => {
      const data = { abn: null, acn: '004085616' };
      const formatted = validationService.formatBusinessIdentifiers(data);
      expect(formatted.acn).toBe('00 408 561 6');
    });

    it('should handle both ABN and ACN together', () => {
      const data = { abn: '51824753556', acn: '004085616' };
      const formatted = validationService.formatBusinessIdentifiers(data);
      expect(formatted.abn).toBe('51 824 753 556');
      expect(formatted.acn).toBe('00 408 561 6');
    });

    it('should handle inputs that are already formatted', () => {
      const data = { abn: '51 824 753 556', acn: '00 408 561 6' };
      const formatted = validationService.formatBusinessIdentifiers(data);
      expect(formatted.abn).toBe('51 824 753 556');
      expect(formatted.acn).toBe('00 408 561 6');
    });

    it('should not modify other fields', () => {
      const data = { 
        abn: '51824753556', 
        acn: '004085616',
        name: 'Test Company', 
        email: 'test@example.com' 
      };
      const formatted = validationService.formatBusinessIdentifiers(data);
      expect(formatted.name).toBe('Test Company');
      expect(formatted.email).toBe('test@example.com');
    });
  });
});
