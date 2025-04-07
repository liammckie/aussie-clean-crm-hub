
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Building } from 'lucide-react';
import { SiteForm } from '@/components/site/SiteForm';
import { useClientSites } from '@/hooks/use-sites';
import { SiteInsertData, SiteRecord, SiteData } from '@/services/site/types';
import { SiteListTable } from '@/components/site/SiteListTable';
import { toast } from 'sonner';
import { useCreateSite } from '@/hooks/use-sites';

interface ClientSitesTabProps {
  clientId: string;
}

export function ClientSitesTab({ clientId }: ClientSitesTabProps) {
  const [isNewSiteDialogOpen, setIsNewSiteDialogOpen] = useState(false);
  const { sites, isLoadingSites, errorSites, refetchSites } = useClientSites(clientId);
  const createSiteMutation = useCreateSite();
  
  const handleCreateSite = async (siteData: SiteInsertData) => {
    try {
      await createSiteMutation.mutateAsync({
        ...siteData,
        client_id: clientId,
        region: siteData.region || 'Default', // Support the region field
      });
      toast.success('Site added successfully');
      setIsNewSiteDialogOpen(false);
      refetchSites();
    } catch (error) {
      console.error('Error creating site:', error);
      toast.error('Failed to create site');
    }
  };

  if (isLoadingSites) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (errorSites) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
            Error loading sites: {errorSites.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Make sure sites is treated as an array
  const sitesList = Array.isArray(sites) ? sites : [];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Sites</CardTitle>
        <Dialog open={isNewSiteDialogOpen} onOpenChange={setIsNewSiteDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
            </DialogHeader>
            <SiteForm clientId={clientId} onSubmit={handleCreateSite} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {sitesList.length > 0 ? (
          <SiteListTable sites={sitesList} />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sites Found</h3>
            <p className="text-muted-foreground mb-4">
              This client does not have any sites added yet.
            </p>
            <Button onClick={() => setIsNewSiteDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Site
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
