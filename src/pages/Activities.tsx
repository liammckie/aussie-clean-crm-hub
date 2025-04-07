
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
import { Grid, List, TableProperties, CalendarDays, ArrowUpRight, Download, Filter } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ActivityDeepDive from '@/components/activities/ActivityDeepDive';

// Import mock activities for now
import { mockActivities } from '@/data/mockActivities';

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table' | 'calendar'>('list');
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isLiveUpdates, setIsLiveUpdates] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Simulate live updates when turned on
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isLiveUpdates) {
      interval = setInterval(() => {
        const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
        const newActivity = {
          ...randomActivity,
          id: `live-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: `Live Update: ${randomActivity.title}`,
        };
        
        setActivities(prev => [newActivity, ...prev]);
      }, 20000); // Add a new activity every 20 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveUpdates]);

  // Filter activities based on selected type
  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filterType);

  const handleFilterChange = (type: ActivityType | 'all') => {
    setAnimateIn(false);
    setTimeout(() => {
      setFilterType(type);
      setAnimateIn(true);
    }, 300);
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const getRelatedActivities = (activity: Activity): Activity[] => {
    // In a real app, this would fetch related activities based on context
    // For the demo, we'll just return a few random activities
    return activities
      .filter(a => a.id !== activity.id)
      .filter(a => a.entityType === activity.entityType || a.type === activity.type)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-radial-gradient min-h-[calc(100vh-120px)] rounded-2xl p-6 relative overflow-hidden">
        {/* Background decoration elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-50">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-500/5 blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Activities</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <Heading title="Activities & Timeline" />
              <p className="text-muted-foreground">
                Monitor and track all system activities and user events
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-refresh" 
                  checked={isLiveUpdates}
                  onCheckedChange={setIsLiveUpdates}
                />
                <Label htmlFor="auto-refresh">Live Updates</Label>
              </div>
              <Button variant="outline" className="flex gap-2">
                <Download size={18} />
                Export Data
              </Button>
            </div>
          </div>

          <div className={`space-y-8 transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Activity Statistics Cards */}
            <ActivityStats />
            
            <Card className="backdrop-blur-sm bg-white/40 border-white/20 shadow-xl">
              <CardHeader className="border-b border-border/30 pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl">Activity Timeline</CardTitle>
                    <CardDescription>
                      Recent activities and events in your system
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button 
                      variant={viewMode === 'list' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setViewMode('list')}
                      className="gap-1.5"
                    >
                      <List className="h-4 w-4" /> List
                    </Button>
                    <Button 
                      variant={viewMode === 'grid' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setViewMode('grid')}
                      className="gap-1.5"
                    >
                      <Grid className="h-4 w-4" /> Grid
                    </Button>
                    <Button 
                      variant={viewMode === 'table' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setViewMode('table')}
                      className="gap-1.5"
                    >
                      <TableProperties className="h-4 w-4" /> Table
                    </Button>
                    <Button 
                      variant={viewMode === 'calendar' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setViewMode('calendar')}
                      className="gap-1.5"
                    >
                      <CalendarDays className="h-4 w-4" /> Calendar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="mb-6 bg-white/50">
                    <TabsTrigger value="all">All Activities</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="work">Work Orders</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="all" className="mt-0">
                    {showFilters && (
                      <div className="mb-6 p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-border/30 shadow-sm">
                        <ActivityFilters 
                          onFilterChange={handleFilterChange} 
                          activeFilter={filterType}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-end mb-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowFilters(!showFilters)}
                        size="sm"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                      </Button>
                    </div>

                    {viewMode === 'calendar' ? (
                      <div className="h-[500px] flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg border border-border/30">
                        <p className="text-muted-foreground">Calendar view coming soon</p>
                      </div>
                    ) : viewMode === 'table' ? (
                      <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-border/30 shadow-sm overflow-hidden">
                        <ActivityTable 
                          activities={filteredActivities} 
                          onActivityClick={handleActivityClick}
                        />
                      </div>
                    ) : (
                      <div className={`transition-all duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                        <ActivityList 
                          activities={filteredActivities} 
                          viewMode={viewMode === 'grid' ? 'grid' : 'list'} 
                          onActivityClick={handleActivityClick}
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="system" className="mt-0">
                    <div className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">System activities will be displayed here</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="clients" className="mt-0">
                    <div className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">Client activities will be displayed here</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="work" className="mt-0">
                    <div className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">Work order activities will be displayed here</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="users" className="mt-0">
                    <div className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">User activities will be displayed here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedActivity && (
        <ActivityDeepDive
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          relatedActivities={getRelatedActivities(selectedActivity)}
        />
      )}
    </div>
  );
};

export default Activities;
