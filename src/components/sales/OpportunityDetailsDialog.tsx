
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Calendar, DollarSign, User, Users, Phone, Mail, MapPin } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Opportunity } from '@/types/sales-types';
import { OpportunityForm } from './OpportunityForm';
import { ContactBuilder } from './ContactBuilder';
import { ActivityLog } from './ActivityLog';
import { QuoteGenerator } from './QuoteGenerator';

interface OpportunityDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: Opportunity;
  onUpdate: () => void;
}

export function OpportunityDetailsDialog({ 
  isOpen, 
  onOpenChange, 
  opportunity, 
  onUpdate 
}: OpportunityDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Opportunity' : opportunity.title}
          </DialogTitle>
        </DialogHeader>
        
        {isEditing ? (
          <OpportunityForm 
            opportunity={opportunity} 
            onSave={() => {
              setIsEditing(false);
              onUpdate();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="col-span-2">
                    <CardHeader className="pb-2">
                      <h3 className="text-sm font-medium">Opportunity Information</h3>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Client</p>
                          <p className="text-sm">{opportunity.client_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Value</p>
                          <p className="text-sm">{formatCurrency(opportunity.value)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Expected Close Date</p>
                          <p className="text-sm">{formatDate(opportunity.expected_close_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Probability</p>
                          <p className="text-sm">{opportunity.probability}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Stage</p>
                          <p className="text-sm">{opportunity.stage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                          <p className="text-sm">{opportunity.assigned_to}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="text-sm whitespace-pre-wrap">{opportunity.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <h3 className="text-sm font-medium">Client Information</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                        <p className="text-sm">{opportunity.client_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Primary Contact</p>
                        <div className="flex items-center text-sm">
                          <User className="h-3 w-3 mr-1" />
                          <span>{opportunity.contact_name || 'N/A'}</span>
                        </div>
                        {opportunity.contact_email && (
                          <div className="flex items-center text-sm mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{opportunity.contact_email}</span>
                          </div>
                        )}
                        {opportunity.contact_phone && (
                          <div className="flex items-center text-sm mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{opportunity.contact_phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          // Logic to convert prospect to client
                          console.log('Convert prospect to client');
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Convert to Client
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="contacts">
                <ContactBuilder opportunityId={opportunity.id} onContactsUpdated={onUpdate} />
              </TabsContent>
              
              <TabsContent value="activities">
                <ActivityLog opportunityId={opportunity.id} onActivityUpdated={onUpdate} />
              </TabsContent>
              
              <TabsContent value="quotes">
                <QuoteGenerator opportunity={opportunity} onQuoteCreated={onUpdate} />
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Opportunity
              </Button>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
