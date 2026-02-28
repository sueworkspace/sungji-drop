// ============================================================
// Supabase Client — 성지DROP 역경매 플랫폼
// ============================================================
// 실제 프로젝트에서는 EXPO_PUBLIC_SUPABASE_URL과
// EXPO_PUBLIC_SUPABASE_ANON_KEY 환경변수를 .env 파일에 설정하세요.
// 참조: /.env.example
// ============================================================

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './supabase-types';

// ------------------------------------------------------------
// Supabase 프로젝트 설정 (anon key는 공개 키이므로 코드에 포함 가능)
// ------------------------------------------------------------
const supabaseUrl = 'https://okrmviftqsrqjfxapyxm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcm12aWZ0cXNycWpmeGFweXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTg2MjksImV4cCI6MjA4Nzc5NDYyOX0.Duk13orD42EFLEgBJ8Fj7YnpsfS3H_R61TaIOhXzlrw';

// ------------------------------------------------------------
// Supabase 클라이언트 초기화
// ------------------------------------------------------------
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // React Native에서는 AsyncStorage로 세션을 영속화
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // 모바일 앱에서는 URL 기반 세션 감지 불필요
    detectSessionInUrl: false,
  },
});

// ------------------------------------------------------------
// 편의 헬퍼 — 현재 로그인 사용자 ID 가져오기
// ------------------------------------------------------------
export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ------------------------------------------------------------
// 편의 헬퍼 — 현재 로그인 사용자 세션 가져오기
// ------------------------------------------------------------
export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error('[Supabase] getSession error:', error.message);
    return null;
  }
  return session;
}

export default supabase;
