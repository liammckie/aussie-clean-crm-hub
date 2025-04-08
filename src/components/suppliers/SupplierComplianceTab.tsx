
// Only updating the specific part with the badge variant issue
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CalendarIcon, AlertTriangle, Check, X, Pencil } from 'lucide-react';
import { ComplianceDocument } from '@/types/supplier-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SupplierComplianceTabProps {
  supplierId: string;
  documents?: ComplianceDocument[];
  isLoading?: boolean;
  error?: Error | null;
  onAddDocument?: () => void;
  onEditDocument?: (documentId: string) => void;
}

export function SupplierComplianceTab({
  supplierId,
  documents = [],
  isLoading = false,
  error = null,
  onAddDocument,
  onEditDocument,
}: SupplierComplianceTabProps) {
  const [selectedDocument, setSelectedDocument] = useState<ComplianceDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (document: ComplianceDocument) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    try {
      return new Date(expiryDate) < new Date();
    } catch (e) {
      return false;
    }
  };

  const isExpiringWithin30Days = (expiryDate?: string) => {
    if (!expiryDate) return false;
    try {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return expiry < thirtyDaysFromNow && expiry >= today;
    } catch (e) {
      return false;
    }
  };

  const getStatusBadge = (document: ComplianceDocument) => {
    if (isExpired(document.expiry_date)) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Expired</span>
        </Badge>
      );
    } else if (isExpiringWithin30Days(document.expiry_date)) {
      return (
        <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          <span>Expiring Soon</span>
        </Badge>
      );
    } else if (document.expiry_date) {
      return (
        <Badge variant="success" className="bg-green-200 text-green-800 hover:bg-green-300">
          <Check className="h-3 w-3 mr-1" />
          <span>Valid</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          <span>No Expiry</span>
        </Badge>
      );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-xl text-muted-foreground">Loading compliance documents...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="p-4 border rounded bg-destructive/10 text-destructive">
            <p className="font-semibold">Error loading compliance documents</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Compliance Documents</CardTitle>
          {onAddDocument && (
            <Button onClick={onAddDocument} variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-10 border rounded-md bg-muted/30">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No compliance documents available</p>
              {onAddDocument && (
                <Button onClick={onAddDocument} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="group">
                    <TableCell>{doc.document_name}</TableCell>
                    <TableCell>{doc.document_type}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {formatDate(doc.expiry_date)}
                    </TableCell>
                    <TableCell>{getStatusBadge(doc)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {doc.file_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(doc)}
                        >
                          View
                        </Button>
                      )}
                      {onEditDocument && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditDocument(doc.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.document_name}</DialogTitle>
          </DialogHeader>
          {selectedDocument?.file_url ? (
            <div className="h-[500px] border rounded">
              <iframe
                src={selectedDocument.file_url}
                className="w-full h-full"
                title={selectedDocument.document_name}
              />
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center border rounded">
              <p className="text-muted-foreground">No preview available</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            {selectedDocument?.file_url && (
              <Button asChild>
                <a href={selectedDocument.file_url} target="_blank" rel="noreferrer">
                  Open in New Tab
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
