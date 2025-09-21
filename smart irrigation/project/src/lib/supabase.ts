import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      fields: {
        Row: {
          id: string
          user_id: string
          name: string
          location: {
            lat: number
            lng: number
          }
          size: number
          crop_type: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['fields']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['fields']['Insert']>
      }
      irrigation_logs: {
        Row: {
          id: string
          field_id: string
          user_id: string
          water_amount: number
          duration: number
          timestamp: string
          method: 'manual' | 'automatic'
        }
        Insert: Omit<Database['public']['Tables']['irrigation_logs']['Row'], 'id' | 'timestamp'>
        Update: Partial<Database['public']['Tables']['irrigation_logs']['Insert']>
      }
      sensor_data: {
        Row: {
          id: string
          field_id: string
          soil_moisture: number
          temperature: number
          humidity: number
          light_intensity: number
          timestamp: string
        }
        Insert: Omit<Database['public']['Tables']['sensor_data']['Row'], 'id' | 'timestamp'>
        Update: Partial<Database['public']['Tables']['sensor_data']['Insert']>
      }
    }
  }
}