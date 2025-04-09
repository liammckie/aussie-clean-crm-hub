
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, LineChart, Calendar } from 'lucide-react';
import { SalesKanbanBoard } from '@/components/sales/SalesKanbanBoard';
import { SalesLeaderboard } from '@/components/sales/SalesLeaderboard';
import { SalesAnalytics } from '@/components/sales/SalesAnalytics';
import { NewOpportunityDialog } from '@/components/sales/NewOpportunityDialog';
import { useSalesOpportunities } from '@/hooks/use-sales-opportunities';
import { SalesStage } from '@/types/sales-types';

const Sales = () => {
  const [isNewOpportunityDialogOpen, setIsNewOpportunityDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('kanban');
  const { opportunities, isLoading, refetchOpportunities } = useSalesOpportunities();

  const handleOpportunityCreated = () => {
    refetchOpportunities();
    setIsNewOpportunityDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Sales Pipeline"
          description="Track opportunities, manage leads, and monitor sales performance"
          breadcrumbs={[{ label: 'Sales' }]}
        />
        <Button onClick={() => setIsNewOpportunityDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="kanban">
            <Users className="h-4 w-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <LineChart className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <LineChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <SalesKanbanBoard opportunities={opportunities} isLoading={isLoading} onOpportunityUpdated={refetchOpportunities} />
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-6">
          <SalesLeaderboard opportunities={opportunities} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <SalesAnalytics opportunities={opportunities} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <div className="p-6 text-center bg-white rounded-lg shadow">
            <p className="text-muted-foreground">Calendar view coming soon</p>
          </div>
        </TabsContent>
      </Tabs>

      <NewOpportunityDialog 
        isOpen={isNewOpportunityDialogOpen} 
        onOpenChange={setIsNewOpportunityDialogOpen} 
        onOpportunityCreated={handleOpportunityCreated} 
      />
    </div>
  );
};

export default Sales;
