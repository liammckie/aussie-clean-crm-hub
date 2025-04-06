
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useClientSites } from '@/hooks/use-sites';
import { SiteForm, SiteFormData } from '@/components/site/SiteForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SiteListTable } from './SiteListTable';
import { generateSampleSite } from '@/utils/testDataGenerator';
import { toast } from 'sonner';
import { SiteInsertData } from '@/services/site/types';

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
  } = useClientSites(clientId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [sampleSite, setSampleSite] = useState<SiteFormData & { client_id: string }>(() => 
    generateSampleSite(clientId)
  );

  const handleCreateSite = async (data: SiteFormData) => {
    // Make sure all required fields are present before creating site
    const siteData: SiteInsertData = {
      client_id: clientId,
      site_name: data.site_name,
      site_code: data.site_code,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || null,
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
      site_contact_name: data.site_contact_name || null,
      site_contact_email: data.site_contact_email || null,
      site_contact_phone: data.site_contact_phone || null,
      status: data.status,
      site_type: data.site_type || null,
      square_meters: data.square_meters || null,
      region: data.region || null,
      notes: data.notes || null,
      induction_required: data.induction_required || false
    };
    
    createSite(siteData);
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
