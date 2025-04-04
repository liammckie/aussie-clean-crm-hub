export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: string
          new_values: Json | null
          old_values: Json | null
          operation: string
          record_id: string
          table_name: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          record_id: string
          table_name: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      billing_line: {
        Row: {
          client_charge: number
          contract_id: string | null
          created_at: string | null
          delivery_type: string | null
          description: string
          frequency: number
          id: string
          internal_cost: number | null
          is_active: boolean | null
          notes: string | null
          site_id: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          client_charge: number
          contract_id?: string | null
          created_at?: string | null
          delivery_type?: string | null
          description: string
          frequency: number
          id?: string
          internal_cost?: number | null
          is_active?: boolean | null
          notes?: string | null
          site_id?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          client_charge?: number
          contract_id?: string | null
          created_at?: string | null
          delivery_type?: string | null
          description?: string
          frequency?: number
          id?: string
          internal_cost?: number | null
          is_active?: boolean | null
          notes?: string | null
          site_id?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_line_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_line_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      client_addresses: {
        Row: {
          address_type: string
          client_id: string
          country: string
          created_at: string
          id: string
          postcode: string
          state: string
          street: string
          suburb: string
          updated_at: string
        }
        Insert: {
          address_type: string
          client_id: string
          country?: string
          created_at?: string
          id?: string
          postcode: string
          state: string
          street: string
          suburb: string
          updated_at?: string
        }
        Update: {
          address_type?: string
          client_id?: string
          country?: string
          created_at?: string
          id?: string
          postcode?: string
          state?: string
          street?: string
          suburb?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_addresses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at: string
          email: string
          id: string
          is_primary: boolean
          mobile: string | null
          name: string
          phone: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at?: string
          email: string
          id?: string
          is_primary?: boolean
          mobile?: string | null
          name: string
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          contact_type?: Database["public"]["Enums"]["contact_type"]
          created_at?: string
          email?: string
          id?: string
          is_primary?: boolean
          mobile?: string | null
          name?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          abn: string | null
          account_manager_id: string | null
          acn: string | null
          address_line_1: string | null
          address_line_2: string | null
          billing_cycle: string | null
          business_name: string
          country: string | null
          created_at: string
          credit_limit: number | null
          id: string
          industry: string | null
          onboarding_date: string
          payment_method: string | null
          payment_terms: string | null
          postcode: string | null
          relationship_rating: number | null
          source: string | null
          state: string | null
          status: Database["public"]["Enums"]["client_status"]
          suburb: string | null
          tax_status: string | null
          trading_name: string | null
          updated_at: string
        }
        Insert: {
          abn?: string | null
          account_manager_id?: string | null
          acn?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          billing_cycle?: string | null
          business_name: string
          country?: string | null
          created_at?: string
          credit_limit?: number | null
          id?: string
          industry?: string | null
          onboarding_date?: string
          payment_method?: string | null
          payment_terms?: string | null
          postcode?: string | null
          relationship_rating?: number | null
          source?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          suburb?: string | null
          tax_status?: string | null
          trading_name?: string | null
          updated_at?: string
        }
        Update: {
          abn?: string | null
          account_manager_id?: string | null
          acn?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          billing_cycle?: string | null
          business_name?: string
          country?: string | null
          created_at?: string
          credit_limit?: number | null
          id?: string
          industry?: string | null
          onboarding_date?: string
          payment_method?: string | null
          payment_terms?: string | null
          postcode?: string | null
          relationship_rating?: number | null
          source?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          suburb?: string | null
          tax_status?: string | null
          trading_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contract_budget: {
        Row: {
          budget_amount: number
          contract_id: string | null
          contractor_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          budget_amount: number
          contract_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_amount?: number
          contract_id?: string | null
          contractor_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_budget_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_financial_entries: {
        Row: {
          amount: number
          contract_id: string
          created_at: string
          description: string | null
          entry_date: string
          entry_type: string
          id: string
          invoice_reference: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          contract_id: string
          created_at?: string
          description?: string | null
          entry_date?: string
          entry_type: string
          id?: string
          invoice_reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          contract_id?: string
          created_at?: string
          description?: string | null
          entry_date?: string
          entry_type?: string
          id?: string
          invoice_reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_financial_entries_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_sites: {
        Row: {
          contract_id: string
          created_at: string
          id: string
          site_id: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          id?: string
          site_id: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          id?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_sites_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_sites_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          account_manager: string | null
          billing_cycle: string | null
          billing_frequency: string | null
          billing_type: string | null
          client_id: string
          client_representative_contact: string | null
          client_representative_name: string | null
          contract_code: string
          contract_name: string
          contract_value: number | null
          created_at: string
          delivery_mode: string | null
          description: string | null
          documents: Json | null
          end_date: string | null
          hourly_rate: number | null
          id: string
          is_ongoing: boolean | null
          national_manager: string | null
          notes: string | null
          payment_method: string | null
          payment_terms: string | null
          primary_manager_id: string | null
          rate_schedule: Json | null
          renewal_notice_date: string | null
          service_type: string | null
          sla_requirements: string | null
          start_date: string
          state_manager: string | null
          status: string
          total_annual_value: number | null
          total_monthly_value: number | null
          total_weekly_value: number | null
          updated_at: string
          value_annual: number | null
          value_monthly: number | null
          value_total: number | null
          value_weekly: number | null
        }
        Insert: {
          account_manager?: string | null
          billing_cycle?: string | null
          billing_frequency?: string | null
          billing_type?: string | null
          client_id: string
          client_representative_contact?: string | null
          client_representative_name?: string | null
          contract_code: string
          contract_name: string
          contract_value?: number | null
          created_at?: string
          delivery_mode?: string | null
          description?: string | null
          documents?: Json | null
          end_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_ongoing?: boolean | null
          national_manager?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          primary_manager_id?: string | null
          rate_schedule?: Json | null
          renewal_notice_date?: string | null
          service_type?: string | null
          sla_requirements?: string | null
          start_date: string
          state_manager?: string | null
          status?: string
          total_annual_value?: number | null
          total_monthly_value?: number | null
          total_weekly_value?: number | null
          updated_at?: string
          value_annual?: number | null
          value_monthly?: number | null
          value_total?: number | null
          value_weekly?: number | null
        }
        Update: {
          account_manager?: string | null
          billing_cycle?: string | null
          billing_frequency?: string | null
          billing_type?: string | null
          client_id?: string
          client_representative_contact?: string | null
          client_representative_name?: string | null
          contract_code?: string
          contract_name?: string
          contract_value?: number | null
          created_at?: string
          delivery_mode?: string | null
          description?: string | null
          documents?: Json | null
          end_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_ongoing?: boolean | null
          national_manager?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          primary_manager_id?: string | null
          rate_schedule?: Json | null
          renewal_notice_date?: string | null
          service_type?: string | null
          sla_requirements?: string | null
          start_date?: string
          state_manager?: string | null
          status?: string
          total_annual_value?: number | null
          total_monthly_value?: number | null
          total_weekly_value?: number | null
          updated_at?: string
          value_annual?: number | null
          value_monthly?: number | null
          value_total?: number | null
          value_weekly?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          access_instructions: string | null
          address_line_1: string
          address_line_2: string | null
          area_manager_id: string | null
          business_unit: string | null
          cleaning_days_schedule: Json | null
          cleaning_frequency:
            | Database["public"]["Enums"]["cleaning_frequency"]
            | null
          client_id: string
          country: string
          created_at: string
          default_calendar_id: string | null
          emergency_instructions: string | null
          id: string
          induction_required: boolean | null
          latitude: number | null
          longitude: number | null
          notes: string | null
          postcode: string
          region: string | null
          site_code: string
          site_contact_email: string | null
          site_contact_name: string | null
          site_contact_phone: string | null
          site_contacts: Json | null
          site_name: string
          site_tags: string[] | null
          site_type: Database["public"]["Enums"]["site_type"] | null
          square_meters: number | null
          state: string
          status: Database["public"]["Enums"]["site_status"]
          suburb: string
          updated_at: string
        }
        Insert: {
          access_instructions?: string | null
          address_line_1: string
          address_line_2?: string | null
          area_manager_id?: string | null
          business_unit?: string | null
          cleaning_days_schedule?: Json | null
          cleaning_frequency?:
            | Database["public"]["Enums"]["cleaning_frequency"]
            | null
          client_id: string
          country?: string
          created_at?: string
          default_calendar_id?: string | null
          emergency_instructions?: string | null
          id?: string
          induction_required?: boolean | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          postcode: string
          region?: string | null
          site_code: string
          site_contact_email?: string | null
          site_contact_name?: string | null
          site_contact_phone?: string | null
          site_contacts?: Json | null
          site_name: string
          site_tags?: string[] | null
          site_type?: Database["public"]["Enums"]["site_type"] | null
          square_meters?: number | null
          state: string
          status?: Database["public"]["Enums"]["site_status"]
          suburb: string
          updated_at?: string
        }
        Update: {
          access_instructions?: string | null
          address_line_1?: string
          address_line_2?: string | null
          area_manager_id?: string | null
          business_unit?: string | null
          cleaning_days_schedule?: Json | null
          cleaning_frequency?:
            | Database["public"]["Enums"]["cleaning_frequency"]
            | null
          client_id?: string
          country?: string
          created_at?: string
          default_calendar_id?: string | null
          emergency_instructions?: string | null
          id?: string
          induction_required?: boolean | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          postcode?: string
          region?: string | null
          site_code?: string
          site_contact_email?: string | null
          site_contact_name?: string | null
          site_contact_phone?: string | null
          site_contacts?: Json | null
          site_name?: string
          site_tags?: string[] | null
          site_type?: Database["public"]["Enums"]["site_type"] | null
          square_meters?: number | null
          state?: string
          status?: Database["public"]["Enums"]["site_status"]
          suburb?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_compliance_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          expiry_date: string | null
          file_url: string | null
          id: string
          supplier_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          supplier_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_compliance_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_services: {
        Row: {
          created_at: string
          id: string
          service_type: string
          supplier_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_type: string
          supplier_id: string
        }
        Update: {
          created_at?: string
          id?: string
          service_type?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_services_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          abn: string | null
          business_name: string
          compliance_status: string | null
          created_at: string
          id: string
          last_review_date: string | null
          notes: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          abn?: string | null
          business_name: string
          compliance_status?: string | null
          created_at?: string
          id?: string
          last_review_date?: string | null
          notes?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          abn?: string | null
          business_name?: string
          compliance_status?: string | null
          created_at?: string
          id?: string
          last_review_date?: string | null
          notes?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      unified_addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          address_type: string
          country: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          is_primary: boolean | null
          name: string | null
          postcode: string
          state: string
          suburb: string
          updated_at: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          address_type: string
          country?: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          is_primary?: boolean | null
          name?: string | null
          postcode: string
          state: string
          suburb: string
          updated_at?: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          address_type?: string
          country?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          is_primary?: boolean | null
          name?: string | null
          postcode?: string
          state?: string
          suburb?: string
          updated_at?: string
        }
        Relationships: []
      }
      unified_contacts: {
        Row: {
          account_manager: string | null
          company: string | null
          contact_type: string
          created_at: string
          email: string
          entity_id: string
          entity_type: string
          id: string
          is_primary: boolean
          mobile: string | null
          name: string
          national_manager: string | null
          phone: string | null
          position: string | null
          state_manager: string | null
          updated_at: string
        }
        Insert: {
          account_manager?: string | null
          company?: string | null
          contact_type: string
          created_at?: string
          email: string
          entity_id: string
          entity_type: string
          id?: string
          is_primary?: boolean
          mobile?: string | null
          name: string
          national_manager?: string | null
          phone?: string | null
          position?: string | null
          state_manager?: string | null
          updated_at?: string
        }
        Update: {
          account_manager?: string | null
          company?: string | null
          contact_type?: string
          created_at?: string
          email?: string
          entity_id?: string
          entity_type?: string
          id?: string
          is_primary?: boolean
          mobile?: string | null
          name?: string
          national_manager?: string | null
          phone?: string | null
          position?: string | null
          state_manager?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cleaning_frequency:
        | "daily"
        | "weekly"
        | "fortnightly"
        | "monthly"
        | "quarterly"
        | "as_needed"
      client_status: "Active" | "Prospect" | "On Hold" | "Cancelled"
      contact_type: "Billing" | "Operations" | "Emergency" | "Primary"
      site_status: "active" | "inactive" | "archived" | "pending_activation"
      site_type:
        | "office"
        | "retail"
        | "warehouse"
        | "industrial"
        | "residential"
        | "educational"
        | "medical"
        | "hospitality"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
