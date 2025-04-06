
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AssignSupplierToContractData, assignSupplierToContractSchema } from '@/types/supplier-contract-types';
import { useAssignSupplierToContract } from '@/hooks/use-supplier-contracts';
import { useSuppliers } from '@/hooks/use-suppliers';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/spinner';

interface AssignSupplierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  onAssigned: () => void;
}

export function AssignSupplierDialog({
  isOpen,
  onClose,
  contractId,
  onAssigned,
}: AssignSupplierDialogProps) {
  const { mutateAsync: assignSupplier, isPending } = useAssignSupplierToContract();
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers();
  const [formError, setFormError] = useState<string | null>(null);
  
  const form = useForm<AssignSupplierToContractData>({
    resolver: zodResolver(assignSupplierToContractSchema),
    defaultValues: {
      contract_id: contractId,
      role: 'primary',
      services: '',
      percentage: 100,
      notes: '',
    },
  });

  const handleSubmit = async (data: AssignSupplierToContractData) => {
    try {
      setFormError(null);
      await assignSupplier({
        ...data,
        contract_id: contractId,
      });
      form.reset();
      onAssigned();
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to assign supplier');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Supplier to Contract</DialogTitle>
          <DialogDescription>
            Select a supplier to assign to this contract and define their role.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={suppliersLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliersLoading ? (
                          <div className="flex justify-center p-2">
                            <LoadingSpinner size="sm" />
                          </div>
                        ) : suppliers?.map((supplier) => (
                          <SelectItem key={supplier.supplier_id} value={supplier.supplier_id}>
                            {supplier.supplier_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="subcontractor">Subcontractor</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                    <Input placeholder="E.g. Cleaning, Security" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentage of Contract Value (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={100} 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <Textarea placeholder="Enter any additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md">
                {formError}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Assigning...' : 'Assign Supplier'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
