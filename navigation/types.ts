// ─── Navigation Types ─────────────────────────────────────────────────────────
// Auth 스택 (App.tsx에서 로그인 전 사용)
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// 메인 스택 (RootNavigator — 로그인 후 사용)
export type RootStackParamList = {
  Tabs: undefined;
  QuoteRequest: undefined;
  QuoteDetail: { requestId: string };
  ChatRoom: { roomId: string; dealerName: string };
  Notifications: undefined;
  Settings: undefined;
};

// 탭 네비게이터
export type TabParamList = {
  Home: undefined;
  Quotes: undefined;
  Chat: undefined;
  MyPage: undefined;
};
