
import React from 'react';
import { ContractData } from '@/services/contract/types';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';

interface ContractsListProps {
  contracts: ContractData[];
  onViewContract: (contractId: string) => void;
  onEditContract: (contractId: string, event: React.MouseEvent) => void;
}

export function ContractsList({ 
  contracts, 
  onViewContract, 
  onEditContract 
}: ContractsListProps) {
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '$0';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending_approval':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'on_hold':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Weekly Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract: ContractData) => (
            <TableRow 
              key={contract.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onViewContract(contract.id)}
            >
              <TableCell className="font-medium">{contract.contract_name}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={getStatusBadgeStyles(contract.status)}
                >
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1).replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>{new Date(contract.start_date).toLocaleDateString()}</TableCell>
              <TableCell>
                {contract.end_date 
                  ? new Date(contract.end_date).toLocaleDateString() 
                  : (contract.is_ongoing ? 'Ongoing' : 'Not set')}
              </TableCell>
              <TableCell>{formatCurrency(contract.total_weekly_value)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewContract(contract.id);
                    }}
                    title="View contract details"
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => onEditContract(contract.id, e)}
                    title="Edit contract"
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
