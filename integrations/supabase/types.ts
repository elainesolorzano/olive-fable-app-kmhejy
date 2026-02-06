
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
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string | null;
          order_status: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered' | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          membership_status: 'active' | 'inactive' | 'cancelled' | null;
          created_at: string;
          updated_at: string;
          last_seen_at: string | null;
          first_name: string | null;
          last_name: string | null;
          phone_number: string | null;
          contact_method: 'Email' | 'Text Message' | null;
          is_admin: boolean;
          inquiry_received_at: string | null;
          consultation_scheduled_at: string | null;
          session_confirmed_at: string | null;
          session_complete_at: string | null;
          gallery_ready_at: string | null;
          reveal_scheduled_at: string | null;
          order_in_production_at: string | null;
          delivered_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          email?: string | null;
          order_status?: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered' | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          membership_status?: 'active' | 'inactive' | 'cancelled' | null;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          contact_method?: 'Email' | 'Text Message' | null;
          is_admin?: boolean;
          inquiry_received_at?: string | null;
          consultation_scheduled_at?: string | null;
          session_confirmed_at?: string | null;
          session_complete_at?: string | null;
          gallery_ready_at?: string | null;
          reveal_scheduled_at?: string | null;
          order_in_production_at?: string | null;
          delivered_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string | null;
          order_status?: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered' | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          membership_status?: 'active' | 'inactive' | 'cancelled' | null;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone_number?: string | null;
          contact_method?: 'Email' | 'Text Message' | null;
          is_admin?: boolean;
          inquiry_received_at?: string | null;
          consultation_scheduled_at?: string | null;
          session_confirmed_at?: string | null;
          session_complete_at?: string | null;
          gallery_ready_at?: string | null;
          reveal_scheduled_at?: string | null;
          order_in_production_at?: string | null;
          delivered_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          body: string;
          link: string | null;
          read_at: string | null;
          type: string | null;
          created_at: string;
          event_type: string | null;
          order_id: string | null;
          dedupe_key: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          body: string;
          link?: string | null;
          read_at?: string | null;
          type?: string | null;
          created_at?: string;
          event_type?: string | null;
          order_id?: string | null;
          dedupe_key?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          body?: string;
          link?: string | null;
          read_at?: string | null;
          type?: string | null;
          created_at?: string;
          event_type?: string | null;
          order_id?: string | null;
          dedupe_key?: string | null;
        };
      };
      workshop_waitlist: {
        Row: {
          id: string;
          email: string;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          user_id?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          client_user_id: string;
          order_number: string | null;
          title: string | null;
          stage: 'order_created' | 'session_scheduled' | 'session_completed' | 'editing_in_progress' | 'reveal_scheduled' | 'reveal_completed' | 'products_ordered' | 'in_production' | 'quality_check' | 'ready_for_pickup_or_delivery' | 'delivered' | 'completed';
          stage_percent: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_user_id: string;
          order_number?: string | null;
          title?: string | null;
          stage?: 'order_created' | 'session_scheduled' | 'session_completed' | 'editing_in_progress' | 'reveal_scheduled' | 'reveal_completed' | 'products_ordered' | 'in_production' | 'quality_check' | 'ready_for_pickup_or_delivery' | 'delivered' | 'completed';
          stage_percent?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_user_id?: string;
          order_number?: string | null;
          title?: string | null;
          stage?: 'order_created' | 'session_scheduled' | 'session_completed' | 'editing_in_progress' | 'reveal_scheduled' | 'reveal_completed' | 'products_ordered' | 'in_production' | 'quality_check' | 'ready_for_pickup_or_delivery' | 'delivered' | 'completed';
          stage_percent?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_updates: {
        Row: {
          id: string;
          order_id: string;
          stage: 'order_created' | 'session_scheduled' | 'session_completed' | 'editing_in_progress' | 'reveal_scheduled' | 'reveal_completed' | 'products_ordered' | 'in_production' | 'quality_check' | 'ready_for_pickup_or_delivery' | 'delivered' | 'completed';
          note: string | null;
          is_client_visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          stage: 'order_created' | 'session_scheduled' | 'session_completed' | 'editing_in_progress' | 'reveal_scheduled' | 'reveal_completed' | 'products_ordered' | 'in_production' | 'quality_check' | 'ready_for_pickup_or_delivery' | 'delivered' | 'completed';
          note?: string | null;
          is_client_visible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          stage?: 'order_created' | 'session_scheduled' | 'session_completed' | 'editing_in_progress' | 'reveal_scheduled' | 'reveal_completed' | 'products_ordered' | 'in_production' | 'quality_check' | 'ready_for_pickup_or_delivery' | 'delivered' | 'completed';
          note?: string | null;
          is_client_visible?: boolean;
          created_at?: string;
        };
      };
      order_status_history: {
        Row: {
          id: number;
          user_id: string;
          old_status: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered' | null;
          new_status: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered';
          changed_by: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          old_status?: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered' | null;
          new_status: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered';
          changed_by?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          old_status?: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered' | null;
          new_status?: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered';
          changed_by?: string | null;
          note?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_: string]: never;
    };
    Functions: {
      [_: string]: never;
    };
    Enums: {
      order_status_enum: 'inquiry_received' | 'consultation_scheduled' | 'session_confirmed' | 'session_complete' | 'gallery_ready' | 'reveal_scheduled' | 'order_in_production' | 'delivered';
      order_stage: 'order_created' | 'session_scheduled' | 'session_completed' | 'editing_in_progress' | 'reveal_scheduled' | 'reveal_completed' | 'products_ordered' | 'in_production' | 'quality_check' | 'ready_for_pickup_or_delivery' | 'delivered' | 'completed';
    };
  };
}
