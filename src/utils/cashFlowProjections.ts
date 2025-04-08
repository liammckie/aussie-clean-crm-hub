
import { ContractData } from "@/types/contract-types";
import { formatCurrency } from "./financeCalculations";

/**
 * Represents a projected cash flow entry with dates and amounts
 */
export interface CashFlowEntry {
  date: Date;
  description: string;
  incoming: number;
  outgoing: number;
  balance: number;
}

/**
 * Cash flow projection result
 */
export interface CashFlowProjection {
  entries: CashFlowEntry[];
  totalIncoming: number;
  totalOutgoing: number;
  netCashFlow: number;
  projectionStart: Date;
  projectionEnd: Date;
}

/**
 * Calculate payment due date based on billing date and payment terms
 * @param billingDate The date when the invoice is issued
 * @param paymentTerms Payment terms like "net_7", "net_14", "net_30"
 */
export const calculatePaymentDueDate = (billingDate: Date, paymentTerms?: string): Date => {
  const dueDate = new Date(billingDate);
  
  if (!paymentTerms) {
    // Default to 14 days if no payment terms specified
    dueDate.setDate(dueDate.getDate() + 14);
    return dueDate;
  }
  
  // Extract days from payment terms
  if (paymentTerms.toLowerCase().startsWith('net_')) {
    const days = parseInt(paymentTerms.substring(4), 10);
    if (!isNaN(days)) {
      dueDate.setDate(dueDate.getDate() + days);
      return dueDate;
    }
  }
  
  // If we couldn't parse, default to 14 days
  dueDate.setDate(dueDate.getDate() + 14);
  return dueDate;
};

/**
 * Generate dates for the next N billing cycles based on frequency
 * @param startDate Starting date for the projection
 * @param frequency Billing frequency (weekly, monthly, quarterly, etc.)
 * @param count Number of billing cycles to generate
 */
export const generateBillingDates = (
  startDate: Date,
  frequency?: string,
  count: number = 6
): Date[] => {
  const dates: Date[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < count; i++) {
    const date = new Date(start);
    
    switch (frequency?.toLowerCase()) {
      case "weekly":
        date.setDate(date.getDate() + (7 * i));
        break;
      case "fortnightly":
        date.setDate(date.getDate() + (14 * i));
        break;
      case "monthly":
        date.setMonth(date.getMonth() + i);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + (i * 3));
        break;
      case "annually":
        date.setFullYear(date.getFullYear() + i);
        break;
      default:
        // Default to monthly if frequency not specified
        date.setMonth(date.getMonth() + i);
    }
    
    dates.push(date);
  }
  
  return dates;
};

/**
 * Generate cash flow projection for a contract
 * @param contract Contract data
 * @param projectionMonths Number of months to project
 */
export const generateCashFlowProjection = (
  contract: ContractData,
  projectionMonths: number = 6
): CashFlowProjection => {
  const entries: CashFlowEntry[] = [];
  let totalIncoming = 0;
  let totalOutgoing = 0;
  let runningBalance = 0;
  
  // Use contract start date or current date if not available
  const startDate = contract.start_date 
    ? new Date(contract.start_date) 
    : new Date();
  
  // Calculate end date based on projection months
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + projectionMonths);
  
  // Determine billing frequency
  const billingFrequency = contract.billing_frequency || "monthly";
  
  // Generate billing dates
  const billingDates = generateBillingDates(
    startDate,
    billingFrequency,
    // Need more billing cycles for weekly and fortnightly frequencies
    billingFrequency === 'weekly' ? projectionMonths * 4 :
    billingFrequency === 'fortnightly' ? projectionMonths * 2 :
    billingFrequency === 'quarterly' ? Math.max(2, Math.ceil(projectionMonths / 3)) :
    billingFrequency === 'annually' ? Math.max(1, Math.ceil(projectionMonths / 12)) :
    projectionMonths
  );
  
  // For each billing date, generate incoming and outgoing cash flows
  billingDates.forEach((billingDate, index) => {
    // Skip if billing date is beyond projection end date
    if (billingDate > endDate) return;
    
    // Calculate expected payment date based on payment terms
    const paymentDueDate = calculatePaymentDueDate(
      billingDate,
      contract.payment_terms
    );
    
    // Use appropriate revenue value based on billing frequency
    let revenue = 0;
    let cost = 0;
    
    switch (billingFrequency.toLowerCase()) {
      case "weekly":
        revenue = contract.total_weekly_value || 0;
        cost = contract.supplier_cost_weekly || 0;
        break;
      case "fortnightly":
        revenue = (contract.total_weekly_value || 0) * 2;
        cost = (contract.supplier_cost_weekly || 0) * 2;
        break;
      case "monthly":
        revenue = contract.total_monthly_value || 0;
        cost = contract.supplier_cost_monthly || 0;
        break;
      case "quarterly":
        revenue = (contract.total_monthly_value || 0) * 3;
        cost = (contract.supplier_cost_monthly || 0) * 3;
        break;
      case "annually":
        revenue = contract.total_annual_value || 0;
        cost = contract.supplier_cost_annual || 0;
        break;
      default:
        // Default to monthly
        revenue = contract.total_monthly_value || 0;
        cost = contract.supplier_cost_monthly || 0;
    }
    
    // Add revenue entry
    const revenueDescription = `Invoice ${index + 1} - ${contract.contract_name} (${contract.contract_code})`;
    runningBalance += revenue;
    totalIncoming += revenue;
    
    entries.push({
      date: paymentDueDate,
      description: revenueDescription,
      incoming: revenue,
      outgoing: 0,
      balance: runningBalance
    });
    
    // Add cost entry (typically paid before revenue is received)
    const costDate = new Date(billingDate);
    costDate.setDate(costDate.getDate() + 7); // Assume costs paid 7 days after billing
    
    const costDescription = `Supplier payment - ${contract.contract_name}`;
    runningBalance -= cost;
    totalOutgoing += cost;
    
    entries.push({
      date: costDate,
      description: costDescription,
      incoming: 0,
      outgoing: cost,
      balance: runningBalance
    });
  });
  
  // Sort entries by date
  entries.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return {
    entries,
    totalIncoming,
    totalOutgoing,
    netCashFlow: totalIncoming - totalOutgoing,
    projectionStart: startDate,
    projectionEnd: endDate
  };
};

/**
 * Format a date with options
 * @param date Date to format
 * @param includeYear Whether to include year
 */
export const formatProjectionDate = (date: Date, includeYear: boolean = true): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short'
  };
  
  if (includeYear) {
    options.year = 'numeric';
  }
  
  return date.toLocaleDateString('en-AU', options);
};
