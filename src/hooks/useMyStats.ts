import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface UserStats {
  totalRequests: number;
  completed: number;
  activeChats: number;
}

const EMPTY_STATS: UserStats = {
  totalRequests: 0,
  completed: 0,
  activeChats: 0,
};

interface UseMyStatsReturn {
  stats: UserStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useMyStats(): UseMyStatsReturn {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(EMPTY_STATS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [requestsResult, chatsResult] = await Promise.all([
        supabase
          .from('quote_requests')
          .select('id, status', { count: 'exact' })
          .eq('user_id', user.id),
        supabase
          .from('chat_rooms')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('is_active', true),
      ]);

      if (requestsResult.error) {
        setError(requestsResult.error.message);
        setStats(EMPTY_STATS);
        return;
      }

      if (chatsResult.error) {
        setError(chatsResult.error.message);
        setStats(EMPTY_STATS);
        return;
      }

      const totalRequests = requestsResult.count ?? 0;
      const completed = (requestsResult.data ?? []).filter(
        (r) => r.status === 'completed' || r.status === 'accepted'
      ).length;
      const activeChats = chatsResult.count ?? 0;

      setStats({ totalRequests, completed, activeChats });
    } catch (e: any) {
      setError(e?.message ?? '통계를 불러오는 중 오류가 발생했습니다.');
      setStats(EMPTY_STATS);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}
