
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Download, ExternalLink, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Opportunity } from '@/types/sales-types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface QuoteGeneratorProps {
  opportunity: Opportunity;
  onQuoteCreated: () => void;
}

// Placeholder quote data structure
interface Quote {
  id: string;
  name: string;
  value: number;
  createdAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  expiresAt: string;
}

export function QuoteGenerator({ opportunity, onQuoteCreated }: QuoteGeneratorProps) {
  const [isCreateQuoteDialogOpen, setIsCreateQuoteDialogOpen] = useState(false);
  
  // Placeholder quotes
  const quotes: Quote[] = [
    {
      id: '1',
      name: 'Initial Quote',
      value: opportunity.value * 0.95,
      createdAt: '2025-04-02T10:30:00Z',
      status: 'sent',
      expiresAt: '2025-05-02T10:30:00Z'
    },
    {
      id: '2',
      name: 'Revised Quote',
      value: opportunity.value,
      createdAt: '2025-04-05T14:15:00Z',
      status: 'draft',
      expiresAt: '2025-05-05T14:15:00Z'
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quotes</CardTitle>
        <Button onClick={() => setIsCreateQuoteDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Quote
        </Button>
      </CardHeader>
      <CardContent>
        {quotes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No quotes have been created yet
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{quote.name}</h4>
                    <div className="text-muted-foreground text-sm">
                      Created on {formatDate(quote.createdAt)}
                    </div>
                  </div>
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Quote Value</div>
                    <div className="font-medium">{formatCurrency(quote.value)}</div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Expires: {formatDate(quote.expiresAt)}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  
                  {quote.status === 'draft' && (
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <Dialog open={isCreateQuoteDialogOpen} onOpenChange={setIsCreateQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Quote</DialogTitle>
          </DialogHeader>
          
          <p className="text-center text-muted-foreground py-8">
            Quote builder coming soon
          </p>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsCreateQuoteDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
