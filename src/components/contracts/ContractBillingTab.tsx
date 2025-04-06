
import React from 'react';
import { useContracts } from '@/hooks/use-contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ContractBillingTabProps {
  contractId: string;
}

export function ContractBillingTab({ contractId }: ContractBillingTabProps) {
  const { useContractBillingLines } = useContracts(undefined);
  const { data: billingLines, isLoading } = useContractBillingLines(contractId);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Lines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Billing Lines</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Billing Line
        </Button>
      </CardHeader>
      <CardContent>
        {billingLines && billingLines.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Client Charge</TableHead>
                  <TableHead>Supplier Cost</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingLines.map((line) => {
                  const profit = line.client_charge - (line.supplier_cost || 0);
                  const margin = line.client_charge > 0 
                    ? ((profit / line.client_charge) * 100).toFixed(1) 
                    : '0';
                  
                  return (
                    <TableRow key={line.id}>
                      <TableCell className="font-medium">{line.description}</TableCell>
                      <TableCell>${line.client_charge.toLocaleString()}</TableCell>
                      <TableCell>${(line.supplier_cost || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${profit.toLocaleString()} ({margin}%)
                        </span>
                      </TableCell>
                      <TableCell>x{line.frequency}</TableCell>
                      <TableCell>{line.unit}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          line.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {line.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No billing lines found for this contract</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add First Billing Line
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
