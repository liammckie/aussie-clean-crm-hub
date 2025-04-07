
import { ApiResponse } from '@/types/api-response';
import { Tables } from '@/types/supabase';
import { SiteStatus, SiteType } from '@/types/database-schema';

// Site entity data types
export type SiteData = Tables<'sites'>;
export type SiteInsertData = {
  client_id: string;
  site_name: string;
  site_code: string;
  address_line_1: string;
  address_line_2?: string | null;
  suburb: string;
  state: string;
  postcode: string;
  site_contact_name?: string | null;
  site_contact_email?: string | null;
  site_contact_phone?: string | null;
  notes?: string | null;
  region?: string | null;
  induction_required?: boolean;
  status: SiteStatus;
  site_type?: SiteType | null;
  square_meters?: number | null;
  description?: string | null;
};
export type SiteUpdateData = Partial<SiteInsertData>;

// API response types using centralized ApiResponse
export type SiteApiResponse = ApiResponse<SiteData>;
export type SitesApiResponse = ApiResponse<SiteData[]>;

// Re-export the database schema types
export { SiteStatus, SiteType };
