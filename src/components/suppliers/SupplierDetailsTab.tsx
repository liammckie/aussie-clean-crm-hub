
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SupplierData } from '@/types/supplier-types';

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
            <InfoRow label="Supplier Name" value={supplier.supplier_name} />
            <InfoRow label="Supplier Type" value={supplier.supplier_type} />
            <InfoRow label="Status" value={supplier.status} />
            <InfoRow label="Supplier Code" value={supplier.supplier_code} />
            <InfoRow label="Date Onboarded" value={formatDate(supplier.date_onboarded)} />
            {supplier.date_terminated && (
              <InfoRow label="Date Terminated" value={formatDate(supplier.date_terminated)} />
            )}
            <InfoRow label="ABN" value={supplier.abn} />
            <InfoRow label="ACN" value={supplier.acn} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Address" value={supplier.address_line} />
            <InfoRow 
              label="Location" 
              value={
                supplier.suburb && supplier.state
                  ? `${supplier.suburb}, ${supplier.state} ${supplier.postcode || ''}`
                  : 'Not specified'
              } 
            />
            <InfoRow label="Country" value={supplier.country || 'Australia'} />
            <Separator className="my-2" />
            <InfoRow label="Contact Person" value={supplier.contact_person} />
            <InfoRow label="Phone" value={supplier.phone} />
            <InfoRow label="Email" value={supplier.email} />
            <InfoRow label="Billing Email" value={supplier.billing_email} />
            <InfoRow label="Invoice Email" value={supplier.invoice_email} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow 
              label="BSB" 
              value={supplier.bank_details?.bsb || 'Not specified'}
            />
            <InfoRow 
              label="Account Number" 
              value={supplier.bank_details?.account_number || 'Not specified'}
            />
            <InfoRow 
              label="Account Name" 
              value={supplier.bank_details?.account_name || 'Not specified'}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <InfoRow label="Services Provided" value={supplier.services_provided} />
            <InfoRow label="Notes" value={supplier.notes} />
            <InfoRow 
              label="Created" 
              value={supplier.created_at ? formatDate(supplier.created_at) : 'Unknown'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
