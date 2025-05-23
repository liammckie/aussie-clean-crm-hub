
import { generateSampleContract } from '../contractTestData';
import { AppLogger, LogLevel, LogCategory } from '../logging';

/**
 * Basic tests for the contract utility functions
 */
describe('Contract Utilities', () => {
  beforeEach(() => {
    // Clear logs before each test
    jest.spyOn(AppLogger, 'clearLogs');
    AppLogger.clearLogs();
    
    // Spy on logger methods for assertions
    jest.spyOn(AppLogger, 'debug');
    jest.spyOn(AppLogger, 'error');
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('generateSampleContract', () => {
    it('should generate a valid contract object', () => {
      // Arrange
      const testClientId = '00000000-0000-0000-0000-000000000000';
      
      // Act
      const contract = generateSampleContract(testClientId);
      
      // Assert
      expect(contract).toBeDefined();
      expect(contract.client_id).toBe(testClientId);
      expect(contract.contract_name).toBeDefined();
      expect(contract.contract_code).toBeDefined();
      expect(contract.contract_code.startsWith('C')).toBeTruthy();
      expect(contract.service_type).toBeDefined();
      expect(contract.status).toBeDefined();
      
      // Financial fields
      expect(contract.total_weekly_value).toBeGreaterThan(0);
      expect(contract.total_monthly_value).toBeGreaterThan(0);
      expect(contract.total_annual_value).toBeGreaterThan(0);
      expect(contract.total_annual_value).toEqual(contract.total_weekly_value * 52);
      
      // Date fields
      expect(contract.start_date).toBeDefined();
      expect(contract.end_date).toBeDefined();
      expect(new Date(contract.start_date) < new Date(contract.end_date)).toBeTruthy();
    });
    
    it('should generate unique contracts on each call', () => {
      // Arrange
      const testClientId = '00000000-0000-0000-0000-000000000000';
      
      // Act
      const contract1 = generateSampleContract(testClientId);
      const contract2 = generateSampleContract(testClientId);
      
      // Assert
      expect(contract1.contract_code).not.toEqual(contract2.contract_code);
      expect(contract1.contract_name).not.toEqual(contract2.contract_name);
    });
    
    it('should log debug information during contract generation', () => {
      // Arrange
      const testClientId = '00000000-0000-0000-0000-000000000000';
      
      // Act
      generateSampleContract(testClientId);
      
      // Assert - check that appropriate logging occurred
      expect(AppLogger.debug).toHaveBeenCalledWith(
        LogCategory.CONTRACT,
        expect.stringContaining('Generating sample contract'),
        expect.anything()
      );
    });
  });
});
