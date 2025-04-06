
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ContractForm } from '@/components/contracts/ContractForm';

const EditContract = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
              title="Edit Contract"
              description="Update contract details"
            />
          </div>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <ContractForm contractId={id} isEdit={true} />
    </div>
  );
};

export default EditContract;
