
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

// Response types
export interface SiteResponse {
  data: SiteData | null;
  error: string | null;
}

export interface SitesResponse {
  data: SiteData[] | null;
  error: string | null;
}

export interface SiteSuccessResponse {
  data: SiteData;
  message: string;
}

export interface SiteErrorResponse {
  category: 'validation' | 'not_found' | 'permission' | 'server';
  message: string;
  details?: any;
}

// Union type for all site API responses
export type SiteApiResponse = SiteSuccessResponse | SiteErrorResponse;
export type SitesApiResponse = SiteSuccessResponse[] | SiteErrorResponse;

// Re-export the database schema types
export { SiteStatus, SiteType };
