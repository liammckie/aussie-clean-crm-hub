
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
  country?: string;  // Made optional to match test data
  site_contact_name?: string;
  site_contact_email?: string;
  site_contact_phone?: string;
  site_contact_mobile?: string;
  status: string;
  site_type?: string;
  description?: string;
  square_meters?: number;
  created_at: string;
  updated_at: string;
  induction_required?: boolean;
  notes?: string;
  region?: string;
}

export type SiteInsertData = Omit<SiteData, 'id' | 'created_at' | 'updated_at'>;
export type SiteUpdateData = Partial<SiteInsertData>;

// Alias for compatibility with existing code 
export type SiteCreateData = SiteInsertData;

export interface SiteApiResponse {
  data: SiteData;
  message: string;
}

export interface SitesApiResponse {
  data: SiteData[];
  message: string;
}
