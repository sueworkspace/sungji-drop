import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ChatRoomWithDetails {
  id: string;
  quote_id: string;
  user_id: string;
  dealer_id: string;
  last_message: string | null;
  last_message_at: string | null;
  user_unread_count: number;
  is_active: boolean;
  created_at: string;
  dealers: { store_name: string; region: string } | null;
}

interface UseChatRoomsReturn {
  chatRooms: ChatRoomWithDetails[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useChatRooms(): UseChatRoomsReturn {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoomWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatRooms = useCallback(async () => {
    if (!user) {
      setChatRooms([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('chat_rooms')
        .select('*, dealers(store_name, region)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (queryError) {
        setError(queryError.message);
        setChatRooms([]);
        return;
      }

      setChatRooms((data as unknown as ChatRoomWithDetails[]) ?? []);
    } catch (e: any) {
      setError(e?.message ?? '채팅 목록을 불러오는 중 오류가 발생했습니다.');
      setChatRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  return { chatRooms, isLoading, error, refetch: fetchChatRooms };
}
