
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSites, useCreateSite, useDeleteSite } from '@/hooks/use-sites';
import { SiteCard } from '@/components/site/SiteCard';
import { SiteInsertData } from '@/services/site/types';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const Sites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { sites, isLoadingSites, errorSites, refetchSites } = useSites();
  const createSite = useCreateSite();
  const deleteSite = useDeleteSite();

  const handleCreateSite = async (data: SiteInsertData) => {
    try {
      await createSite.mutateAsync(data);
      toast.success('Site created successfully');
      refetchSites();
    } catch (error: any) {
      toast.error(`Error creating site: ${error.message}`);
    }
  };

  const handleDeleteSite = async (id: string) => {
    try {
      await deleteSite.mutateAsync(id);
      toast.success('Site deleted successfully');
      refetchSites();
    } catch (error: any) {
      toast.error(`Error deleting site: ${error.message}`);
    }
  };

  // Filter sites based on search term
  const filteredSites = sites ? sites.filter(site => 
    site.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.site_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.suburb.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (isLoadingSites) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (errorSites) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load sites: {errorSites.message}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => refetchSites()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Site
        </Button>
      </div>
      
      <div className="flex mb-6">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sites..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>
      
      {filteredSites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No sites found</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add your first site
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} onDelete={() => handleDeleteSite(site.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sites;
