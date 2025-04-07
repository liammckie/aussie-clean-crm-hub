
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  UserCircle, 
  Globe, 
  FileText,
  ShieldAlert,
  Users,
  ClipboardList,
  Truck,
  AlertCircle,
  Server
} from "lucide-react";
import { Activity } from "@/types/activity-types";
import { formatDistanceToNow, parseISO } from "date-fns";

// This is a utility function to convert CamelCase or snake_case to Title Case
const formatTitle = (text: string): string => {
  if (!text) return "";
  // Convert snake_case to spaces
  const withSpaces = text.replace(/_/g, ' ');
  // Convert camelCase to spaces
  const withAllSpaces = withSpaces.replace(/([A-Z])/g, ' $1');
  // Capitalize first letter of each word
  return withAllSpaces
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "system":
      return <Server className="h-5 w-5" />;
    case "user":
      return <UserCircle className="h-5 w-5" />;
    case "client":
      return <Users className="h-5 w-5" />;
    case "contract":
      return <FileText className="h-5 w-5" />;
    case "work_order":
      return <ClipboardList className="h-5 w-5" />;
    case "supplier":
      return <Truck className="h-5 w-5" />;
    default:
      return <Globe className="h-5 w-5" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800 border-green-200";
    case "warning":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "error":
      return "bg-red-100 text-red-800 border-red-200";
    case "info":
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

interface ActivityItemProps {
  activity: Activity;
  onClick?: (activity: Activity) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onClick }) => {
  const formattedTime = formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true });

  const handleClick = () => {
    if (onClick) {
      onClick(activity);
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className={`mt-1 rounded-full p-2 bg-gray-100 text-gray-700 ${activity.status === 'error' ? 'text-red-600' : ''}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 space-y-1 overflow-hidden">
            <div className="flex justify-between">
              <h4 className="font-medium line-clamp-1">{activity.title}</h4>
              <div className="space-x-1 shrink-0">
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
                {activity.entityType && (
                  <Badge variant="outline">
                    {formatTitle(activity.entityType)}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {activity.description}
            </p>
            <div className="flex flex-wrap justify-between items-center mt-2 text-sm">
              <span className="text-muted-foreground">
                {formattedTime}
              </span>
              {activity.actor && (
                <span className="flex items-center text-muted-foreground">
                  <UserCircle className="h-3 w-3 mr-1" />
                  {activity.actor}
                </span>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                className="mt-2 h-8 w-full md:w-auto md:mt-0"
              >
                Deep Dive
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityItem;
