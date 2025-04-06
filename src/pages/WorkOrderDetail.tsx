
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkOrderById, useWorkOrderTasks, useWorkOrderBilling } from '@/hooks/use-work-orders';
import { Loader2, ChevronLeft, Edit, Calendar, Clock, FileText, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { WorkOrderTasksList } from '@/components/work-orders/WorkOrderTasksList';
import { WorkOrderBillingTab } from '@/components/work-orders/WorkOrderBillingTab';

const WorkOrderDetail: React.FC = () => {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  const navigate = useNavigate();
  
  const { data: workOrder, isLoading, error } = useWorkOrderById(workOrderId);
  const { data: tasks = [], isLoading: tasksLoading } = useWorkOrderTasks(workOrderId);
  const { data: billing = [], isLoading: billingLoading } = useWorkOrderBilling(workOrderId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !workOrder) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold">Error Loading Work Order</h2>
          <p>{error instanceof Error ? error.message : 'Work order not found'}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/work-orders')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Work Orders
        </Button>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-slate-100 text-slate-800">Pending</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-slate-500">Low</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500">Medium</Badge>;
      case 'high':
        return <Badge className="bg-amber-500">High</Badge>;
      case 'urgent':
        return <Badge className="bg-red-500">Urgent</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    
    return new Date(dateString).toLocaleString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => navigate('/work-orders')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{workOrder.work_order_number}</h1>
          <div className="flex items-center gap-2">
            {getStatusBadge(workOrder.status)}
            {getPriorityBadge(workOrder.priority)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{workOrder.title}</h2>
            <p className="text-muted-foreground">
              {workOrder.client_name} • {workOrder.site_name}
            </p>
          </div>
          <Button onClick={() => navigate(`/work-orders/${workOrderId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Work Order
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">
                <FileText className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <Clock className="mr-2 h-4 w-4" />
                Tasks ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Work Order Details</CardTitle>
                  <CardDescription>Service and scheduling information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Basic Information</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Service Type:</div>
                          <div className="col-span-2">{workOrder.service_type}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Created:</div>
                          <div className="col-span-2">{formatDate(workOrder.created_at)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Status:</div>
                          <div className="col-span-2">{getStatusBadge(workOrder.status)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Priority:</div>
                          <div className="col-span-2">{getPriorityBadge(workOrder.priority)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Schedule</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Scheduled Start:</div>
                          <div className="col-span-2">{formatDate(workOrder.scheduled_start)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Scheduled End:</div>
                          <div className="col-span-2">{formatDate(workOrder.scheduled_end)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Actual Start:</div>
                          <div className="col-span-2">{formatDate(workOrder.actual_start)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Actual End:</div>
                          <div className="col-span-2">{formatDate(workOrder.actual_end)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Relationships</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Client:</div>
                          <div className="col-span-2">
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-left"
                              onClick={() => navigate(`/clients/${workOrder.client_id}`)}
                            >
                              {workOrder.client_name}
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Site:</div>
                          <div className="col-span-2">
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-left"
                              onClick={() => navigate(`/sites/${workOrder.site_id}`)}
                            >
                              {workOrder.site_name}
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Contract:</div>
                          <div className="col-span-2">
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-left"
                              onClick={() => navigate(`/contracts/${workOrder.contract_id}`)}
                            >
                              View Contract
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Supplier:</div>
                          <div className="col-span-2">
                            {workOrder.supplier_id ? (
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-left"
                                onClick={() => navigate(`/suppliers/${workOrder.supplier_id}`)}
                              >
                                {workOrder.supplier_name}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">Not assigned</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Financial</h3>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Billing Method:</div>
                          <div className="col-span-2">{workOrder.billing_method || 'Not specified'}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Estimated Cost:</div>
                          <div className="col-span-2">{formatCurrency(workOrder.estimated_cost)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="text-muted-foreground">Actual Cost:</div>
                          <div className="col-span-2">{formatCurrency(workOrder.actual_cost)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="whitespace-pre-wrap">{workOrder.description || 'No description provided'}</p>
                  </div>
                  
                  {workOrder.special_instructions && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                          Special Instructions
                        </h3>
                        <p className="whitespace-pre-wrap">{workOrder.special_instructions}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks">
              <WorkOrderTasksList 
                workOrderId={workOrderId!} 
                tasks={tasks} 
                isLoading={tasksLoading} 
              />
            </TabsContent>
            
            <TabsContent value="billing">
              <WorkOrderBillingTab 
                workOrderId={workOrderId!} 
                billing={billing} 
                isLoading={billingLoading}
                workOrder={workOrder}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Work order activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <div className="text-sm font-medium">Work Order Created</div>
                    <div className="text-sm text-muted-foreground">{formatDate(workOrder.created_at)}</div>
                  </div>
                </div>
                
                {/* Sample timeline entries - in a real app these would be fetched from the API */}
                {workOrder.status !== 'pending' && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <div className="text-sm font-medium">Status Changed to {workOrder.status}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(workOrder.updated_at)}</div>
                    </div>
                  </div>
                )}
                
                {workOrder.actual_start && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <div className="text-sm font-medium">Work Started</div>
                      <div className="text-sm text-muted-foreground">{formatDate(workOrder.actual_start)}</div>
                    </div>
                  </div>
                )}
                
                {workOrder.actual_end && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <div className="text-sm font-medium">Work Completed</div>
                      <div className="text-sm text-muted-foreground">{formatDate(workOrder.actual_end)}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Work
                </Button>
                <Button variant="outline" className="justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderDetail;
