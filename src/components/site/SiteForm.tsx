
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { SiteTypeField } from './form/SiteTypeField';
import { AddressFields } from './form/AddressFields';
import { ContactFields } from './form/ContactFields';
import { SiteStatusField } from './form/SiteStatusField';
import { SiteBasicFields } from './form/SiteBasicFields';
import { SiteAdditionalFields } from './form/SiteAdditionalFields';
import { siteSchema, SiteFormData } from './SiteFormTypes';
import { SiteStatus } from '@/types/database-schema';

interface SiteFormProps {
  onSubmit: (data: SiteFormData) => void;
  initialData?: Partial<SiteFormData>;
  isLoading?: boolean;
  buttonText?: string;
}

export function SiteForm({ 
  onSubmit, 
  initialData = {}, 
  isLoading = false,
  buttonText = "Save Site"
}: SiteFormProps) {
  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      site_name: initialData.site_name || '',
      site_code: initialData.site_code || '',
      address_line_1: initialData.address_line_1 || '',
      address_line_2: initialData.address_line_2 || '',
      suburb: initialData.suburb || '',
      state: initialData.state || '',
      postcode: initialData.postcode || '',
      site_contact_name: initialData.site_contact_name || '',
      site_contact_email: initialData.site_contact_email || '',
      site_contact_phone: initialData.site_contact_phone || '',
      notes: initialData.notes || '',
      region: initialData.region || '',
      induction_required: initialData.induction_required || false,
      status: initialData.status || SiteStatus.PENDING_ACTIVATION,
      site_type: initialData.site_type || undefined,
      square_meters: initialData.square_meters || undefined,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Site Information */}
          <SiteBasicFields form={form} />
          <SiteTypeField form={form} />
          
          {/* Address Information */}
          <AddressFields form={form} />
          
          {/* Onsite Contact Information */}
          <ContactFields form={form} />
          
          <SiteStatusField form={form} />
          
          <SiteAdditionalFields form={form} />
        </div>

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}

export { type SiteFormData } from './SiteFormTypes';
