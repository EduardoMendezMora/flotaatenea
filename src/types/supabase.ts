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
      claims: {
        Row: {
          approved_amount: number | null
          claim_amount: number | null
          claim_number: string
          created_at: string
          created_by: string | null
          description: string | null
          documents: string[] | null
          id: string
          incident_date: string
          insurance_id: string
          notes: string | null
          police_report_number: string | null
          reported_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_amount?: number | null
          claim_amount?: number | null
          claim_number: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          documents?: string[] | null
          id?: string
          incident_date: string
          insurance_id: string
          notes?: string | null
          police_report_number?: string | null
          reported_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_amount?: number | null
          claim_amount?: number | null
          claim_number?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          documents?: string[] | null
          id?: string
          incident_date?: string
          insurance_id?: string
          notes?: string | null
          police_report_number?: string | null
          reported_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_insurance_id_fkey"
            columns: ["insurance_id"]
            isOneToOne: false
            referencedRelation: "insurance"
            referencedColumns: ["id"]
          }
        ]
      }
      clients: {
        Row: {
          address: string | null
          business_name: string | null
          city: string | null
          client_type: Database["public"]["Enums"]["client_type"]
          country: string | null
          created_at: string
          created_by: string | null
          credit_score: number | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          legal_representative: string | null
          national_id: string | null
          notes: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          city?: string | null
          client_type: Database["public"]["Enums"]["client_type"]
          country?: string | null
          created_at?: string
          created_by?: string | null
          credit_score?: number | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          legal_representative?: string | null
          national_id?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_name?: string | null
          city?: string | null
          client_type?: Database["public"]["Enums"]["client_type"]
          country?: string | null
          created_at?: string
          created_by?: string | null
          credit_score?: number | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          legal_representative?: string | null
          national_id?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      contracts: {
        Row: {
          client_id: string
          contract_document_url: string | null
          contract_number: string
          created_at: string
          created_by: string | null
          deposit_amount: number | null
          early_termination_fee: number | null
          end_date: string
          excess_mileage_rate: number | null
          id: string
          late_payment_fee: number | null
          mileage_limit: number | null
          monthly_payment: number
          notes: string | null
          signed_by_client: boolean | null
          signed_by_company: boolean | null
          signed_date: string | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"]
          terms_and_conditions: string | null
          total_amount: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          client_id: string
          contract_document_url?: string | null
          contract_number: string
          created_at?: string
          created_by?: string | null
          deposit_amount?: number | null
          early_termination_fee?: number | null
          end_date: string
          excess_mileage_rate?: number | null
          id?: string
          late_payment_fee?: number | null
          mileage_limit?: number | null
          monthly_payment: number
          notes?: string | null
          signed_by_client?: boolean | null
          signed_by_company?: boolean | null
          signed_date?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"]
          terms_and_conditions?: string | null
          total_amount: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          client_id?: string
          contract_document_url?: string | null
          contract_number?: string
          created_at?: string
          created_by?: string | null
          deposit_amount?: number | null
          early_termination_fee?: number | null
          end_date?: string
          excess_mileage_rate?: number | null
          id?: string
          late_payment_fee?: number | null
          mileage_limit?: number | null
          monthly_payment?: number
          notes?: string | null
          signed_by_client?: boolean | null
          signed_by_company?: boolean | null
          signed_date?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"]
          terms_and_conditions?: string | null
          total_amount?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          }
        ]
      }
      insurance: {
        Row: {
          coverage_amount: number | null
          created_at: string
          created_by: string | null
          deductible: number | null
          end_date: string
          id: string
          insurance_company: string
          is_active: boolean | null
          notes: string | null
          policy_document_url: string | null
          policy_number: string
          policy_type: string
          premium_amount: number
          start_date: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          coverage_amount?: number | null
          created_at?: string
          created_by?: string | null
          deductible?: number | null
          end_date: string
          id?: string
          insurance_company: string
          is_active?: boolean | null
          notes?: string | null
          policy_document_url?: string | null
          policy_number: string
          policy_type: string
          premium_amount: number
          start_date: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          coverage_amount?: number | null
          created_at?: string
          created_by?: string | null
          deductible?: number | null
          end_date?: string
          id?: string
          insurance_company?: string
          is_active?: boolean | null
          notes?: string | null
          policy_document_url?: string | null
          policy_number?: string
          policy_type?: string
          premium_amount?: number
          start_date?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          }
        ]
      }
      maintenance: {
        Row: {
          completed_date: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          invoice_number: string | null
          maintenance_type: string
          mileage_at_service: number | null
          notes: string | null
          parts_replaced: string[] | null
          scheduled_date: string
          service_provider: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          updated_at: string
          vehicle_id: string
          warranty_until: string | null
        }
        Insert: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          invoice_number?: string | null
          maintenance_type: string
          mileage_at_service?: number | null
          notes?: string | null
          parts_replaced?: string[] | null
          scheduled_date: string
          service_provider?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          updated_at?: string
          vehicle_id: string
          warranty_until?: string | null
        }
        Update: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          invoice_number?: string | null
          maintenance_type?: string
          mileage_at_service?: number | null
          notes?: string | null
          parts_replaced?: string[] | null
          scheduled_date?: string
          service_provider?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          updated_at?: string
          vehicle_id?: string
          warranty_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          related_table: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          related_table?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          related_table?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          amount: number
          contract_id: string
          created_at: string
          created_by: string | null
          due_date: string
          id: string
          late_fee: number | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_number: number
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          contract_id: string
          created_at?: string
          created_by?: string | null
          due_date: string
          id?: string
          late_fee?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_number: number
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          contract_id?: string
          created_at?: string
          created_by?: string | null
          due_date?: string
          id?: string
          late_fee?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_number?: number
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          current_value: number | null
          documents: string[] | null
          engine_type: string | null
          fuel_type: string | null
          gps_device_id: string | null
          id: string
          images: string[] | null
          insurance_policy_number: string | null
          is_active: boolean | null
          last_service_date: string | null
          license_plate: string | null
          location: string | null
          make: string
          mileage: number | null
          model: string
          next_service_due: string | null
          notes: string | null
          purchase_price: number | null
          registration_expiry: string | null
          service_interval_km: number | null
          status: Database["public"]["Enums"]["vehicle_status"]
          transmission: string | null
          updated_at: string
          vin: string
          year: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          documents?: string[] | null
          engine_type?: string | null
          fuel_type?: string | null
          gps_device_id?: string | null
          id?: string
          images?: string[] | null
          insurance_policy_number?: string | null
          is_active?: boolean | null
          last_service_date?: string | null
          license_plate?: string | null
          location?: string | null
          make: string
          mileage?: number | null
          model: string
          next_service_due?: string | null
          notes?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          service_interval_km?: number | null
          status?: Database["public"]["Enums"]["vehicle_status"]
          transmission?: string | null
          updated_at?: string
          vin: string
          year: number
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          documents?: string[] | null
          engine_type?: string | null
          fuel_type?: string | null
          gps_device_id?: string | null
          id?: string
          images?: string[] | null
          insurance_policy_number?: string | null
          is_active?: boolean | null
          last_service_date?: string | null
          license_plate?: string | null
          location?: string | null
          make?: string
          mileage?: number | null
          model?: string
          next_service_due?: string | null
          notes?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          service_interval_km?: number | null
          status?: Database["public"]["Enums"]["vehicle_status"]
          transmission?: string | null
          updated_at?: string
          vin?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      client_type: "individual" | "business"
      contract_status: "draft" | "active" | "expired" | "terminated" | "renewed"
      maintenance_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      payment_status: "pending" | "paid" | "overdue" | "cancelled"
      user_role: "admin" | "manager" | "operator" | "viewer"
      vehicle_status: "available" | "leased" | "maintenance" | "sold" | "retired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
