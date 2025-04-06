
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { AppLogger, LogCategory } from '@/utils/logging';
import { formatCurrency } from '@/utils/formatters';
import { 
  assignSupplierToContractSchema, 
  AssignSupplierToContractData,
  SupplierWithContract
} from '@/types/supplier-contract-types';
import { supabase } from '@/integrations/supabase/client';

interface ContractSuppliersTabProps {
  contractId: string;
}

export function ContractSuppliersTab({ contractId }: ContractSuppliersTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<AssignSupplierToContractData>({
    resolver: zodResolver(assignSupplierToContractSchema),
    defaultValues: {
      contract_id: contractId,
      role: 'subcontractor',
      status: 'active',
      services: '',
      percentage: undefined,
      notes: '',
    }
  });

  // Query suppliers linked to this contract
  const { data: supplierLinks, isLoading } = useQuery({
    queryKey: ['contract', contractId, 'suppliers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('supplier_contract')
          .select(`
            link_id,
            role,
            status,
            services,
            percentage,
            assigned_at,
            suppliers:supplier_id (
              supplier_id,
              supplier_name,
              supplier_type,
              status,
              abn
            )
          `)
          .eq('contract_id', contractId);

        if (error) {
          AppLogger.error(LogCategory.CONTRACT, 'Failed to fetch contract suppliers', { error });
          throw error;
        }
        
        // The data structure matches our updated SupplierWithContract interface
        return data as SupplierWithContract[];
      } catch (error) {
        AppLogger.error(LogCategory.CONTRACT, 'Exception in contract suppliers query', { error });
        throw new Error('Failed to load suppliers for this contract');
      }
    }
  });

  // Query all active suppliers for the dropdown
  const { data: suppliers, isLoading: isSuppliersLoading } = useQuery({
    queryKey: ['suppliers', 'active'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('id:supplier_id, supplier_name, supplier_type, status, abn')
          .eq('status', 'active');

        if (error) {
          AppLogger.error(LogCategory.SUPPLIER, 'Failed to fetch suppliers', { error });
          throw error;
        }
        
        return data;
      } catch (error) {
        AppLogger.error(LogCategory.SUPPLIER, 'Exception in suppliers query', { error });
        throw new Error('Failed to load supplier options');
      }
    }
  });

  // Mutation for assigning a supplier
  const assignSupplier = useMutation({
    mutationFn: async (data: AssignSupplierToContractData) => {
      try {
        AppLogger.info(LogCategory.SUPPLIER_CONTRACT, 'Assigning supplier to contract', { 
          supplierId: data.supplier_id, contractId: data.contract_id 
        });
        
        const { error } = await supabase
          .from('supplier_contract')
          .insert({
            supplier_id: data.supplier_id,
            contract_id: data.contract_id,
            role: data.role,
            status: data.status,
            services: data.services,
            percentage: data.percentage,
            notes: data.notes
          });

        if (error) {
          AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Failed to assign supplier to contract', { error });
          throw error;
        }
      } catch (error) {
        AppLogger.error(LogCategory.SUPPLIER_CONTRACT, 'Exception in assign supplier mutation', { error });
        throw new Error('Failed to assign supplier to contract');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', contractId, 'suppliers'] });
      toast.success('Supplier assigned to contract successfully');
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to assign supplier', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: AssignSupplierToContractData) => {
    assignSupplier.mutate(data);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contract Suppliers</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Supplier to Contract</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers?.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.supplier_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="subcontractor">Subcontractor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Services Provided</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cleaning, Maintenance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Percentage Allocation (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 75" 
                          min={0}
                          max={100}
                          value={value ?? ''}
                          onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional information..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={assignSupplier.isPending}>
                    {assignSupplier.isPending ? 'Assigning...' : 'Assign Supplier'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : supplierLinks?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierLinks.map((link) => (
                <TableRow key={link.link_id}>
                  <TableCell>
                    <div className="font-medium">{link.suppliers[0]?.supplier_name}</div>
                    <div className="text-xs text-muted-foreground">{link.suppliers[0]?.abn}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={link.role === 'primary' ? 'default' : 'outline'}>
                      {link.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        link.status === 'active' ? 'success' : 
                        link.status === 'terminated' ? 'destructive' : 'outline'
                      }
                    >
                      {link.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {link.services || '-'}
                    {link.percentage && <div className="text-xs">{link.percentage}%</div>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No suppliers assigned to this contract yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
