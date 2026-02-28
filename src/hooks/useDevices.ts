import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Device } from '../lib/supabase-types';

interface UseDevicesReturn {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDevices(): UseDevicesReturn {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('devices')
        .select('*')
        .eq('is_active', true)
        .order('original_price', { ascending: false });

      if (queryError) {
        setError(queryError.message);
        setDevices([]);
        return;
      }

      setDevices((data as Device[]) ?? []);
    } catch (e: any) {
      setError(e?.message ?? '기기 목록을 불러오는 중 오류가 발생했습니다.');
      setDevices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return { devices, isLoading, error, refetch: fetchDevices };
}
