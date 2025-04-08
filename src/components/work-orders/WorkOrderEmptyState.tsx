
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';

interface WorkOrderEmptyStateProps {
  onCreateWorkOrder: () => void;
  searchApplied: boolean;
}

export function WorkOrderEmptyState({ onCreateWorkOrder, searchApplied }: WorkOrderEmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">No work orders found</CardTitle>
          <CardDescription className="mb-4">
            {searchApplied
              ? "No work orders match your search criteria"
              : "You haven't created any work orders yet"}
          </CardDescription>
          <Button onClick={onCreateWorkOrder}>
            <ClipboardList className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
