
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
    <Card className="p-4 hover:bg-white/60 hover:shadow-md cursor-pointer transition-all duration-300 flex items-start gap-4 bg-white/40 backdrop-blur-sm border-white/20 group">
      <div className={cn(
        "rounded-full p-2 flex-shrink-0 transition-transform group-hover:scale-110",
        `bg-${color}-500/10`
      )}>
        <Icon className={cn("h-5 w-5", `text-${color}-500`)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-sm">{activity.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{activity.description}</p>
          </div>
          <Badge variant="outline" className={cn("shrink-0", statusColors[activity.status])}>
            {activity.status}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              {activity.user.avatar ? (
                <img src={activity.user.avatar} alt={activity.user.name} />
              ) : (
                <span className="text-xs">{activity.user.name.charAt(0)}</span>
              )}
            </Avatar>
            <span>{activity.user.name}</span>
          </div>
          <span className="text-xs">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
        </div>
      </div>
    </Card>
  );
}
