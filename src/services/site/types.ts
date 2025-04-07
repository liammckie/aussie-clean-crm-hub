
export interface SiteData {
  id: string;
  site_name: string;
  site_code: string;
  client_id: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  site_contact_name?: string;
  site_contact_email?: string;
  site_contact_phone?: string;
  status: string;
  site_type?: string;
  description?: string;
  square_meters?: number;
  created_at: string;
  updated_at: string;
  induction_required?: boolean;
  notes?: string;
  region?: string; // Add region field to support existing code
}

export interface SiteInsertData {
  site_name: string;
  site_code: string;
  client_id: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country?: string;
  site_contact_name?: string;
  site_contact_email?: string;
  site_contact_phone?: string;
  status?: string;
  site_type?: string;
  description?: string;
  square_meters?: number;
  induction_required?: boolean;
  notes?: string;
  region?: string; // Add region field to support existing code
}

export interface SiteUpdateData {
  site_name?: string;
  site_code?: string;
  client_id?: string;
  address_line_1?: string;
  address_line_2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  site_contact_name?: string;
  site_contact_email?: string;
  site_contact_phone?: string;
  status?: string;
  site_type?: string;
  description?: string;
  square_meters?: number;
  induction_required?: boolean;
  notes?: string;
  region?: string; // Add region field to support existing code
}

// Alias for backward compatibility
export type SiteRecord = SiteData;
