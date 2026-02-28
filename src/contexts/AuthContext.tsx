import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../lib/supabase-types';

// ─── Context Type ──────────────────────────────────────────────────────────────

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isNewUser: boolean; // true = 닉네임 미설정 (닉네임 설정 화면으로 안내)
  signInWithOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { nickname?: string; avatar_url?: string }) => Promise<{ error: Error | null }>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // ─── Profile Fetch Helper ────────────────────────────────────────────────────

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single<Profile>();

    if (error) {
      // 프로필이 없으면 새 유저로 간주
      if (error.code === 'PGRST116') {
        setProfile(null);
        setIsNewUser(true);
      } else {
        console.error('[AuthContext] fetchProfile error:', error.message);
        setProfile(null);
        setIsNewUser(true);
      }
      return;
    }

    setProfile(data);
    // 닉네임이 비어있거나 없으면 신규 유저 처리
    setIsNewUser(!data?.nickname || data.nickname.trim().length === 0);
  }

  // ─── Auth State Listener ─────────────────────────────────────────────────────

  useEffect(() => {
    // 앱 시작 시 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }).catch((e) => {
      console.error('[AuthContext] getSession error:', e);
      setIsLoading(false);
    });

    // 세션 변경 감지 (로그인/로그아웃/토큰 갱신)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
          setIsNewUser(false);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ─── Auth Methods ─────────────────────────────────────────────────────────────

  async function signInWithOtp(phone: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  }

  async function verifyOtp(phone: string, token: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  }

  async function signInWithEmail(email: string, password: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (e: any) {
      console.error('[AuthContext] signInWithEmail network error:', e);
      return { error: new Error(e?.message === 'Failed to fetch' ? '네트워크 연결을 확인해주세요. (Supabase 서버에 연결할 수 없습니다)' : (e?.message || '알 수 없는 오류가 발생했습니다.')) };
    }
  }

  async function signUpWithEmail(email: string, password: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (e: any) {
      console.error('[AuthContext] signUpWithEmail network error:', e);
      return { error: new Error(e?.message === 'Failed to fetch' ? '네트워크 연결을 확인해주세요. (Supabase 서버에 연결할 수 없습니다)' : (e?.message || '알 수 없는 오류가 발생했습니다.')) };
    }
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsNewUser(false);
  }

  async function updateProfile(
    updates: { nickname?: string; avatar_url?: string }
  ): Promise<{ error: Error | null }> {
    if (!user) {
      return { error: new Error('로그인이 필요합니다.') };
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        nickname: updates.nickname ?? profile?.nickname ?? '',
        avatar_url: updates.avatar_url ?? profile?.avatar_url ?? null,
        phone: profile?.phone ?? null,
        updated_at: now,
      })
      .select()
      .single<Profile>();

    if (error) {
      return { error: new Error(error.message) };
    }

    setProfile(data);
    setIsNewUser(!data?.nickname || data.nickname.trim().length === 0);
    return { error: null };
  }

  // ─── Context Value ────────────────────────────────────────────────────────────

  const value: AuthContextType = {
    session,
    user,
    profile,
    isLoading,
    isNewUser,
    signInWithOtp,
    verifyOtp,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}
