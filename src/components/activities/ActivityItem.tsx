
import React from 'react';
import { Activity } from '@/types/activity-types';
import { getActivityIcon } from './activity-utils';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const { Icon, color } = getActivityIcon(activity.type);
  
  const statusColors = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };
  
  return (
    <Card className="p-4 hover:bg-accent/50 cursor-pointer transition-colors flex items-start gap-4">
      <div className={cn("rounded-full p-2 flex-shrink-0", `bg-${color}-500/10`)}>
        <Icon className={cn("h-5 w-5", `text-${color}-500`)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-sm">{activity.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
          </div>
          <Badge variant="outline" className={cn("ml-2 shrink-0", statusColors[activity.status])}>
            {activity.status}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <span className="text-xs">{activity.user.name.charAt(0)}</span>
            </Avatar>
            <span>{activity.user.name}</span>
          </div>
          <span className="text-xs">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
        </div>
      </div>
    </Card>
  );
}
