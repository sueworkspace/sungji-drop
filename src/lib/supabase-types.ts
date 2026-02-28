// ============================================================
// Supabase Database Types — 성지DROP 역경매 플랫폼
// ============================================================

export type Database = {
  public: {
    Tables: {
      // ----------------------------------------------------------
      // profiles — auth.users 와 1:1 연결되는 사용자 프로필
      // ----------------------------------------------------------
      profiles: {
        Row: {
          id: string;           // uuid, references auth.users
          nickname: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ----------------------------------------------------------
      // devices — 판매 중인 기기 카탈로그
      // ----------------------------------------------------------
      devices: {
        Row: {
          id: string;
          name: string;
          brand: 'samsung' | 'apple' | 'google' | 'other';
          model_number: string;
          storage_options: string[];   // e.g. ['128GB', '256GB', '512GB']
          color_options: string[];
          image_url: string | null;
          original_price: number;      // 출고가 (원)
          release_date: string | null; // ISO date string
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand: 'samsung' | 'apple' | 'google' | 'other';
          model_number: string;
          storage_options?: string[];
          color_options?: string[];
          image_url?: string | null;
          original_price: number;
          release_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: 'samsung' | 'apple' | 'google' | 'other';
          model_number?: string;
          storage_options?: string[];
          color_options?: string[];
          image_url?: string | null;
          original_price?: number;
          release_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      // ----------------------------------------------------------
      // quote_requests — 사용자의 견적 요청 (역경매 입찰 공고)
      // ----------------------------------------------------------
      quote_requests: {
        Row: {
          id: string;
          user_id: string;
          device_id: string;
          storage: string;             // e.g. '256GB'
          color: string;
          carrier: 'SKT' | 'KT' | 'LGU+' | '알뜰폰';
          plan_type: string;           // e.g. '5G 프리미엄', '5G 스탠다드'
          trade_in_device: string | null;
          trade_in_condition: 'S' | 'A' | 'B' | 'C' | null;
          additional_notes: string | null;
          status: 'open' | 'quoted' | 'accepted' | 'completed' | 'expired' | 'cancelled';
          expires_at: string;          // ISO datetime
          quote_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_id: string;
          storage: string;
          color: string;
          carrier: 'SKT' | 'KT' | 'LGU+' | '알뜰폰';
          plan_type: string;
          trade_in_device?: string | null;
          trade_in_condition?: 'S' | 'A' | 'B' | 'C' | null;
          additional_notes?: string | null;
          status?: 'open' | 'quoted' | 'accepted' | 'completed' | 'expired' | 'cancelled';
          expires_at: string;
          quote_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_id?: string;
          storage?: string;
          color?: string;
          carrier?: 'SKT' | 'KT' | 'LGU+' | '알뜰폰';
          plan_type?: string;
          trade_in_device?: string | null;
          trade_in_condition?: 'S' | 'A' | 'B' | 'C' | null;
          additional_notes?: string | null;
          status?: 'open' | 'quoted' | 'accepted' | 'completed' | 'expired' | 'cancelled';
          expires_at?: string;
          quote_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quote_requests_device_id_fkey';
            columns: ['device_id'];
            referencedRelation: 'devices';
            referencedColumns: ['id'];
          },
        ];
      };

      // ----------------------------------------------------------
      // quotes — 딜러가 제출한 견적 (역경매 입찰)
      // ----------------------------------------------------------
      quotes: {
        Row: {
          id: string;
          request_id: string;          // references quote_requests.id
          dealer_id: string;           // references dealers.id
          device_price: number;        // 기기값 (원)
          monthly_fee: number;         // 월 요금제 비용 (원)
          subsidy: number;             // 공시지원금 (원)
          additional_discount: number; // 추가 할인 (원)
          total_cost_24m: number;      // 24개월 총 비용
          message: string | null;
          status: 'pending' | 'accepted' | 'rejected' | 'expired';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          dealer_id: string;
          device_price: number;
          monthly_fee: number;
          subsidy?: number;
          additional_discount?: number;
          total_cost_24m: number;
          message?: string | null;
          status?: 'pending' | 'accepted' | 'rejected' | 'expired';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          dealer_id?: string;
          device_price?: number;
          monthly_fee?: number;
          subsidy?: number;
          additional_discount?: number;
          total_cost_24m?: number;
          message?: string | null;
          status?: 'pending' | 'accepted' | 'rejected' | 'expired';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'quotes_request_id_fkey';
            columns: ['request_id'];
            referencedRelation: 'quote_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'quotes_dealer_id_fkey';
            columns: ['dealer_id'];
            referencedRelation: 'dealers';
            referencedColumns: ['id'];
          },
        ];
      };

      // ----------------------------------------------------------
      // dealers — 인증된 휴대폰 판매 딜러 (성지 업체)
      // ----------------------------------------------------------
      dealers: {
        Row: {
          id: string;
          user_id: string;           // references auth.users
          store_name: string;
          business_number: string;   // 사업자등록번호
          region: string;            // e.g. '신림', '강남'
          address: string;
          phone: string;
          rating: number;            // 0.0 ~ 5.0
          review_count: number;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          store_name: string;
          business_number: string;
          region: string;
          address: string;
          phone: string;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          store_name?: string;
          business_number?: string;
          region?: string;
          address?: string;
          phone?: string;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      // ----------------------------------------------------------
      // chat_rooms — 견적 수락 후 생성되는 1:1 채팅방
      // ----------------------------------------------------------
      chat_rooms: {
        Row: {
          id: string;
          quote_id: string;              // references quotes.id
          user_id: string;
          dealer_id: string;
          last_message: string | null;
          last_message_at: string | null;
          user_unread_count: number;
          dealer_unread_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          user_id: string;
          dealer_id: string;
          last_message?: string | null;
          last_message_at?: string | null;
          user_unread_count?: number;
          dealer_unread_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          quote_id?: string;
          user_id?: string;
          dealer_id?: string;
          last_message?: string | null;
          last_message_at?: string | null;
          user_unread_count?: number;
          dealer_unread_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_rooms_quote_id_fkey';
            columns: ['quote_id'];
            referencedRelation: 'quotes';
            referencedColumns: ['id'];
          },
        ];
      };

      // ----------------------------------------------------------
      // messages — 채팅 메시지
      // ----------------------------------------------------------
      messages: {
        Row: {
          id: string;
          room_id: string;             // references chat_rooms.id
          sender_id: string;           // references auth.users
          sender_type: 'user' | 'dealer';
          content: string;
          message_type: 'text' | 'image' | 'quote_update';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          sender_id: string;
          sender_type: 'user' | 'dealer';
          content: string;
          message_type?: 'text' | 'image' | 'quote_update';
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          sender_id?: string;
          sender_type?: 'user' | 'dealer';
          content?: string;
          message_type?: 'text' | 'image' | 'quote_update';
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_room_id_fkey';
            columns: ['room_id'];
            referencedRelation: 'chat_rooms';
            referencedColumns: ['id'];
          },
        ];
      };

      // ----------------------------------------------------------
      // notifications — 인앱 알림
      // ----------------------------------------------------------
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'new_quote' | 'quote_accepted' | 'chat_message' | 'quote_expired' | 'system';
          title: string;
          body: string;
          data: Record<string, unknown> | null; // JSON payload (quote_id, request_id 등)
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'new_quote' | 'quote_accepted' | 'chat_message' | 'quote_expired' | 'system';
          title: string;
          body: string;
          data?: Record<string, unknown> | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'new_quote' | 'quote_accepted' | 'chat_message' | 'quote_expired' | 'system';
          title?: string;
          body?: string;
          data?: Record<string, unknown> | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: {
      get_or_create_chat_room: {
        Args: {
          p_quote_id: string;
          p_user_id: string;
          p_dealer_id: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ============================================================
// Convenience Row types — 컴포넌트에서 직접 임포트해서 사용
// ============================================================
export type Profile      = Database['public']['Tables']['profiles']['Row'];
export type Device       = Database['public']['Tables']['devices']['Row'];
export type QuoteRequest = Database['public']['Tables']['quote_requests']['Row'];
export type Quote        = Database['public']['Tables']['quotes']['Row'];
export type Dealer       = Database['public']['Tables']['dealers']['Row'];
export type ChatRoom     = Database['public']['Tables']['chat_rooms']['Row'];
export type Message      = Database['public']['Tables']['messages']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// ============================================================
// Insert / Update convenience types
// ============================================================
export type ProfileInsert      = Database['public']['Tables']['profiles']['Insert'];
export type DeviceInsert       = Database['public']['Tables']['devices']['Insert'];
export type QuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert'];
export type QuoteInsert        = Database['public']['Tables']['quotes']['Insert'];
export type DealerInsert       = Database['public']['Tables']['dealers']['Insert'];
export type ChatRoomInsert     = Database['public']['Tables']['chat_rooms']['Insert'];
export type MessageInsert      = Database['public']['Tables']['messages']['Insert'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

export type ProfileUpdate      = Database['public']['Tables']['profiles']['Update'];
export type DeviceUpdate       = Database['public']['Tables']['devices']['Update'];
export type QuoteRequestUpdate = Database['public']['Tables']['quote_requests']['Update'];
export type QuoteUpdate        = Database['public']['Tables']['quotes']['Update'];
export type DealerUpdate       = Database['public']['Tables']['dealers']['Update'];
export type ChatRoomUpdate     = Database['public']['Tables']['chat_rooms']['Update'];
export type MessageUpdate      = Database['public']['Tables']['messages']['Update'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];
