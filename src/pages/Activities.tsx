
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityList } from '@/components/activities/ActivityList';
import { ActivityStats } from '@/components/activities/ActivityStats';
import { ActivityFilters } from '@/components/activities/ActivityFilters';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { 
  Download,
  Filter,
  LayoutGrid,
  List,
  RefreshCw,
  Home
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { mockActivities } from '@/data/mockActivities';
import { Activity } from '@/types/activity-types';
import { AppLogger, LogCategory } from '@/utils/logging';

const Activities = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [isLoading, setIsLoading] = useState(false);
  
  const refreshActivities = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      AppLogger.info(LogCategory.UI, 'Refreshed activities');
      setActivities(mockActivities);
      setIsLoading(false);
    }, 800);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-0 max-w-full">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Activity Log</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center justify-between mb-6">
          <Heading title="Activity Log" description="Track system events and user actions" />
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshActivities}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <ActivityStats />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between my-6 gap-4">
          <Tabs defaultValue="all" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="all">All Activities</TabsTrigger>
              <TabsTrigger value="user">User Actions</TabsTrigger>
              <TabsTrigger value="system">System Events</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2 ml-auto">
            <ActivityFilters />
            <div className="border-l pl-2 flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <ActivityList activities={activities} viewMode={viewMode} />
        </TabsContent>
        <TabsContent value="user" className="mt-0">
          <ActivityList 
            activities={activities.filter(a => !a.type.startsWith('system_'))} 
            viewMode={viewMode} 
          />
        </TabsContent>
        <TabsContent value="system" className="mt-0">
          <ActivityList 
            activities={activities.filter(a => a.type.startsWith('system_'))}
            viewMode={viewMode} 
          />
        </TabsContent>
      </div>
    </MainLayout>
  );
};

export default Activities;
