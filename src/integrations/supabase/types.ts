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
          supplier_cost: number | null
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
          supplier_cost?: number | null
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
          supplier_cost?: number | null
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
          address: string | null
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
          phone: string | null
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
          address?: string | null
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
          phone?: string | null
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
          address?: string | null
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
          phone?: string | null
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
          profit_margin_percentage: number | null
          rate_schedule: Json | null
          renewal_notice_date: string | null
          service_type: string | null
          sla_requirements: string | null
          start_date: string
          state_manager: string | null
          status: string
          supplier_cost_annual: number | null
          supplier_cost_monthly: number | null
          supplier_cost_weekly: number | null
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
          profit_margin_percentage?: number | null
          rate_schedule?: Json | null
          renewal_notice_date?: string | null
          service_type?: string | null
          sla_requirements?: string | null
          start_date: string
          state_manager?: string | null
          status?: string
          supplier_cost_annual?: number | null
          supplier_cost_monthly?: number | null
          supplier_cost_weekly?: number | null
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
          profit_margin_percentage?: number | null
          rate_schedule?: Json | null
          renewal_notice_date?: string | null
          service_type?: string | null
          sla_requirements?: string | null
          start_date?: string
          state_manager?: string | null
          status?: string
          supplier_cost_annual?: number | null
          supplier_cost_monthly?: number | null
          supplier_cost_weekly?: number | null
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
          description: string | null
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
          description?: string | null
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
          description?: string | null
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
      supplier_contract: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          contract_id: string
          created_at: string | null
          link_id: string
          notes: string | null
          percentage: number | null
          role: string
          services: string | null
          status: string
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          contract_id: string
          created_at?: string | null
          link_id?: string
          notes?: string | null
          percentage?: number | null
          role: string
          services?: string | null
          status?: string
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          contract_id?: string
          created_at?: string | null
          link_id?: string
          notes?: string | null
          percentage?: number | null
          role?: string
          services?: string | null
          status?: string
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_contract_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_contract_supplier_id_fkey"
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
          payment_terms_days: number | null
          preferred_payment_method: string | null
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
          payment_terms_days?: number | null
          preferred_payment_method?: string | null
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
          payment_terms_days?: number | null
          preferred_payment_method?: string | null
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
          first_name: string | null
          id: string
          is_primary: boolean
          last_name: string | null
          mobile: string | null
          name: string
          national_manager: string | null
          phone: string | null
          position: string | null
          state_manager: string | null
          title: string | null
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
          first_name?: string | null
          id?: string
          is_primary?: boolean
          last_name?: string | null
          mobile?: string | null
          name: string
          national_manager?: string | null
          phone?: string | null
          position?: string | null
          state_manager?: string | null
          title?: string | null
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
          first_name?: string | null
          id?: string
          is_primary?: boolean
          last_name?: string | null
          mobile?: string | null
          name?: string
          national_manager?: string | null
          phone?: string | null
          position?: string | null
          state_manager?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      work_order_tasks: {
        Row: {
          actual_time: number | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          estimated_time: number | null
          id: string
          status: string
          task_name: string
          updated_at: string | null
          work_order_id: string
        }
        Insert: {
          actual_time?: number | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: string
          status?: string
          task_name: string
          updated_at?: string | null
          work_order_id: string
        }
        Update: {
          actual_time?: number | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          estimated_time?: number | null
          id?: string
          status?: string
          task_name?: string
          updated_at?: string | null
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_tasks_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          actual_cost: number | null
          actual_end: string | null
          actual_start: string | null
          billing_method: string | null
          client_id: string
          contract_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          priority: string
          scheduled_end: string | null
          scheduled_start: string | null
          service_type: string
          site_id: string
          special_instructions: string | null
          status: string
          supplier_id: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
          work_order_number: string
        }
        Insert: {
          actual_cost?: number | null
          actual_end?: string | null
          actual_start?: string | null
          billing_method?: string | null
          client_id: string
          contract_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          priority?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          service_type: string
          site_id: string
          special_instructions?: string | null
          status?: string
          supplier_id?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          work_order_number: string
        }
        Update: {
          actual_cost?: number | null
          actual_end?: string | null
          actual_start?: string | null
          billing_method?: string | null
          client_id?: string
          contract_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          priority?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          service_type?: string
          site_id?: string
          special_instructions?: string | null
          status?: string
          supplier_id?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          work_order_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      workbills: {
        Row: {
          amount: number
          created_at: string | null
          hours_worked: number | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          notes: string | null
          pay_rate: number | null
          payment_date: string | null
          payment_reference: string | null
          site_id: string | null
          status: string
          supplier_id: string | null
          updated_at: string | null
          work_order_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          hours_worked?: number | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          notes?: string | null
          pay_rate?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          site_id?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string | null
          work_order_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          hours_worked?: number | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          notes?: string | null
          pay_rate?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          site_id?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string | null
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbills_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workbills_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workbills_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cleaning_frequency: [
        "daily",
        "weekly",
        "fortnightly",
        "monthly",
        "quarterly",
        "as_needed",
      ],
      client_status: ["Active", "Prospect", "On Hold", "Cancelled"],
      contact_type: ["Billing", "Operations", "Emergency", "Primary"],
      site_status: ["active", "inactive", "archived", "pending_activation"],
      site_type: [
        "office",
        "retail",
        "warehouse",
        "industrial",
        "residential",
        "educational",
        "medical",
        "hospitality",
      ],
    },
  },
} as const
