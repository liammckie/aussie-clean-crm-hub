import { generateRandomId } from '@/utils/idGenerator';
import { contractService } from '@/services/contract';
import { toast } from 'sonner';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * Generates a random contract name
 */
const generateContractName = () => {
  const prefixes = ['Maintenance', 'Cleaning', 'Security', 'Landscaping', 'IT Support', 'Catering'];
  const types = ['Service', 'Contract', 'Agreement', 'Plan', 'Package'];
  const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
    types[Math.floor(Math.random() * types.length)]
  } ${suffix}`;
};

/**
 * Generates a random service type
 */
const generateServiceType = () => {
  const serviceTypes = [
    'Cleaning', 
    'Security', 
    'Maintenance', 
    'Landscaping', 
    'IT Support',
    'Catering',
    'Consulting'
  ];
  
  return serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
};

/**
 * Generates a random status
 */
const generateStatus = () => {
  const statuses = [
    'active', 
    'pending', 
    'expired', 
    'draft',
    'cancelled',
    'on hold'
  ];
  
  return statuses[Math.floor(Math.random() * statuses.length)];
};

/**
 * Generates a random delivery mode
 */
const generateDeliveryMode = () => {
  const modes = ['employee', 'contractor', 'hybrid'];
  return modes[Math.floor(Math.random() * modes.length)];
};

/**
 * Generates random manager names
 */
const generateManagerName = () => {
  const firstNames = [
    'John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 
    'Robert', 'Jessica', 'William', 'Jennifer'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 
    'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'
  ];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]
  }`;
};

/**
 * Generates a random date between start and end
 */
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Format a date to ISO string date (YYYY-MM-DD)
 */
const formatDateToISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Generates a random value within a range
 */
const randomValue = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates random client names for visualization purposes
 */
const generateClientName = () => {
  const companies = [
    'Acme Corp', 'TechGlobal', 'Pacific Enterprises', 
    'Sunset Industries', 'Metro Services', 'Harbor Group',
    'Summit Holdings', 'Evergreen Solutions', 'Cityscape Properties',
    'Horizon Healthcare', 'Atlas Logistics', 'Pinnacle Retail'
  ];
  
  return companies[Math.floor(Math.random() * companies.length)];
};

/**
 * Generate mock contract data for UI visualization (no database calls)
 */
export const getMockContractData = (count = 10) => {
  const mockContracts = [];
  
  for (let i = 0; i < count; i++) {
    const weeklyValue = randomValue(1000, 10000);
    const monthlyValue = weeklyValue * 4.33;
    const annualValue = weeklyValue * 52;
    
    const now = new Date();
    const startDate = randomDate(new Date(now.getFullYear() - 1, 0, 1), now);
    const endDate = randomDate(now, new Date(now.getFullYear() + 2, 11, 31));
    
    mockContracts.push({
      id: generateRandomId(),
      client_id: generateRandomId(),
      client_name: generateClientName(),
      contract_name: generateContractName(),
      contract_code: `C${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      service_type: generateServiceType(),
      status: generateStatus(),
      delivery_mode: generateDeliveryMode(),
      account_manager: generateManagerName(),
      state_manager: generateManagerName(),
      national_manager: generateManagerName(),
      start_date: formatDateToISODate(startDate),
      end_date: formatDateToISODate(endDate),
      total_weekly_value: weeklyValue,
      total_monthly_value: monthlyValue,
      total_annual_value: annualValue,
      description: `This is a mock visualization contract for testing purposes.`,
      billing_frequency: 'Monthly',
      billing_type: 'Fixed',
      payment_terms: 'Net 30'
    });
  }
  
  return mockContracts;
};

/**
 * Generates a sample contract for testing
 */
export const generateSampleContract = (clientId: string) => {
  // Log the client ID to help with debugging
  console.log(`Generating sample contract for client ID: ${clientId}`);
  
  try {
    const contractCode = `C${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const serviceType = generateServiceType();
    
    // Generate values with relationships
    const weeklyValue = randomValue(500, 5000);
    const monthlyValue = weeklyValue * 4.33;
    const annualValue = weeklyValue * 52;
    
    // Generate dates
    const now = new Date();
    const startDate = randomDate(new Date(now.getFullYear() - 1, 0, 1), now);
    const endDate = randomDate(now, new Date(now.getFullYear() + 2, 11, 31));

    const contract = {
      client_id: clientId,
      contract_name: generateContractName(),
      contract_code: contractCode,
      service_type: serviceType,
      status: generateStatus(),
      delivery_mode: generateDeliveryMode(),
      account_manager: generateManagerName(),
      state_manager: generateManagerName(),
      national_manager: generateManagerName(),
      start_date: formatDateToISODate(startDate),
      end_date: formatDateToISODate(endDate),
      total_weekly_value: weeklyValue,
      total_monthly_value: monthlyValue,
      total_annual_value: annualValue,
      description: `This is a sample ${serviceType.toLowerCase()} contract for testing purposes.`,
      billing_frequency: 'Monthly',
      billing_type: 'Fixed',
      payment_terms: 'Net 30'
    };
    
    // Log the generated contract for debugging
    console.log(`Generated contract: ${contract.contract_code} - ${contract.contract_name}`);
    
    return contract;
  } catch (error) {
    console.error('Error generating sample contract:', error);
    ErrorReporting.captureException(error as Error, { 
      operation: 'generateSampleContract', 
      clientId 
    });
    throw new Error(`Failed to generate contract data: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Creates multiple sample contracts for testing
 * @param clientIds Array of client IDs to associate with contracts
 * @param count Number of contracts to generate
 * @returns Promise that resolves to true if successful, false otherwise
 */
export const createSampleContracts = async (clientIds: string[], count = 20) => {
  console.log(`Starting sample contract creation for ${count} contracts using ${clientIds.length} clients`);
  
  try {
    // First check if we have any valid client IDs
    if (!clientIds || clientIds.length === 0) {
      const error = new Error('No valid client IDs provided for contract creation');
      ErrorReporting.captureException(error, { 
        operation: 'createSampleContracts',
        clientIds: JSON.stringify(clientIds)
      });
      toast.error('Cannot create contracts: No valid clients found');
      return false;
    }
    
    // Check if we have any contracts already
    console.log('Checking for existing contracts...');
    const existingContracts = await contractService.getAllContracts();
    
    if ('data' in existingContracts && existingContracts.data.length > 0) {
      console.log(`Found ${existingContracts.data.length} existing contracts, skipping sample creation`);
      toast.info('Sample contracts already exist in the database');
      return true;
    }
    
    console.log('No existing contracts found, proceeding with sample creation');
    const contractPromises = [];
    const createdContracts = [];
    const failedContracts = [];
    
    // Generate and insert contracts one by one to better handle errors
    for (let i = 0; i < count; i++) {
      // Pick a random client ID from the array
      const clientId = clientIds[Math.floor(Math.random() * clientIds.length)];
      
      try {
        // Generate contract data
        const contractData = generateSampleContract(clientId);
        
        // Add to promises array
        const promise = contractService.createContract(contractData)
          .then(response => {
            if ('category' in response) {
              throw new Error(`API Error: ${response.message}`);
            }
            console.log(`Successfully created contract: ${response.data.contract_code}`);
            createdContracts.push(response.data.id);
            return response.data;
          })
          .catch(error => {
            console.error(`Failed to create contract #${i+1}:`, error);
            failedContracts.push(i+1);
            ErrorReporting.captureException(error instanceof Error ? error : new Error(String(error)), {
              contractData: JSON.stringify(contractData),
              index: i,
              clientId
            });
            // Don't rethrow, just log and continue with other contracts
            return null;
          });
        
        contractPromises.push(promise);
      } catch (error) {
        console.error(`Failed to generate contract data for index ${i}:`, error);
        failedContracts.push(i+1);
      }
    }
    
    // Wait for all contract creation attempts to complete
    const results = await Promise.all(contractPromises);
    const successfulContracts = results.filter(Boolean);
    
    // Log summary of results
    console.log(`Contract creation summary: ${successfulContracts.length} created, ${failedContracts.length} failed`);
    
    if (successfulContracts.length > 0) {
      toast.success(`Successfully created ${successfulContracts.length} sample contracts`);
      
      if (failedContracts.length > 0) {
        console.warn(`Failed to create ${failedContracts.length} contracts: ${failedContracts.join(', ')}`);
        toast.warning(`${failedContracts.length} contracts failed to create`);
      }
      
      return true;
    } else {
      toast.error('Failed to create any sample contracts');
      return false;
    }
  } catch (error) {
    console.error('Failed to create sample contracts:', error);
    ErrorReporting.captureException(error as Error, {
      operation: 'createSampleContracts',
      clientCount: clientIds.length,
      requestedCount: count
    });
    toast.error('Failed to create sample contracts');
    return false;
  }
};
