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
      integration_messages: {
        Row: {
          author: string | null
          channel_or_thread: string | null
          content: string | null
          external_id: string
          external_url: string | null
          id: string
          integration_id: string
          message_timestamp: string | null
          message_type: string
          metadata: Json | null
          processed_at: string | null
          title: string | null
        }
        Insert: {
          author?: string | null
          channel_or_thread?: string | null
          content?: string | null
          external_id: string
          external_url?: string | null
          id?: string
          integration_id: string
          message_timestamp?: string | null
          message_type: string
          metadata?: Json | null
          processed_at?: string | null
          title?: string | null
        }
        Update: {
          author?: string | null
          channel_or_thread?: string | null
          content?: string | null
          external_id?: string
          external_url?: string | null
          id?: string
          integration_id?: string
          message_timestamp?: string | null
          message_type?: string
          metadata?: Json | null
          processed_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_messages_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "user_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_configs: {
        Row: {
          authorization_url: string
          client_id: string
          client_secret: string | null
          created_at: string | null
          id: string
          integration_type: Database["public"]["Enums"]["integration_type"]
          redirect_uri: string
          scope: string
          token_url: string
          updated_at: string | null
        }
        Insert: {
          authorization_url: string
          client_id: string
          client_secret?: string | null
          created_at?: string | null
          id?: string
          integration_type: Database["public"]["Enums"]["integration_type"]
          redirect_uri: string
          scope: string
          token_url: string
          updated_at?: string | null
        }
        Update: {
          authorization_url?: string
          client_id?: string
          client_secret?: string | null
          created_at?: string | null
          id?: string
          integration_type?: Database["public"]["Enums"]["integration_type"]
          redirect_uri?: string
          scope?: string
          token_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stock_data: {
        Row: {
          change: number
          change_percent: string
          id: string
          last_updated: string | null
          name: string
          price: number
          symbol: string
        }
        Insert: {
          change: number
          change_percent: string
          id?: string
          last_updated?: string | null
          name: string
          price: number
          symbol: string
        }
        Update: {
          change?: number
          change_percent?: string
          id?: string
          last_updated?: string | null
          name?: string
          price?: number
          symbol?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          integration_id: string
          items_processed: number | null
          started_at: string | null
          status: string
          sync_metadata: Json | null
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          integration_id: string
          items_processed?: number | null
          started_at?: string | null
          status: string
          sync_metadata?: Json | null
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string
          items_processed?: number | null
          started_at?: string | null
          status?: string
          sync_metadata?: Json | null
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "user_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          integration_settings: Json | null
          integration_type: Database["public"]["Enums"]["integration_type"]
          last_sync_at: string | null
          oauth_code_verifier: string | null
          oauth_redirect_uri: string | null
          oauth_state: string | null
          refresh_token: string | null
          status: Database["public"]["Enums"]["integration_status"] | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
          workspace_info: Json | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          integration_settings?: Json | null
          integration_type: Database["public"]["Enums"]["integration_type"]
          last_sync_at?: string | null
          oauth_code_verifier?: string | null
          oauth_redirect_uri?: string | null
          oauth_state?: string | null
          refresh_token?: string | null
          status?: Database["public"]["Enums"]["integration_status"] | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
          workspace_info?: Json | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          integration_settings?: Json | null
          integration_type?: Database["public"]["Enums"]["integration_type"]
          last_sync_at?: string | null
          oauth_code_verifier?: string | null
          oauth_redirect_uri?: string | null
          oauth_state?: string | null
          refresh_token?: string | null
          status?: Database["public"]["Enums"]["integration_status"] | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
          workspace_info?: Json | null
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
      integration_status: "active" | "pending" | "error" | "disconnected"
      integration_type: "slack" | "gmail" | "jira"
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
      integration_status: ["active", "pending", "error", "disconnected"],
      integration_type: ["slack", "gmail", "jira"],
    },
  },
} as const
