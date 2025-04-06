
/**
 * This is a placeholder for generated Supabase types.
 * To generate actual types, run:
 * npx supabase gen types typescript --local > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          business_name: string
          trading_name: string | null
          abn: string | null
          acn: string | null
          industry: string | null
          status: string
          onboarding_date: string | null
          source: string | null
          address_line_1: string | null
          address_line_2: string | null
          suburb: string | null
          state: string | null
          postcode: string | null
          country: string | null
          billing_cycle: string | null
          payment_terms: string | null
          payment_method: string | null
          tax_status: string | null
          credit_limit: number | null
          created_at: string
          updated_at: string
          phone: string | null
          address: string | null
        }
        Insert: {
          id?: string
          business_name: string
          trading_name?: string | null
          abn?: string | null
          acn?: string | null
          industry?: string | null
          status?: string
          onboarding_date?: string | null
          source?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          suburb?: string | null
          state?: string | null
          postcode?: string | null
          country?: string | null
          billing_cycle?: string | null
          payment_terms?: string | null
          payment_method?: string | null
          tax_status?: string | null
          credit_limit?: number | null
          created_at?: string
          updated_at?: string
          phone?: string | null
          address?: string | null
        }
        Update: {
          id?: string
          business_name?: string
          trading_name?: string | null
          abn?: string | null
          acn?: string | null
          industry?: string | null
          status?: string
          onboarding_date?: string | null
          source?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          suburb?: string | null
          state?: string | null
          postcode?: string | null
          country?: string | null
          billing_cycle?: string | null
          payment_terms?: string | null
          payment_method?: string | null
          tax_status?: string | null
          credit_limit?: number | null
          created_at?: string
          updated_at?: string
          phone?: string | null
          address?: string | null
        }
        Relationships: []
      }
      sites: {
        Row: {
          id: string
          client_id: string
          site_name: string
          site_code: string
          address_line_1: string
          address_line_2: string | null
          suburb: string
          state: string
          postcode: string
          status: string
          site_type: string | null
          site_contact_name: string | null
          site_contact_email: string | null
          site_contact_phone: string | null
          notes: string | null
          region: string | null
          induction_required: boolean | null
          square_meters: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          site_name: string
          site_code: string
          address_line_1: string
          address_line_2?: string | null
          suburb: string
          state: string
          postcode: string
          status?: string
          site_type?: string | null
          site_contact_name?: string | null
          site_contact_email?: string | null
          site_contact_phone?: string | null
          notes?: string | null
          region?: string | null
          induction_required?: boolean | null
          square_meters?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          site_name?: string
          site_code?: string
          address_line_1?: string
          address_line_2?: string | null
          suburb?: string
          state?: string
          postcode?: string
          status?: string
          site_type?: string | null
          site_contact_name?: string | null
          site_contact_email?: string | null
          site_contact_phone?: string | null
          notes?: string | null
          region?: string | null
          induction_required?: boolean | null
          square_meters?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

// Helper types for better developer experience
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
