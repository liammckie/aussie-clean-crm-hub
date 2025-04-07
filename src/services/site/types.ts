
import { ApiResponse } from '@/types/api-response';
import { SiteStatus, SiteType } from '@/types/database-schema';

/**
 * Site data record structure from database
 */
export interface SiteRecord {
  id: string;
  client_id: string;
  site_name: string;
  site_code: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  site_contact_name?: string;
  site_contact_email?: string;
  site_contact_phone?: string;
  status: SiteStatus;
  site_type?: SiteType;
  square_meters?: number;
  region?: string;
  notes?: string;
  induction_required?: boolean;
  created_at?: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
  business_unit?: string;
  description?: string; // Added to match schema
}

// Alias for backward compatibility
export type SiteData = SiteRecord;

/**
 * Data required to insert a new site
 */
export interface SiteInsertData {
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
  status: string; 
  site_type?: string | null;
  square_meters?: number | null;
  region?: string | null;
  notes?: string | null;
  induction_required?: boolean;
  description?: string | null; // Added to match schema
}

/**
 * Data for updating an existing site
 */
export interface SiteUpdateData extends Partial<SiteInsertData> {
  // Same as SiteInsertData but all fields are optional
}

/**
 * API response types
 */
export type SiteApiResponse = ApiResponse<SiteRecord>;
export type SitesApiResponse = ApiResponse<SiteRecord[]>;
