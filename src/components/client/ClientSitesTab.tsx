
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SiteForm, SiteFormData } from '@/components/site/SiteForm';
import { toast } from 'sonner';
import { useClientSites, useCreateSite } from '@/hooks/use-sites';
import { SiteData, SiteInsertData } from '@/services/site';

interface ClientSitesTabProps {
  clientId: string;
}

export function ClientSitesTab({ clientId }: ClientSitesTabProps) {
  const [isSiteDialogOpen, setIsSiteDialogOpen] = useState(false);
  
  const {
    sites,
    isLoadingSites,
    refetchSites,
    createSite,
    isCreatingSite
  } = useClientSites(clientId);

  const handleSiteSubmit = async (data: SiteFormData) => {
    if (!clientId) return;
    
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
      induction_required: data.induction_required
    };
    
    createSite(siteData);
    setIsSiteDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Client Sites</CardTitle>
        <Dialog open={isSiteDialogOpen} onOpenChange={setIsSiteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-2" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto py-4">
              <SiteForm onSubmit={handleSiteSubmit} isLoading={isCreatingSite} />
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoadingSites ? (
          <div className="text-center py-8">Loading sites...</div>
        ) : sites && sites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site) => (
              <Card key={site.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{site.site_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">Site Code: <span className="text-foreground">{site.site_code}</span></p>
                    <p className="text-muted-foreground">Address: <span className="text-foreground">
                      {site.address_line_1}
                      {site.address_line_2 && `, ${site.address_line_2}`}, 
                      {site.suburb}, {site.state} {site.postcode}
                    </span></p>
                    {site.site_type && (
                      <p className="text-muted-foreground">Type: <span className="text-foreground capitalize">{site.site_type}</span></p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sites have been added yet.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsSiteDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first site
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
