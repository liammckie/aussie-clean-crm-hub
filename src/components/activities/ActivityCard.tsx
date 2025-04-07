
import React from 'react';
import { Activity } from '@/types/activity-types';
import { getActivityIcon } from './activity-utils';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { Icon, color } = getActivityIcon(activity.type);
  
  const statusColors = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className={cn("pb-2", `bg-${color}-500/10`)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("rounded-full p-1", `bg-${color}-500/20`)}>
              <Icon className={cn("h-4 w-4", `text-${color}-500`)} />
            </div>
            <span className="text-sm font-medium">{activity.entity.type}</span>
          </div>
          <Badge variant="outline" className={cn(statusColors[activity.status])}>
            {activity.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-medium mb-1">{activity.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
        
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <Avatar className="h-5 w-5">
            <span className="text-xs">{activity.user.name.charAt(0)}</span>
          </Avatar>
          <span>{activity.user.name}</span>
          <span className="text-xs ml-auto">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs">
          View Details
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          <ExternalLink className="h-3 w-3 mr-1" />
          {activity.entity.type}
        </Button>
      </CardFooter>
    </Card>
  );
}
