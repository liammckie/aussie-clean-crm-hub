
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Check, X, Phone, Mail, Calendar, MapPin, MessageSquare, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistance } from 'date-fns';

interface ActivityLogProps {
  opportunityId: string;
  onActivityUpdated: () => void;
}

// Placeholder activity data structure
interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

export function ActivityLog({ opportunityId, onActivityUpdated }: ActivityLogProps) {
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  
  // Placeholder activities
  const activities: Activity[] = [
    {
      id: '1',
      type: 'call',
      title: 'Initial contact call',
      description: 'Discussed cleaning requirements and initial budget',
      createdAt: '2025-04-01T10:30:00Z',
      createdBy: 'John Smith'
    },
    {
      id: '2',
      type: 'email',
      title: 'Sent follow-up email',
      description: 'Shared company brochure and initial proposal details',
      createdAt: '2025-04-03T14:15:00Z',
      createdBy: 'John Smith'
    },
    {
      id: '3',
      type: 'meeting',
      title: 'Site visit',
      description: 'Toured facility to assess cleaning needs',
      createdAt: '2025-04-07T09:00:00Z',
      createdBy: 'John Smith'
    }
  ];
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-indigo-100 text-indigo-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      case 'note': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity Log</CardTitle>
        <Button onClick={() => setIsAddActivityDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l border-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="mb-6 relative">
              <div className="absolute -left-9 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200">
                <div className={`flex items-center justify-center w-4 h-4 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <div className="text-xs text-muted-foreground">
                    {formatDistance(new Date(activity.createdAt), new Date(), { addSuffix: true })}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                
                <div className="text-xs flex items-center text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  {activity.createdBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <Dialog open={isAddActivityDialogOpen} onOpenChange={setIsAddActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
          </DialogHeader>
          
          <p className="text-center text-muted-foreground py-8">
            Activity form coming soon
          </p>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsAddActivityDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
