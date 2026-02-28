import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getCurrentUserId } from '../lib/supabase';
import type { Message } from '../lib/supabase-types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  refetch: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useMessages(roomId: string | undefined): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // ─── Fetch messages ─────────────────────────────────────────────────────────

  const fetchMessages = useCallback(async () => {
    if (!roomId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (queryError) {
        setError(queryError.message);
        setMessages([]);
        return;
      }

      setMessages((data as Message[]) ?? []);
    } catch (e: any) {
      setError(e?.message ?? '메시지를 불러오는 중 오류가 발생했습니다.');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // ─── Initial fetch + Realtime subscription ──────────────────────────────────

  useEffect(() => {
    fetchMessages();

    if (!roomId) return;

    // Subscribe to new messages in this room
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates (in case we just inserted it optimistically)
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup on unmount or roomId change
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, fetchMessages]);

  // ─── Send message ───────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (content: string) => {
      if (!roomId) return;

      const userId = await getCurrentUserId();
      if (!userId) return;

      try {
        const { error: insertError } = await supabase.from('messages').insert({
          room_id: roomId,
          sender_id: userId,
          sender_type: 'user' as const,
          content,
          message_type: 'text' as const,
        });

        if (insertError) {
          console.error('[useMessages] sendMessage insert error:', insertError.message);
          return;
        }

        // Update chat_room's last_message
        await supabase
          .from('chat_rooms')
          .update({
            last_message: content,
            last_message_at: new Date().toISOString(),
          })
          .eq('id', roomId);
      } catch (e: any) {
        console.error('[useMessages] sendMessage error:', e?.message);
      }
    },
    [roomId]
  );

  return { messages, isLoading, error, sendMessage, refetch: fetchMessages };
}
