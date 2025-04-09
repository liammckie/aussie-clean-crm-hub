
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SalesOpportunityCard } from './SalesOpportunityCard';
import { Opportunity, SalesStage } from '@/types/sales-types';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SalesKanbanBoardProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  onOpportunityUpdated: () => void;
}

export function SalesKanbanBoard({ opportunities, isLoading, onOpportunityUpdated }: SalesKanbanBoardProps) {
  const stages: SalesStage[] = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
  
  const stageDisplayNames: Record<SalesStage, string> = {
    'LEAD': 'Leads',
    'QUALIFIED': 'Qualified',
    'PROPOSAL': 'Proposal',
    'NEGOTIATION': 'Negotiation',
    'CLOSED_WON': 'Closed Won',
    'CLOSED_LOST': 'Closed Lost'
  };

  const stageColors: Record<SalesStage, string> = {
    'LEAD': 'bg-gray-100',
    'QUALIFIED': 'bg-blue-50',
    'PROPOSAL': 'bg-purple-50',
    'NEGOTIATION': 'bg-amber-50',
    'CLOSED_WON': 'bg-green-50',
    'CLOSED_LOST': 'bg-red-50'
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const opportunityId = active.id;
    const newStage = over.id as SalesStage;
    
    // Call an API to update the opportunity stage
    // This is where you would integrate with your update opportunity function
    console.log(`Move opportunity ${opportunityId} to stage ${newStage}`);
    
    // Refresh the data after updating
    onOpportunityUpdated();
  };

  const getOpportunitiesByStage = (stage: SalesStage) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage) => (
          <div key={stage} className="flex flex-col h-full">
            <div className={`p-2 rounded-t-lg ${stageColors[stage]} border-b`}>
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-sm">{stageDisplayNames[stage]}</h3>
                <span className="bg-white text-xs font-medium px-2 py-1 rounded-full">
                  {getOpportunitiesByStage(stage).length}
                </span>
              </div>
            </div>
            
            <Card className={`flex-1 ${stageColors[stage]} border-t-0 rounded-t-none`}>
              <CardContent className="p-2">
                <SortableContext items={getOpportunitiesByStage(stage).map(o => o.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 min-h-[200px]">
                    {getOpportunitiesByStage(stage).length === 0 ? (
                      <div className="text-center p-4 text-muted-foreground text-sm italic">
                        No opportunities
                      </div>
                    ) : (
                      getOpportunitiesByStage(stage).map((opportunity) => (
                        <SalesOpportunityCard 
                          key={opportunity.id}
                          opportunity={opportunity}
                          onUpdate={onOpportunityUpdated}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
