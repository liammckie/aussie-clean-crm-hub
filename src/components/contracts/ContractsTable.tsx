
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatters';

interface ContractsTableProps {
  contracts: any[];
}

export const ContractsTable: React.FC<ContractsTableProps> = ({ contracts }) => {
  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No contracts found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>List of contracts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Contract Name</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Annual Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.client_name || contract.client_id}</TableCell>
              <TableCell>{contract.contract_name}</TableCell>
              <TableCell>{contract.service_type}</TableCell>
              <TableCell>
                <span className={`capitalize ${getStatusColor(contract.status)}`}>
                  {contract.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(contract.start_date)}</TableCell>
              <TableCell>{contract.is_ongoing ? 'Ongoing' : formatDate(contract.end_date)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(contract.total_annual_value || 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper functions for formatting
function formatDate(dateString?: string) {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'text-green-600';
    case 'draft':
      return 'text-amber-600';
    case 'expired':
      return 'text-red-600';
    case 'pending_approval':
      return 'text-blue-600';
    default:
      return 'text-slate-600';
  }
}
