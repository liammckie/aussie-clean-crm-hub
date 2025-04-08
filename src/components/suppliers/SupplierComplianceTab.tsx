
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/utils/format-utils';
import { CalendarIcon, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface SupplierComplianceTabProps {
  supplierId: string;
}

const SupplierComplianceTab = ({ supplierId }: SupplierComplianceTabProps) => {
  // Mock compliance data - replace with actual data from API
  const complianceItems = [
    {
      id: '1',
      name: 'Insurance Certificate',
      status: 'valid',
      expiryDate: '2024-12-31',
      lastUpdated: '2023-12-01',
      notes: 'Public liability insurance up to $20M'
    },
    {
      id: '2',
      name: 'Work Health & Safety Policy',
      status: 'valid',
      expiryDate: '2025-06-30',
      lastUpdated: '2023-06-15',
      notes: 'Compliant with current regulations'
    },
    {
      id: '3',
      name: 'Workers Compensation',
      status: 'expiring',
      expiryDate: '2024-02-28',
      lastUpdated: '2023-02-28',
      notes: 'Renewal required in 30 days'
    },
    {
      id: '4',
      name: 'Police Checks',
      status: 'expired',
      expiryDate: '2023-11-15',
      lastUpdated: '2022-11-15',
      notes: 'Expired - requires immediate attention'
    },
    {
      id: '5',
      name: 'Quality Assurance Certification',
      status: 'valid',
      expiryDate: '2025-03-15',
      lastUpdated: '2023-03-15',
      notes: 'ISO 9001 certified'
    }
  ];

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'expiring':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getComplianceStatusVariant = (status: string) => {
    switch (status) {
      case 'expired':
        return 'destructive';
      case 'expiring':
        return 'outline'; // Changed from "warning" to "outline"
      case 'valid':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getComplianceStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Valid';
      case 'expiring':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  // Calculate overall compliance status
  const hasExpired = complianceItems.some(item => item.status === 'expired');
  const hasExpiring = complianceItems.some(item => item.status === 'expiring');
  const overallStatus = hasExpired ? 'expired' : hasExpiring ? 'expiring' : 'valid';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Compliance Status</CardTitle>
            <Badge variant={getComplianceStatusVariant(overallStatus)}>
              {getComplianceStatusText(overallStatus)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getComplianceStatusIcon(item.status)}
                      <Badge variant={getComplianceStatusVariant(item.status)}>
                        {getComplianceStatusText(item.status)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {formatDate(item.expiryDate)}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(item.lastUpdated)}</TableCell>
                  <TableCell>{item.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Compliance Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Upload and manage compliance documents for this supplier.
          </p>
          
          {/* Document upload section would go here */}
          <div className="p-8 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">
              Document upload functionality coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierComplianceTab;
