
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Calendar, Grid, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSites } from '@/hooks/use-sites';
import { SiteCard } from '@/components/site/SiteCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function Sites() {
  const navigate = useNavigate();
  const { sites, isLoadingSites, errorSites, refetchSites } = useSites();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Placeholder counts until we have actual data
  const sitesCount = {
    total: sites?.length || 0,
    active: sites?.filter(site => site.status === 'active').length || 0,
    pending: sites?.filter(site => site.status === 'pending_activation').length || 0
  };

  // Filter sites based on search term and filters
  const filteredSites = sites?.filter(site => {
    if (searchTerm && !site.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !site.suburb?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !site.address_line_1?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (filterState && site.state !== filterState) {
      return false;
    }

    if (filterType && site.site_type !== filterType) {
      return false;
    }

    return true;
  });

  // Handle site deletion
  const handleDeleteSite = (siteId: string) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      // In a real app, this would call the deleteSite mutation
      console.log('Deleting site:', siteId);
    }
  };
  
  // Handle site edit
  const handleEditSite = (siteId: string) => {
    navigate(`/sites/${siteId}/edit`);
  };

  if (isLoadingSites) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Heading title="Site Management" description="Manage work locations and client sites" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sites</CardTitle>
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-100 rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (errorSites) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Heading title="Site Management" description="Manage work locations and client sites" />
          </div>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Error Loading Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{errorSites.message}</p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100" 
              onClick={() => refetchSites()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Heading title="Site Management" description="Manage work locations and client sites" />
          <Separator className="my-4" />
        </div>
        <Button className="flex items-center gap-2" onClick={() => navigate('/sites/new')}>
          <Plus className="h-4 w-4" />
          Add New Site
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sitesCount.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sitesCount.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sitesCount.pending}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <CardTitle>Sites</CardTitle>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search sites..." 
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterState} onValueChange={setFilterState}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All states</SelectItem>
                  <SelectItem value="NSW">New South Wales</SelectItem>
                  <SelectItem value="VIC">Victoria</SelectItem>
                  <SelectItem value="QLD">Queensland</SelectItem>
                  <SelectItem value="WA">Western Australia</SelectItem>
                  <SelectItem value="SA">South Australia</SelectItem>
                  <SelectItem value="TAS">Tasmania</SelectItem>
                  <SelectItem value="ACT">ACT</SelectItem>
                  <SelectItem value="NT">Northern Territory</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'map' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setViewMode('map')}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Sites</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {viewMode === 'map' ? (
                <div className="h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Map view coming soon</p>
                </div>
              ) : filteredSites && filteredSites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSites.map((site) => (
                    <SiteCard
                      key={site.id}
                      id={site.id}
                      siteName={site.site_name}
                      address={site.address_line_1}
                      suburb={site.suburb}
                      state={site.state}
                      status={site.status}
                      type={site.site_type}
                      contactName={site.site_contact_name}
                      onEdit={() => handleEditSite(site.id)}
                      onDelete={() => handleDeleteSite(site.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No sites found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || filterState ? 
                      'No sites match your search criteria. Try adjusting your filters.' :
                      'There are no sites in the system yet. Create your first site to get started.'}
                  </p>
                  <Button 
                    onClick={() => navigate('/sites/new')}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Site
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              {/* Active sites content */}
              {viewMode === 'map' ? (
                <div className="h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Map view coming soon</p>
                </div>
              ) : filteredSites && filteredSites.filter(site => site.status === 'active').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSites
                    .filter(site => site.status === 'active')
                    .map((site) => (
                      <SiteCard
                        key={site.id}
                        id={site.id}
                        siteName={site.site_name}
                        address={site.address_line_1}
                        suburb={site.suburb}
                        state={site.state}
                        status={site.status}
                        type={site.site_type}
                        contactName={site.site_contact_name}
                        onEdit={() => handleEditSite(site.id)}
                        onDelete={() => handleDeleteSite(site.id)}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No active sites found</h3>
                  <p className="text-muted-foreground mb-6">
                    There are no active sites matching your criteria.
                  </p>
                  <Button 
                    onClick={() => navigate('/sites/new')}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Site
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending">
              {/* Pending sites content */}
              {viewMode === 'map' ? (
                <div className="h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Map view coming soon</p>
                </div>
              ) : filteredSites && filteredSites.filter(site => site.status === 'pending_activation').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSites
                    .filter(site => site.status === 'pending_activation')
                    .map((site) => (
                      <SiteCard
                        key={site.id}
                        id={site.id}
                        siteName={site.site_name}
                        address={site.address_line_1}
                        suburb={site.suburb}
                        state={site.state}
                        status={site.status}
                        type={site.site_type}
                        contactName={site.site_contact_name}
                        onEdit={() => handleEditSite(site.id)}
                        onDelete={() => handleDeleteSite(site.id)}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No pending sites found</h3>
                  <p className="text-muted-foreground mb-6">
                    There are no pending sites matching your criteria.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="inactive">
              {/* Inactive sites content */}
              {viewMode === 'map' ? (
                <div className="h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Map view coming soon</p>
                </div>
              ) : filteredSites && filteredSites.filter(site => site.status === 'inactive').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSites
                    .filter(site => site.status === 'inactive')
                    .map((site) => (
                      <SiteCard
                        key={site.id}
                        id={site.id}
                        siteName={site.site_name}
                        address={site.address_line_1}
                        suburb={site.suburb}
                        state={site.state}
                        status={site.status}
                        type={site.site_type}
                        contactName={site.site_contact_name}
                        onEdit={() => handleEditSite(site.id)}
                        onDelete={() => handleDeleteSite(site.id)}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No inactive sites found</h3>
                  <p className="text-muted-foreground mb-6">
                    There are no inactive sites matching your criteria.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
