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
      admissions: {
        Row: {
          category: string
          closing_rank: number | null
          college_id: number | null
          course_id: number | null
          created_at: string | null
          exam_name: string
          id: number
          opening_rank: number | null
          round_number: number | null
          year: number
        }
        Insert: {
          category: string
          closing_rank?: number | null
          college_id?: number | null
          course_id?: number | null
          created_at?: string | null
          exam_name: string
          id?: number
          opening_rank?: number | null
          round_number?: number | null
          year: number
        }
        Update: {
          category?: string
          closing_rank?: number | null
          college_id?: number | null
          course_id?: number | null
          created_at?: string | null
          exam_name?: string
          id?: number
          opening_rank?: number | null
          round_number?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "admissions_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          accreditation: Json | null
          affiliation: string | null
          average_package: number | null
          campus_area: string | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          established_year: number | null
          facilities: Json | null
          highest_package: number | null
          id: number
          image_url: string | null
          location: string
          name: string
          placement_percentage: number | null
          ranking: Json | null
          rating: number | null
          state: string
          total_fees_max: number | null
          total_fees_min: number | null
          type: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          accreditation?: Json | null
          affiliation?: string | null
          average_package?: number | null
          campus_area?: string | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          facilities?: Json | null
          highest_package?: number | null
          id?: number
          image_url?: string | null
          location: string
          name: string
          placement_percentage?: number | null
          ranking?: Json | null
          rating?: number | null
          state: string
          total_fees_max?: number | null
          total_fees_min?: number | null
          type: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          accreditation?: Json | null
          affiliation?: string | null
          average_package?: number | null
          campus_area?: string | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          facilities?: Json | null
          highest_package?: number | null
          id?: number
          image_url?: string | null
          location?: string
          name?: string
          placement_percentage?: number | null
          ranking?: Json | null
          rating?: number | null
          state?: string
          total_fees_max?: number | null
          total_fees_min?: number | null
          type?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          branch: string
          college_id: number | null
          course_name: string
          created_at: string | null
          cutoff_rank_general: number | null
          cutoff_rank_obc: number | null
          cutoff_rank_sc: number | null
          cutoff_rank_st: number | null
          duration: string
          exam_accepted: string
          fees_per_year: number | null
          id: number
          seats_available: number | null
          seats_total: number | null
        }
        Insert: {
          branch: string
          college_id?: number | null
          course_name: string
          created_at?: string | null
          cutoff_rank_general?: number | null
          cutoff_rank_obc?: number | null
          cutoff_rank_sc?: number | null
          cutoff_rank_st?: number | null
          duration: string
          exam_accepted: string
          fees_per_year?: number | null
          id?: number
          seats_available?: number | null
          seats_total?: number | null
        }
        Update: {
          branch?: string
          college_id?: number | null
          course_name?: string
          created_at?: string | null
          cutoff_rank_general?: number | null
          cutoff_rank_obc?: number | null
          cutoff_rank_sc?: number | null
          cutoff_rank_st?: number | null
          duration?: string
          exam_accepted?: string
          fees_per_year?: number | null
          id?: number
          seats_available?: number | null
          seats_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: number
          resource_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          resource_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          resource_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          created_at: string | null
          id: number
          message: string
          read: boolean | null
          resource_id: number | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: number
          message: string
          read?: boolean | null
          resource_id?: number | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: number
          message?: string
          read?: boolean | null
          resource_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          academic_field: string | null
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          notification_preferences: Json | null
          phone_number: string | null
          preferred_branches: string[] | null
          preferred_course: string | null
          preferred_locations: string[] | null
          profile_completion_percentage: number | null
          profile_picture_url: string | null
          tutorial_completed: boolean | null
        }
        Insert: {
          academic_field?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone_number?: string | null
          preferred_branches?: string[] | null
          preferred_course?: string | null
          preferred_locations?: string[] | null
          profile_completion_percentage?: number | null
          profile_picture_url?: string | null
          tutorial_completed?: boolean | null
        }
        Update: {
          academic_field?: string | null
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone_number?: string | null
          preferred_branches?: string[] | null
          preferred_course?: string | null
          preferred_locations?: string[] | null
          profile_completion_percentage?: number | null
          profile_picture_url?: string | null
          tutorial_completed?: boolean | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string | null
          date: string | null
          description: string | null
          details: Json | null
          event_date: string | null
          event_location: string | null
          id: number
          image_url: string | null
          is_featured: boolean | null
          source: string | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          details?: Json | null
          event_date?: string | null
          event_location?: string | null
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          source?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          details?: Json | null
          event_date?: string | null
          event_location?: string | null
          id?: number
          image_url?: string | null
          is_featured?: boolean | null
          source?: string | null
          title?: string
        }
        Relationships: []
      }
      user_college_favorites: {
        Row: {
          college_id: number | null
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          college_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          college_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_college_favorites_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_profile_completion: {
        Args: { profile_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
