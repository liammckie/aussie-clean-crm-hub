
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContractSitesTabProps {
  contractId: string;
}

export function ContractSitesTab({ contractId }: ContractSitesTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Contract Sites</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Site
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">No sites associated with this contract yet</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Link Site to Contract
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
