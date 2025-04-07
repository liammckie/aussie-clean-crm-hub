
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { ActivityStats } from '@/components/activities/ActivityStats';
import { ActivityFilters } from '@/components/activities/ActivityFilters';
import { ActivityList } from '@/components/activities/ActivityList';
import ActivityTable from '@/components/activities/ActivityTable';
import { Activity, ActivityType } from '@/types/activity-types';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

// Import mock activities for now
// In a real app, this would come from an API
import { mockActivities } from '@/data/mockActivities';

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('list');
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter activities based on selected type
  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filterType);

  const handleFilterChange = (type: ActivityType | 'all') => {
    setFilterType(type);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Activities</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activities & Events</h1>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-1" /> List
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4 mr-1" /> Grid
          </Button>
          <Button 
            variant={viewMode === 'table' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('table')}
          >
            <Grid className="h-4 w-4 mr-1" /> Table
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Activity Statistics Cards */}
        <ActivityStats />
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  Recent activities and events in your system
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showFilters && (
              <div className="mb-6">
                <ActivityFilters 
                  onFilterChange={handleFilterChange} 
                  activeFilter={filterType}
                />
              </div>
            )}

            {viewMode === 'table' ? (
              <ActivityTable activities={filteredActivities} />
            ) : (
              <ActivityList 
                activities={filteredActivities} 
                viewMode={viewMode === 'grid' ? 'grid' : 'list'} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Activities;
