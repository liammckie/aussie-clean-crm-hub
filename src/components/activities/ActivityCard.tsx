
import React from 'react';
import { Activity } from '@/types/activity-types';
import { getActivityIcon, getActivityEntityUrl } from './activity-utils';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  
  // Safely handle entity URL
  const getEntityUrl = () => {
    if (activity.entity) {
      return getActivityEntityUrl(activity.entity);
    } else if (activity.entityId && activity.entityType) {
      return getActivityEntityUrl({ id: activity.entityId, type: activity.entityType });
    }
    return '#';
  };
  
  const entityUrl = getEntityUrl();
  
  // Handle user information
  const getUserInitial = () => {
    if (activity.user?.name) {
      return activity.user.name.charAt(0);
    } else if (activity.actor) {
      return activity.actor.charAt(0);
    }
    return 'U';
  };
  
  const getUserName = () => {
    return activity.user?.name || activity.actor || 'Unknown';
  };
  
  return (
    <Card className="overflow-hidden bg-white/40 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] group">
      <CardHeader className={cn("pb-2", `bg-${color}-500/10`)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "rounded-full p-1 transition-transform group-hover:scale-110",
              `bg-${color}-500/20`
            )}>
              <Icon className={cn("h-4 w-4", `text-${color}-500`)} />
            </div>
            <span className="text-sm font-medium">{activity.entityType || (activity.entity?.type || 'System')}</span>
          </div>
          <Badge variant="outline" className={cn(statusColors[activity.status])}>
            {activity.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-0">
        <h3 className="font-medium mb-1">{activity.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
        
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={activity.user?.avatar} />
            <AvatarFallback className="text-xs">{getUserInitial()}</AvatarFallback>
          </Avatar>
          <span>{getUserName()}</span>
          <span className="text-xs ml-auto">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 flex justify-between gap-2 mt-2">
        <Button variant="ghost" size="sm" className="text-xs">
          View Details
        </Button>
        {entityUrl !== '#' && (
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <Link to={entityUrl}>
              {activity.entity?.type || activity.entityType || 'View'}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
