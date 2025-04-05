
export type SiteType = 'residential' | 'industrial' | 'retail' | 'hospitality' | 'office' | 'warehouse' | 'educational' | 'medical';
export type SiteStatus = 'active' | 'inactive' | 'pending_activation';

export interface SiteData {
  id: string;
  client_id: string;
  site_name: string;
  site_code: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  site_contact_name?: string;
  site_contact_email?: string;
  site_contact_phone?: string;
  notes?: string;
  region?: string;
  induction_required?: boolean;
  status: SiteStatus;
  site_type?: SiteType;
  square_meters?: number;
  access_instructions?: string;
  emergency_instructions?: string;
  created_at: string;
  updated_at: string;
}
