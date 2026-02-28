import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { QuoteRequest } from '../lib/supabase-types';

// ─── Types ──────────────────────────────────────────────────────────────────────

/** 기기 정보가 조인된 견적 요청 + 최저 견적 비용 */
export interface QuoteRequestWithDevice extends QuoteRequest {
  devices: {
    name: string;
    brand: string;
    image_url: string | null;
  } | null;
  quotes: {
    total_cost_24m: number;
  }[];
}

interface UseMyQuoteRequestsReturn {
  requests: QuoteRequestWithDevice[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useMyQuoteRequests(): UseMyQuoteRequestsReturn {
  const { user } = useAuth();
  const [requests, setRequests] = useState<QuoteRequestWithDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!user) {
      setRequests([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('quote_requests')
        .select('*, devices(name, brand, image_url), quotes(total_cost_24m)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        setError(queryError.message);
        setRequests([]);
        return;
      }

      setRequests((data as unknown as QuoteRequestWithDevice[]) ?? []);
    } catch (e: any) {
      setError(e?.message ?? '견적 요청 목록을 불러오는 중 오류가 발생했습니다.');
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // ─── Initial fetch ──────────────────────────────────────────────────────────

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ─── Realtime subscription ──────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('my-quote-requests')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as QuoteRequest;
          setRequests((prev) =>
            prev.map((req) =>
              req.id === updated.id
                ? { ...req, ...updated }
                : req
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { requests, isLoading, error, refetch: fetchRequests };
}
