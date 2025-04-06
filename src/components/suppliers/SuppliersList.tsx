
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SupplierData, SupplierStatus } from '@/types/supplier-types';
import { PlusCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SuppliersListProps {
  suppliers: SupplierData[];
  isLoading: boolean;
  error: Error | null;
}

export function SuppliersList({ suppliers, isLoading, error }: SuppliersListProps) {
  const navigate = useNavigate();

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case SupplierStatus.ACTIVE:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case SupplierStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case SupplierStatus.SUSPENDED:
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case SupplierStatus.TERMINATED:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Format date to DD/MM/YYYY (Australian format)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return '-';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-xl text-muted-foreground">Loading suppliers...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40 text-destructive">
            <AlertCircle className="h-12 w-12 mb-2" />
            <h3 className="text-xl font-semibold mb-1">Error loading suppliers</h3>
            <p>{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40">
            <h3 className="text-xl font-semibold mb-4">No suppliers found</h3>
            <Button
              variant="default"
              className="flex items-center"
              onClick={() => navigate('/new-supplier')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Suppliers</CardTitle>
          <CardDescription>Manage your suppliers and subcontractors</CardDescription>
        </div>
        <Button
          variant="default"
          className="flex items-center"
          onClick={() => navigate('/new-supplier')}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ABN</TableHead>
              <TableHead>Onboarded</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.supplier_id}>
                <TableCell className="font-medium">{supplier.supplier_name}</TableCell>
                <TableCell>{supplier.supplier_type}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(supplier.status)} variant="outline">
                    {supplier.status}
                  </Badge>
                </TableCell>
                <TableCell>{supplier.abn || '-'}</TableCell>
                <TableCell>{formatDate(supplier.date_onboarded)}</TableCell>
                <TableCell>
                  {supplier.contact_person || supplier.email || '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/suppliers/${supplier.supplier_id}`)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
