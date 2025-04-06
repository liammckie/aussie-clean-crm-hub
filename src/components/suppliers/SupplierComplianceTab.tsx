
import React from 'react';
import { useSupplierComplianceDocuments } from '@/hooks/use-suppliers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SupplierComplianceTabProps {
  supplierId: string;
}

export function SupplierComplianceTab({ supplierId }: SupplierComplianceTabProps) {
  const { data: documents, isLoading, error } = useSupplierComplianceDocuments(supplierId);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusIcon = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (expiry < now) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    } else if (expiry < thirtyDaysFromNow) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };
  
  const getStatusText = (expiryDate?: string) => {
    if (!expiryDate) return 'No expiry';
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (expiry < now) {
      return 'Expired';
    } else if (expiry < thirtyDaysFromNow) {
      return 'Expiring soon';
    } else {
      return 'Valid';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Compliance Documents</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 p-4 rounded-md">
            <p className="text-destructive">Error loading compliance documents</p>
          </div>
        ) : documents?.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">No compliance documents found</p>
            <Button variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add First Document
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents?.map((doc) => (
                  <TableRow key={doc.document_id}>
                    <TableCell className="font-medium">{doc.document_name}</TableCell>
                    <TableCell>{doc.document_type}</TableCell>
                    <TableCell>{formatDate(doc.expiry_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.expiry_date)}
                        <span>{getStatusText(doc.expiry_date)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
