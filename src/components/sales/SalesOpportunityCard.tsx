
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Building, 
  User, 
  Calendar, 
  DollarSign,
  Briefcase,
  Edit
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Opportunity } from '@/types/sales-types';
import { Badge } from '@/components/ui/badge';
import { OpportunityDetailsDialog } from './OpportunityDetailsDialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SalesOpportunityCardProps {
  opportunity: Opportunity;
  onUpdate: () => void;
}

export function SalesOpportunityCard({ opportunity, onUpdate }: SalesOpportunityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: opportunity.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card 
        ref={setNodeRef} 
        style={style} 
        className="cursor-pointer hover:shadow-md transition-shadow"
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm line-clamp-2">{opportunity.title}</h4>
            <Badge className={getPriorityColor(opportunity.priority)}>
              {opportunity.priority}
            </Badge>
          </div>
          
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Building className="h-3 w-3 mr-1" />
            <span className="truncate">{opportunity.client_name}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              <span>{formatCurrency(opportunity.value)}</span>
            </div>
            
            <div className="flex items-center text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(opportunity.expected_close_date)}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-2 pt-0 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs p-0 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              setDetailsOpen(true);
            }}
          >
            <Edit className="h-3 w-3 mr-1" /> Edit
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs p-0 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </CardFooter>
        
        {isExpanded && (
          <div className="px-3 pb-3 text-xs space-y-2">
            {opportunity.description && (
              <p className="text-muted-foreground">{opportunity.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span className="truncate">{opportunity.assigned_to}</span>
              </div>
              
              <div className="flex items-center">
                <Briefcase className="h-3 w-3 mr-1" />
                <span>{opportunity.probability}% Probability</span>
              </div>
            </div>
            
            <div className="flex justify-end pt-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailsOpen(true);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <OpportunityDetailsDialog 
        isOpen={detailsOpen} 
        onOpenChange={setDetailsOpen}
        opportunity={opportunity}
        onUpdate={onUpdate}
      />
    </>
  );
}
