
import React from 'react';
import { useContracts } from '@/hooks/use-contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractViewMode } from '@/services/contract/types';
import { Skeleton } from '@/components/ui/skeleton';
import { contractDetailsFields } from '@/utils/contractDetailsConfig';
import { ContractForm } from './ContractForm';

interface ContractDetailsTabProps {
  contractId: string;
  viewMode?: ContractViewMode;
}

export function ContractDetailsTab({ contractId, viewMode = 'view' }: ContractDetailsTabProps) {
  const { useContractDetails } = useContracts();
  const { data: contract, isLoading } = useContractDetails(contractId);
  
  if (isLoading) {
    return <ContractDetailSkeleton />;
  }
  
  if (!contract) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contract not found or you don't have permission to view it.</p>
        </CardContent>
      </Card>
    );
  }
  
  // If we're in edit mode, use the ContractForm component
  if (viewMode === 'edit') {
    return <ContractForm contractId={contractId} isEdit={true} />;
  }
  
  // View mode displays contract details in a read-only format
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Contract Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(contractDetailsFields).map(([section, fields]) => (
            <div key={section} className="space-y-4">
              <h3 className="text-lg font-medium">{section}</h3>
              <div className="grid grid-cols-1 gap-3">
                {fields.map(field => (
                  <div key={field.key} className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{field.label}</span>
                    <span className="font-medium">
                      {renderContractValue(contract, field.key, field.type)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Profit Margin Section */}
          <div className="col-span-1 md:col-span-2 mt-6">
            <h3 className="text-lg font-medium">Profit Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="rounded-md bg-slate-100 dark:bg-slate-800 p-4">
                <div className="text-sm text-muted-foreground">Weekly Revenue</div>
                <div className="text-2xl font-semibold">${contract.total_weekly_value?.toLocaleString() || '0'}</div>
                <div className="text-sm text-muted-foreground mt-1">Weekly Cost</div>
                <div className="text-lg font-medium text-muted-foreground">${contract.supplier_cost_weekly?.toLocaleString() || '0'}</div>
                <div className="text-sm font-medium mt-2 text-emerald-600">
                  {calculateProfitMargin(contract.total_weekly_value, contract.supplier_cost_weekly)}% Margin
                </div>
              </div>
              
              <div className="rounded-md bg-slate-100 dark:bg-slate-800 p-4">
                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                <div className="text-2xl font-semibold">${contract.total_monthly_value?.toLocaleString() || '0'}</div>
                <div className="text-sm text-muted-foreground mt-1">Monthly Cost</div>
                <div className="text-lg font-medium text-muted-foreground">${contract.supplier_cost_monthly?.toLocaleString() || '0'}</div>
                <div className="text-sm font-medium mt-2 text-emerald-600">
                  {calculateProfitMargin(contract.total_monthly_value, contract.supplier_cost_monthly)}% Margin
                </div>
              </div>
              
              <div className="rounded-md bg-slate-100 dark:bg-slate-800 p-4">
                <div className="text-sm text-muted-foreground">Annual Revenue</div>
                <div className="text-2xl font-semibold">${contract.total_annual_value?.toLocaleString() || '0'}</div>
                <div className="text-sm text-muted-foreground mt-1">Annual Cost</div>
                <div className="text-lg font-medium text-muted-foreground">${contract.supplier_cost_annual?.toLocaleString() || '0'}</div>
                <div className="text-sm font-medium mt-2 text-emerald-600">
                  {calculateProfitMargin(contract.total_annual_value, contract.supplier_cost_annual)}% Margin
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper to calculate profit margin
function calculateProfitMargin(revenue?: number, cost?: number): string {
  if (!revenue || !cost || revenue === 0) return '0';
  const margin = ((revenue - cost) / revenue) * 100;
  return margin.toFixed(1);
}

// Helper to render different types of values
function renderContractValue(contract: any, key: string, type?: string): React.ReactNode {
  const value = contract[key];
  
  if (value === undefined || value === null || value === '') {
    return <span className="text-muted-foreground italic">Not set</span>;
  }
  
  switch (type) {
    case 'currency':
      return `$${parseFloat(value).toLocaleString()}`;
      
    case 'date':
      return new Date(value).toLocaleDateString();
      
    case 'boolean':
      return value ? 'Yes' : 'No';
      
    case 'status':
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
          value === 'active' ? 'bg-green-100 text-green-800' :
          value === 'draft' ? 'bg-yellow-100 text-yellow-800' :
          value === 'expired' ? 'bg-red-100 text-red-800' :
          value === 'on_hold' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
      
    default:
      return value;
  }
}

// Loading skeleton
function ContractDetailSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 6 }).map((_, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
