
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateWorkOrder } from '@/hooks/use-work-orders';
import { workOrderFormSchema, WorkOrderCreateData } from '@/types/work-order-types';
import { WorkOrderForm } from '@/components/work-orders/WorkOrderForm';

const NewWorkOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get potential pre-filled values from URL params
  const clientId = searchParams.get('clientId') || '';
  const siteId = searchParams.get('siteId') || '';
  const contractId = searchParams.get('contractId') || '';
  
  const form = useForm<WorkOrderCreateData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      scheduled_start: new Date().toISOString(),
      client_id: clientId || undefined,
      site_id: siteId || undefined,
      contract_id: contractId || undefined,
      service_type: '',
    }
  });
  
  const { mutateAsync: createWorkOrder, isPending } = useCreateWorkOrder();
  
  const onSubmit = async (data: WorkOrderCreateData) => {
    try {
      const newWorkOrder = await createWorkOrder(data);
      navigate(`/work-orders/${newWorkOrder.id}`);
    } catch (error) {
      console.error('Error creating work order:', error);
      // Error toast is shown by the mutation error handler
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/work-orders')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Work Orders
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Work Order</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkOrderForm 
            form={form} 
            onSubmit={onSubmit}
            isSubmitting={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewWorkOrder;
