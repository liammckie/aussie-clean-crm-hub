
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ContractDetailsTab } from '@/components/contracts/ContractDetailsTab';
import { ContractBillingTab } from '@/components/contracts/ContractBillingTab';
import { ContractSitesTab } from '@/components/contracts/ContractSitesTab';
import { useContracts } from '@/hooks/use-contracts';
import { ArrowLeft, Edit } from 'lucide-react';
import { AppLogger, LogCategory } from '@/utils/logging';

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const contractId = id as string;
  
  const { useContractDetails } = useContracts();
  const { data: contract, isLoading } = useContractDetails(contractId);
  
  useEffect(() => {
    if (contractId) {
      AppLogger.info(
        LogCategory.CONTRACT, 
        'Viewing contract details', 
        { contractId }
      );
    }
  }, [contractId]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!contract) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-semibold text-red-600">Contract Not Found</h2>
          <p className="text-muted-foreground mt-2">The contract you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/contracts')}
          >
            Back to Contracts
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Heading
              title={contract.contract_name}
              description={`Contract Code: ${contract.contract_code}`}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/contracts/${contractId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Contract
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Contract Details</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <ContractDetailsTab contractId={contractId} viewMode="view" />
        </TabsContent>
        
        <TabsContent value="billing">
          <ContractBillingTab contractId={contractId} />
        </TabsContent>
        
        <TabsContent value="sites">
          <ContractSitesTab contractId={contractId} />
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Contract Documents</h3>
            <p className="text-muted-foreground text-center py-8">
              Document management will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractDetail;
