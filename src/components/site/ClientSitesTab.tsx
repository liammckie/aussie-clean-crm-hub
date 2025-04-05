
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSites } from '@/hooks/use-sites';
import { SiteForm, SiteFormData } from '@/components/site/SiteForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SiteListTable } from './SiteListTable';
import { generateSampleSite } from '@/utils/testDataGenerator';
import { toast } from 'sonner';

interface ClientSitesTabProps {
  clientId: string;
}

export function ClientSitesTab({ clientId }: ClientSitesTabProps) {
  const { 
    sites, 
    isLoadingSites, 
    refetchSites, 
    createSite, 
    isCreatingSite 
  } = useSites(clientId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [sampleSite, setSampleSite] = useState<SiteFormData & { client_id: string }>(() => 
    generateSampleSite(clientId)
  );

  const handleCreateSite = async (data: SiteFormData) => {
    await createSite({
      ...data,
      client_id: clientId,
    });
    setIsDialogOpen(false);
    refetchSites();
  };

  const toggleSampleData = () => {
    setShowSampleData(!showSampleData);
    if (!showSampleData) {
      // Generate new sample data each time
      setSampleSite(generateSampleSite(clientId));
      toast.success('Sample site data loaded. You can edit it before submitting.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Sites</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleSampleData}
          >
            {showSampleData ? 'Clear Sample' : 'Load Sample Data'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Site</DialogTitle>
              </DialogHeader>
              <SiteForm 
                onSubmit={handleCreateSite} 
                isLoading={isCreatingSite}
                initialData={showSampleData ? sampleSite : undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingSites ? (
          <div className="text-center py-4">Loading sites...</div>
        ) : sites && sites.length > 0 ? (
          <SiteListTable 
            sites={sites} 
            clientId={clientId} 
            onSiteUpdated={refetchSites}
          />
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No sites have been added yet. Use the "Add Site" button to create one.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Create a placeholder SiteListTable component if it doesn't exist
export function SiteListTable({ sites, clientId, onSiteUpdated }: any) {
  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">Site Name</th>
            <th className="text-left py-2">Location</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site: any) => (
            <tr key={site.id} className="border-t">
              <td className="py-2">{site.site_name}</td>
              <td className="py-2">{site.suburb}, {site.state}</td>
              <td className="py-2">{site.status}</td>
              <td className="py-2">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
