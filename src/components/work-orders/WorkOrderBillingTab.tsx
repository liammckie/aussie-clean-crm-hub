
import React from 'react';
import { Loader2, Plus, DollarSign } from 'lucide-react';
import { WorkOrderData, WorkbillData } from '@/types/work-order-types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface WorkOrderBillingTabProps {
  workOrderId: string;
  billing: WorkbillData[];
  isLoading: boolean;
  workOrder: WorkOrderData;
}

export function WorkOrderBillingTab({ 
  workOrderId, 
  billing, 
  isLoading,
  workOrder 
}: WorkOrderBillingTabProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Paid</Badge>;
      case 'disputed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Loading billing information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Manage billing for this work order</CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Workbill
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-muted-foreground text-sm">Estimated Cost</div>
              <div className="text-2xl font-bold">{formatCurrency(workOrder.estimated_cost)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-muted-foreground text-sm">Actual Cost</div>
              <div className="text-2xl font-bold">{formatCurrency(workOrder.actual_cost)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-muted-foreground text-sm">Billing Method</div>
              <div className="text-2xl font-bold">{workOrder.billing_method || 'Not specified'}</div>
            </CardContent>
          </Card>
        </div>
        
        {billing.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground mb-4">No workbills have been created for this work order</p>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Create First Workbill
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workbill ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billing.map((workbill) => (
                  <TableRow key={workbill.id}>
                    <TableCell className="font-medium">{workbill.id.substring(0, 8)}</TableCell>
                    <TableCell>{getStatusBadge(workbill.status)}</TableCell>
                    <TableCell>{formatCurrency(workbill.amount)}</TableCell>
                    <TableCell>{workbill.hours_worked || '-'}</TableCell>
                    <TableCell>{workbill.invoice_number || '-'}</TableCell>
                    <TableCell>{formatDate(workbill.invoice_date)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
