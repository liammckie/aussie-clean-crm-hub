
import { Tables } from '@/types/supabase';

// Define site type and status as enums to ensure consistency
export enum SiteType {
  RESIDENTIAL = 'residential',
  INDUSTRIAL = 'industrial',
  RETAIL = 'retail',
  HOSPITALITY = 'hospitality',
  OFFICE = 'office',
  WAREHOUSE = 'warehouse',
  EDUCATIONAL = 'educational',
  MEDICAL = 'medical'
}

export enum SiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_ACTIVATION = 'pending_activation'
}

// Site entity data types
export type SiteData = Tables<'sites'>;
export type SiteInsertData = Omit<SiteData, 'id' | 'created_at' | 'updated_at'>;
export type SiteUpdateData = Partial<SiteData>;

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

// Re-export enums to avoid importing from multiple places
export { SiteStatus, SiteType };
