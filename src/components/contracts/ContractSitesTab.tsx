
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppLogger, LogCategory } from '@/utils/logging';

interface ContractSitesTabProps {
  contractId: string;
}

export function ContractSitesTab({ contractId }: ContractSitesTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [linkedSites, setLinkedSites] = useState<any[]>([]);
  const navigate = useNavigate();

  // Load contract sites (placeholder - would be replaced with actual data fetching)
  useEffect(() => {
    const fetchContractSites = async () => {
      try {
        // This would be an actual API call in production
        setIsLoading(true);
        // Placeholder for now
        setLinkedSites([]);
        setIsLoading(false);
      } catch (error) {
        AppLogger.error(
          LogCategory.CONTRACT,
          `Error fetching contract sites: ${error}`,
          { contractId }
        );
        setIsLoading(false);
      }
    };
    
    fetchContractSites();
  }, [contractId]);

  const handleAddSite = () => {
    setIsAddDialogOpen(false);
    // Navigate to site creation with contract pre-selected
    navigate(`/sites/new?contractId=${contractId}`);
  };

  const handleLinkExistingSite = () => {
    setIsAddDialogOpen(false);
    // Navigate to site selection page
    navigate(`/sites?selectFor=${contractId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Contract Sites</CardTitle>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Site
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : linkedSites.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedSites.map(site => (
                <TableRow key={site.id} className="cursor-pointer" onClick={() => navigate(`/sites/${site.id}`)}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.address}</TableCell>
                  <TableCell>{site.status}</TableCell>
                  <TableCell>{new Date(site.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No sites associated with this contract yet</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Link Site to Contract
            </Button>
          </div>
        )}

        {/* Add Site Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Site to Contract</DialogTitle>
              <DialogDescription>
                Add an existing site or create a new site to link to this contract.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Button onClick={handleLinkExistingSite}>Link Existing Site</Button>
              <Button variant="outline" onClick={handleAddSite}>Create New Site</Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
