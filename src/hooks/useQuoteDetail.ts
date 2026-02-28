import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { QuoteRequest, Quote, Dealer } from '../lib/supabase-types';

// ─── Types ──────────────────────────────────────────────────────────────────────

/** 견적 요청 상세 — 기기명/브랜드 조인 */
export interface RequestDetail extends QuoteRequest {
  devices: {
    name: string;
    brand: string;
  } | null;
}

/** 딜러 정보가 조인된 개별 견적 */
export interface QuoteWithDealer extends Quote {
  dealers: Pick<Dealer, 'id' | 'store_name' | 'region' | 'rating' | 'review_count'> | null;
}

interface UseQuoteDetailReturn {
  request: RequestDetail | null;
  quotes: QuoteWithDealer[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useQuoteDetail(requestId: string | undefined): UseQuoteDetailReturn {
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [quotes, setQuotes] = useState<QuoteWithDealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!requestId) {
      setRequest(null);
      setQuotes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [requestResult, quotesResult] = await Promise.all([
        supabase
          .from('quote_requests')
          .select('*, devices(name, brand)')
          .eq('id', requestId)
          .single(),
        supabase
          .from('quotes')
          .select('*, dealers(id, store_name, region, rating, review_count)')
          .eq('request_id', requestId)
          .order('total_cost_24m', { ascending: true }),
      ]);

      if (requestResult.error) {
        setError(requestResult.error.message);
        setRequest(null);
        setQuotes([]);
        return;
      }

      if (quotesResult.error) {
        setError(quotesResult.error.message);
        setRequest(null);
        setQuotes([]);
        return;
      }

      setRequest((requestResult.data as unknown as RequestDetail) ?? null);
      setQuotes((quotesResult.data as unknown as QuoteWithDealer[]) ?? []);
    } catch (e: any) {
      setError(e?.message ?? '견적 상세 정보를 불러오는 중 오류가 발생했습니다.');
      setRequest(null);
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { request, quotes, isLoading, error, refetch: fetchDetail };
}
