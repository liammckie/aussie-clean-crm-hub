
import { generateRandomId } from '@/utils/idGenerator';
import { contractService } from '@/services/contract';
import { toast } from 'sonner';

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
 * Generates a sample contract for testing
 */
export const generateSampleContract = (clientId: string) => {
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

  return {
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
};

/**
 * Creates multiple sample contracts for testing
 * @param clientIds Array of client IDs to associate with contracts
 * @param count Number of contracts to generate
 */
export const createSampleContracts = async (clientIds: string[], count = 20) => {
  try {
    const contractPromises = [];
    
    for (let i = 0; i < count; i++) {
      // Pick a random client ID from the array
      const clientId = clientIds[Math.floor(Math.random() * clientIds.length)];
      
      // Generate contract data
      const contractData = generateSampleContract(clientId);
      
      // Add to promises array
      contractPromises.push(contractService.createContract(contractData));
    }
    
    // Wait for all contracts to be created
    await Promise.all(contractPromises);
    
    toast.success(`Successfully created ${count} sample contracts`);
    return true;
  } catch (error) {
    console.error('Failed to create sample contracts:', error);
    toast.error('Failed to create sample contracts');
    return false;
  }
};
