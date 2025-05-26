
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SupplierData } from '@/types/supplier-types';
import { dbDataToDisplayData } from '@/utils/supplierDataTransforms';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="grid grid-cols-3 gap-4 py-2">
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
    <div className="col-span-2 text-sm">{value || 'Not specified'}</div>
  </div>
);

interface SupplierDetailsTabProps {
  supplier: SupplierData;
  onUpdate?: () => void;
}

export function SupplierDetailsTab({ supplier }: SupplierDetailsTabProps) {
  const displayData = dbDataToDisplayData(supplier);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Supplier Name" value={displayData.business_name} />
            <InfoRow label="Supplier Type" value={displayData.supplier_type} />
            <InfoRow label="Status" value={displayData.status} />
            <InfoRow label="ABN" value={displayData.abn} />
            <InfoRow label="ACN" value={displayData.acn} />
            <InfoRow label="Payment Terms" value={displayData.payment_terms} />
            <InfoRow label="Compliance Status" value={displayData.compliance_status} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Primary Contact" value={displayData.primary_contact_name} />
            <InfoRow label="Phone" value={displayData.primary_contact_phone} />
            <InfoRow label="Email" value={displayData.primary_contact_email} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Notes" value={displayData.notes} />
            <InfoRow label="Last Review Date" value={formatDate(displayData.last_review_date)} />
            <InfoRow label="Preferred Payment Method" value={displayData.preferred_payment_method} />
            <InfoRow 
              label="Created" 
              value={displayData.created_at ? formatDate(displayData.created_at) : 'Unknown'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
