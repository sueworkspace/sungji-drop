import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Notification } from '../lib/supabase-types';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Derived state ────────────────────────────────────────────────────────────

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // ─── Fetch ────────────────────────────────────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (queryError) {
        setError(queryError.message);
        setNotifications([]);
        return;
      }

      setNotifications((data as Notification[]) ?? []);
    } catch (e: any) {
      setError(e?.message ?? '알림을 불러오는 중 오류가 발생했습니다.');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Mark single notification as read (optimistic) ────────────────────────────

  const markAsRead = useCallback(
    async (id: string) => {
      if (!user) return;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );

      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        // Revert optimistic update on failure
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
        );
        console.error('[useNotifications] markAsRead error:', updateError.message);
      }
    },
    [user]
  );

  // ─── Mark all notifications as read (optimistic) ──────────────────────────────

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    const previousNotifications = notifications;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

    const { error: updateError } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (updateError) {
      // Revert optimistic update on failure
      setNotifications(previousNotifications);
      console.error('[useNotifications] markAllAsRead error:', updateError.message);
    }
  }, [user, notifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
