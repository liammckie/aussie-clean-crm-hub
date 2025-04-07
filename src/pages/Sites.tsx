
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Grid2X2, 
  List, 
  Search, 
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { useSites, useDeleteSite } from '@/hooks/use-sites';
import { SiteCard } from '@/components/site/SiteCard';
import { SiteData } from '@/services/site/types';
import { toast } from 'sonner';

const Sites = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { sites, isLoadingSites, errorSites, refetchSites } = useSites();
  const deleteMutation = useDeleteSite();

  const handleDeleteSite = async (siteId: string) => {
    try {
      await deleteMutation.mutateAsync(siteId);
      toast.success('Site deleted successfully');
      refetchSites();
    } catch (error: any) {
      toast.error(`Failed to delete site: ${error.message}`);
    }
  };

  const filteredSites = Array.isArray(sites)
    ? sites.filter(
        (site) =>
          site.site_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.site_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.address_line_1.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your service locations.
          </p>
        </div>
        <Button onClick={() => navigate('/sites/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Site
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sites..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
            <TabsList className="grid w-24 grid-cols-2">
              <TabsTrigger value="grid">
                <Grid2X2 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sort by Name</DropdownMenuItem>
              <DropdownMenuItem>Sort by Date</DropdownMenuItem>
              <DropdownMenuItem>Sort by Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoadingSites ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : errorSites ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-2">Error loading sites</p>
              <p className="text-muted-foreground mb-4">{errorSites.message}</p>
              <Button onClick={() => refetchSites()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : filteredSites.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No sites found</CardTitle>
            <CardDescription>
              {searchQuery
                ? "No sites match your search criteria"
                : "You haven't added any sites yet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/sites/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Site
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TabsContent value={viewMode} className="mt-0">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSites.map((site) => (
                <SiteCard 
                  key={site.id} 
                  site={site} 
                  onDelete={async () => handleDeleteSite(site.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Site list table view - will be implemented later */}
              <p>List view coming soon!</p>
            </div>
          )}
        </TabsContent>
      )}
    </div>
  );
};

export default Sites;
