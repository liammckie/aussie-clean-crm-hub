
import { Tables } from '@/types/supabase';
import { SiteStatus as DbSiteStatus, SiteType as DbSiteType } from '@/types/database-schema';

// Use database schema enums for site type and status
export type SiteStatus = DbSiteStatus;
export type SiteType = DbSiteType;

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

// Re-export database schema enums to avoid importing from multiple places
export { DbSiteStatus as SiteStatus, DbSiteType as SiteType };
