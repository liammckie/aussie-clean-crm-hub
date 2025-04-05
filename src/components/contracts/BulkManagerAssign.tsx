
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { contractService } from '@/services/contract';
import { toast } from 'sonner';

interface BulkManagerAssignProps {
  selectedContracts: any[];
  onUpdate: () => void;
}

export function BulkManagerAssign({ selectedContracts, onUpdate }: BulkManagerAssignProps) {
  const [accountManager, setAccountManager] = useState('');
  const [stateManager, setStateManager] = useState('');
  const [nationalManager, setNationalManager] = useState('');
  const [activeTab, setActiveTab] = useState('account_manager');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAssign = async () => {
    if (!selectedContracts.length) {
      toast.error('No contracts selected');
      return;
    }

    let updateValue = '';
    let fieldName = '';

    switch (activeTab) {
      case 'account_manager':
        updateValue = accountManager;
        fieldName = 'account_manager';
        break;
      case 'state_manager':
        updateValue = stateManager;
        fieldName = 'state_manager';
        break;
      case 'national_manager':
        updateValue = nationalManager;
        fieldName = 'national_manager';
        break;
    }

    if (!updateValue.trim()) {
      toast.error('Please enter a manager name');
      return;
    }

    setIsUpdating(true);

    try {
      // Update each selected contract
      const updatePromises = selectedContracts.map(contract => 
        contractService.updateContract(contract.id, { [fieldName]: updateValue })
      );

      await Promise.all(updatePromises);
      toast.success(`Updated ${selectedContracts.length} contracts with new ${fieldName.replace('_', ' ')}`);
      onUpdate();

      // Reset form
      setAccountManager('');
      setStateManager('');
      setNationalManager('');
    } catch (error) {
      console.error('Error updating contracts:', error);
      toast.error('Failed to update contracts');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Bulk Assign Managers</CardTitle>
        <CardDescription>
          {selectedContracts.length} contract{selectedContracts.length !== 1 ? 's' : ''} selected
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="account_manager">Account Manager</TabsTrigger>
            <TabsTrigger value="state_manager">State Manager</TabsTrigger>
            <TabsTrigger value="national_manager">National Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="account_manager" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-manager">Account Manager Name</Label>
              <Input 
                id="account-manager" 
                value={accountManager} 
                onChange={(e) => setAccountManager(e.target.value)} 
                placeholder="Enter account manager name"
              />
            </div>
          </TabsContent>

          <TabsContent value="state_manager" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="state-manager">State Manager Name</Label>
              <Input 
                id="state-manager" 
                value={stateManager} 
                onChange={(e) => setStateManager(e.target.value)} 
                placeholder="Enter state manager name"
              />
            </div>
          </TabsContent>

          <TabsContent value="national_manager" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="national-manager">National Manager Name</Label>
              <Input 
                id="national-manager" 
                value={nationalManager} 
                onChange={(e) => setNationalManager(e.target.value)} 
                placeholder="Enter national manager name"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleAssign} 
          disabled={isUpdating}
          className="ml-auto"
        >
          {isUpdating ? 'Updating...' : 'Apply to Selected Contracts'}
        </Button>
      </CardFooter>
    </Card>
  );
}
