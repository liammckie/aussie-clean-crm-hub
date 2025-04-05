
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContracts } from '@/hooks/use-contracts-table';
import { Loader2 } from 'lucide-react';

interface BulkManagerAssignProps {
  selectedContracts: any[];
  onUpdate?: () => void;
}

export function BulkManagerAssign({ selectedContracts, onUpdate }: BulkManagerAssignProps) {
  const [managerType, setManagerType] = useState<'account_manager' | 'state_manager' | 'national_manager'>('account_manager');
  const [managerValue, setManagerValue] = useState('');
  
  const { bulkUpdateContractManagers, isBulkUpdating } = useContracts();
  
  // Format label from field name
  const formatFieldLabel = (field: string) => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get all contract IDs from selection
  const getSelectedIds = () => {
    return selectedContracts.map(contract => contract.id);
  };

  // Handle bulk update submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contractIds = getSelectedIds();
    
    if (contractIds.length === 0) {
      return;
    }
    
    bulkUpdateContractManagers({
      contractIds,
      managerField: managerType,
      value: managerValue
    });
    
    // Reset the form after submission
    setManagerValue('');
    
    // Call the onUpdate callback if provided
    onUpdate?.();
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-muted/20">
      <div className="mb-2 text-sm font-medium">
        <span className="text-primary">{selectedContracts.length}</span> contracts selected
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="manager-type">Manager Type</Label>
            <Select 
              value={managerType} 
              onValueChange={(value) => setManagerType(value as any)}
            >
              <SelectTrigger id="manager-type">
                <SelectValue placeholder="Select manager type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account_manager">Account Manager</SelectItem>
                <SelectItem value="state_manager">State Manager</SelectItem>
                <SelectItem value="national_manager">National Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="manager-value">Assign {formatFieldLabel(managerType)} To</Label>
            <Input
              id="manager-value"
              value={managerValue}
              onChange={(e) => setManagerValue(e.target.value)}
              placeholder={`Enter ${formatFieldLabel(managerType)} name`}
              required
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isBulkUpdating || selectedContracts.length === 0 || !managerValue}
          className="w-full md:w-auto"
        >
          {isBulkUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            `Update ${formatFieldLabel(managerType)}`
          )}
        </Button>
      </div>
    </form>
  );
}
