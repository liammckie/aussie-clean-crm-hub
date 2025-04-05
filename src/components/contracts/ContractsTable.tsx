
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

export function ContractsTable({ contracts }: ContractsTableProps) {
  if (!contracts || contracts.length === 0) {
    return <div className="text-center p-4">No contracts found</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableCaption>List of all contracts</TableCaption>
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
              <TableCell className="font-medium">{contract.client_name}</TableCell>
              <TableCell>{contract.contract_name}</TableCell>
              <TableCell>{contract.service_type || 'N/A'}</TableCell>
              <TableCell>{contract.status}</TableCell>
              <TableCell>{new Date(contract.start_date).toLocaleDateString()}</TableCell>
              <TableCell>{contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Ongoing'}</TableCell>
              <TableCell className="text-right">{formatCurrency(contract.total_annual_value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
