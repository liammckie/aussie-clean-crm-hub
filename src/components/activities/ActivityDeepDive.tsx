
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Calendar,
  User,
  Clock,
  FileText,
  Building,
  MapPin,
  Tag,
  BarChart3,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import { Activity } from '@/types/activity-types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ActivityDeepDiveProps {
  activity: Activity;
  onClose: () => void;
  relatedActivities?: Activity[];
}

export function ActivityDeepDive({ activity, onClose, relatedActivities = [] }: ActivityDeepDiveProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'related' | 'impact'>('details');
  const [showFullJson, setShowFullJson] = useState(false);

  if (!activity) return null;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return dateStr;
    }
  };

  const getEntityLink = () => {
    if (!activity.entityId) return '#';
    
    switch (activity.entityType) {
      case 'client':
        return `/clients/${activity.entityId}`;
      case 'contract':
        return `/contracts/${activity.entityId}`;
      case 'work_order':
        return `/work-orders/${activity.entityId}`;
      case 'supplier':
        return `/suppliers/${activity.entityId}`;
      default:
        return '#';
    }
  };
  
  const renderMetadata = () => {
    if (!activity.metadata) return null;
    
    try {
      const metadata = typeof activity.metadata === 'string' 
        ? JSON.parse(activity.metadata) 
        : activity.metadata;
      
      if (showFullJson) {
        return (
          <div className="mt-4">
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs">
              {JSON.stringify(metadata, null, 2)}
            </pre>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFullJson(false)} 
              className="mt-2"
            >
              Show Less
            </Button>
          </div>
        );
      }
      
      return (
        <div className="mt-4">
          <ul className="space-y-2">
            {Object.entries(metadata).slice(0, 4).map(([key, value]) => (
              <li key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium truncate max-w-[200px]">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </li>
            ))}
          </ul>
          {Object.keys(metadata).length > 4 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFullJson(true)} 
              className="mt-2"
            >
              Show More
            </Button>
          )}
        </div>
      );
    } catch (e) {
      return <div className="text-sm text-muted-foreground mt-2">Error parsing metadata</div>;
    }
  };

  return (
    <Dialog open={!!activity} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Activity Deep Dive
            <Badge variant={activity.type === 'system' ? 'outline' : 'default'}>
              {activity.type}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed information and context for this activity
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card className="col-span-3 md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{activity.title}</CardTitle>
                <Badge 
                  variant={activity.status === 'success' ? 'success' : 
                          activity.status === 'warning' ? 'warning' : 
                          activity.status === 'error' ? 'destructive' : 'outline'}
                >
                  {activity.status}
                </Badge>
              </div>
              <CardDescription>{activity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" /> 
                  <span className="text-sm text-muted-foreground">Timestamp:</span>
                  <span className="text-sm">{formatDate(activity.timestamp)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" /> 
                  <span className="text-sm text-muted-foreground">Actor:</span>
                  <span className="text-sm">{activity.actor || 'System'}</span>
                </div>
                
                {activity.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" /> 
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="text-sm">{activity.duration}ms</span>
                  </div>
                )}
                
                {activity.entityType && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" /> 
                    <span className="text-sm text-muted-foreground">Entity Type:</span>
                    <span className="text-sm capitalize">{activity.entityType.replace('_', ' ')}</span>
                  </div>
                )}
                
                {activity.entityId && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-muted-foreground" /> 
                    <span className="text-sm text-muted-foreground">Entity ID:</span>
                    <a 
                      href={getEntityLink()} 
                      className="text-sm text-primary hover:underline"
                    >
                      {activity.entityId.substring(0, 8)}...
                    </a>
                  </div>
                )}
                
                {activity.clientName && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" /> 
                    <span className="text-sm text-muted-foreground">Client:</span>
                    <span className="text-sm">{activity.clientName}</span>
                  </div>
                )}
                
                {activity.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> 
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="text-sm">{activity.location}</span>
                  </div>
                )}
                
                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" /> 
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {activity.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <div className="font-medium mb-2">Additional Data</div>
                  {renderMetadata()}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="col-span-3 md:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Impact Level</div>
                    <div className="flex items-center gap-1 mt-1">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        {activity.impactLevel || 'Low'} Impact
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Category</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm capitalize">
                        {activity.category || activity.type || 'General'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Related Activities</div>
                    <div className="text-sm mt-1">
                      {relatedActivities.length} related {relatedActivities.length === 1 ? 'activity' : 'activities'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {relatedActivities.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Related Activities</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {relatedActivities.slice(0, 5).map((relatedActivity, index) => (
                      <li key={index} className="text-sm border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="font-medium truncate">{relatedActivity.title}</div>
                        <div className="flex justify-between items-center mt-1">
                          <Badge variant="outline" className="text-xs">
                            {relatedActivity.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(relatedActivity.timestamp)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {relatedActivities.length > 5 && (
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View All Related
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {activity.details && (
            <Card className="col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Activity Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Before</TableHead>
                      <TableHead>After</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(activity.details).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell>{(typeof value === 'object' && value.before) ? String(value.before) : '-'}</TableCell>
                        <TableCell>{(typeof value === 'object' && value.after) ? String(value.after) : String(value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ActivityDeepDive;
