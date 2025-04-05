
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContractForm } from '@/components/contracts/ContractForm';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AppLogger, LogCategory } from '@/utils/logging';

const NewContract = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  useEffect(() => {
    AppLogger.info(
      LogCategory.CONTRACT, 
      'New Contract page mounted', 
      { clientId: clientId || 'none' }
    );
  }, [clientId]);
  
  return (
    <div className="container mx-auto p-6">
      <Heading
        title="Create New Contract"
        description="Set up a new service contract for a client"
      />
      <Separator className="my-4" />
      
      <ContractForm clientId={clientId || undefined} />
    </div>
  );
};

export default NewContract;
