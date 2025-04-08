import React from 'react';
import { useContracts } from '@/hooks/use-contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractViewMode } from '@/services/contract/types';
import { Skeleton } from '@/components/ui/skeleton';
import { contractDetailsFields } from '@/utils/contractDetailsConfig';
import { ContractForm } from './ContractForm';
import { FinancialSummaryCard } from '@/components/financial/FinancialSummaryCard';
import { generateFinancialBreakdown } from '@/utils/financeCalculations';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  
  if (viewMode === 'edit') {
    return <ContractForm contractId={contractId} isEdit={true} />;
  }

  const weeklyRevenue = contract.total_weekly_value || 0;
  const weeklyCost = contract.supplier_cost_weekly || 0;
  const financialMetrics = generateFinancialBreakdown(weeklyRevenue, weeklyCost);
  
  return (
    <>
      <FinancialSummaryCard
        title="Contract Financial Summary"
        description="Revenue, costs and profit breakdown"
        weekly={financialMetrics.weekly}
        monthly={financialMetrics.monthly}
        annual={financialMetrics.annual}
        className="mb-6"
      />
      
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
          </div>
          
          <Separator className="my-6" />
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Service Days</h3>
            <div className="flex flex-wrap gap-2">
              {contract.monday && <Badge variant="outline">Monday</Badge>}
              {contract.tuesday && <Badge variant="outline">Tuesday</Badge>}
              {contract.wednesday && <Badge variant="outline">Wednesday</Badge>}
              {contract.thursday && <Badge variant="outline">Thursday</Badge>}
              {contract.friday && <Badge variant="outline">Friday</Badge>}
              {contract.saturday && <Badge variant="outline">Saturday</Badge>}
              {contract.sunday && <Badge variant="outline">Sunday</Badge>}
              {!contract.monday && !contract.tuesday && !contract.wednesday && 
               !contract.thursday && !contract.friday && !contract.saturday && !contract.sunday && 
               <span className="text-muted-foreground italic">No service days specified</span>}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Documents</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Contract Document</span>
                <div>
                  {contract.contract_document_url ? (
                    <a 
                      href={contract.contract_document_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      View Contract Document <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">No document attached</span>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Scope of Work</span>
                <div>
                  {contract.scope_document_url ? (
                    <a 
                      href={contract.scope_document_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      View Scope of Work <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">No document attached</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function calculateProfitMargin(revenue?: number, cost?: number): string {
  if (!revenue || !cost || revenue === 0) return '0';
  const margin = ((revenue - cost) / revenue) * 100;
  return margin.toFixed(1);
}

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
