
// Utility to generate forecast data for the Business Metrics Chart

// Types for our forecast data
export interface ForecastDataPoint {
  month: string;
  activeClients: number;
  activeSites: number;
  activeContracts: number;
  fixedBillingAnnual: number;
  fixedBillingMonthly: number;
  fixedBillingWeekly: number;
  supplierCostAnnual: number;
  supplierCostMonthly: number;
  supplierCostWeekly: number;
}

export interface ContractForecast {
  id: string;
  clientName: string;
  startDate: Date;
  cancellationDate: Date | null;
  monthlyValue: number;
  siteCount: number;
}

// Generate dummy contracts with start and potential cancellation dates
export const generateDummyContracts = (count: number): ContractForecast[] => {
  const contracts: ContractForecast[] = [];
  const currentDate = new Date();
  const clientNames = ["Acme Corp", "TechStar", "Global Services", "Metro Solutions", "BrightSpace", "ValueChain", "FirstChoice", "Liberty Partners"];
  
  for (let i = 0; i < count; i++) {
    // Generate random start date (past or future)
    const startDateOffset = Math.floor(Math.random() * 365) - 180; // -180 to +185 days from now
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() + startDateOffset);
    
    // 25% chance of having a cancellation date
    const hasCancellation = Math.random() < 0.25;
    let cancellationDate = null;
    if (hasCancellation) {
      const cancellationOffset = Math.floor(Math.random() * 365) + 30; // 30 to 395 days from start
      cancellationDate = new Date(startDate);
      cancellationDate.setDate(cancellationDate.getDate() + cancellationOffset);
    }
    
    contracts.push({
      id: `contract-${i + 1}`,
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      startDate,
      cancellationDate,
      monthlyValue: Math.floor(Math.random() * 15000) + 5000, // $5,000 to $20,000 per month
      siteCount: Math.floor(Math.random() * 5) + 1 // 1 to 5 sites per contract
    });
  }
  
  return contracts;
};

// Generate forecast data for 12 months based on the contracts
export const generateForecastData = (): ForecastDataPoint[] => {
  const dummyContracts = generateDummyContracts(30); // 30 dummy contracts
  const currentDate = new Date();
  const forecastData: ForecastDataPoint[] = [];
  
  // Create data for 12 months, starting from the current month
  for (let i = 0; i < 12; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setMonth(currentDate.getMonth() + i);
    
    // For each month, calculate the active contracts
    let activeContracts = 0;
    let activeSites = 0;
    let totalMonthlyValue = 0;
    
    // Dictionary to track unique clients
    const uniqueClients = new Set<string>();
    
    dummyContracts.forEach(contract => {
      // Check if contract is active in this month
      if (contract.startDate <= forecastDate && 
          (!contract.cancellationDate || contract.cancellationDate > forecastDate)) {
        activeContracts++;
        activeSites += contract.siteCount;
        totalMonthlyValue += contract.monthlyValue;
        uniqueClients.add(contract.clientName);
      }
    });
    
    // Calculate derivative metrics
    const monthlyValue = totalMonthlyValue;
    const annualValue = monthlyValue * 12;
    const weeklyValue = monthlyValue / 4.33; // Average weeks per month
    
    // Supplier costs (roughly 40% of revenue for this dummy data)
    const supplierCostMonthly = monthlyValue * 0.4;
    const supplierCostAnnual = supplierCostMonthly * 12;
    const supplierCostWeekly = supplierCostMonthly / 4.33;
    
    forecastData.push({
      month: forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      activeClients: uniqueClients.size,
      activeSites,
      activeContracts,
      fixedBillingAnnual: annualValue,
      fixedBillingMonthly: monthlyValue,
      fixedBillingWeekly: weeklyValue,
      supplierCostAnnual: supplierCostAnnual,
      supplierCostMonthly: supplierCostMonthly,
      supplierCostWeekly: supplierCostWeekly
    });
  }
  
  return forecastData;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};
