// 성지DROP 테마 — 글로우 이펙트, 공통 스타일, 간격 시스템
// 출처: docs/02-DESIGN-SYSTEM.md

import { Platform, StyleSheet } from 'react-native';
import { Colors } from './colors';

// ─── Spacing System ──────────────────────────────────────────────────────────
// 기본 픽셀 단위: 4px (픽셀아트 그리드 기반)
export const Spacing = {
  px: 1,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 64,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ─── Glow Effects ────────────────────────────────────────────────────────────
// React Native는 CSS text-shadow를 지원하지 않으므로 shadow props 사용
export const GlowEffects = {
  dropGreen: Platform.select({
    ios: {
      shadowColor: Colors.dropGreen,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    android: {
      elevation: 8,
    },
  }),
  dropGreenStrong: Platform.select({
    ios: {
      shadowColor: Colors.dropGreen,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 20,
    },
    android: {
      elevation: 12,
    },
  }),
  alertRed: Platform.select({
    ios: {
      shadowColor: Colors.alertRed,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    android: {
      elevation: 8,
    },
  }),
  dealGold: Platform.select({
    ios: {
      shadowColor: Colors.dealGold,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    android: {
      elevation: 8,
    },
  }),
} as const;

// ─── Common Shadows (Cards) ──────────────────────────────────────────────────
export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  }),
  cardNeon: Platform.select({
    ios: {
      shadowColor: Colors.dropGreen,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
    },
    android: {
      elevation: 6,
    },
  }),
} as const;

// ─── Animation Durations ─────────────────────────────────────────────────────
export const Duration = {
  fast: 80,         // 가격 드롭 카운터 간격
  blink: 530,       // 커서 블링킹
  pulse: 1000,      // 펄스 애니메이션
  typewriter: 60,   // 타이프라이터 (ms/글자)
  transition: 200,  // UI 전환
  slow: 400,        // 슬로우 트랜지션
} as const;

// ─── Common StyleSheet Presets ────────────────────────────────────────────────
export const CommonStyles = StyleSheet.create({
  // Layout
  flex1: { flex: 1 },
  row: { flexDirection: 'row' },
  center: { alignItems: 'center', justifyContent: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },

  // Screens
  screenBg: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // Cards
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardNeon: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.dropGreen,
  },

  // Pixel border (1px exact)
  pixelBorder: {
    borderWidth: 1,
    borderColor: Colors.dropGreen,
  },

  // Neon text color
  neonText: {
    color: Colors.dropGreen,
  },
  alertText: {
    color: Colors.alertRed,
  },
  goldText: {
    color: Colors.dealGold,
  },
  mutedText: {
    color: Colors.textMuted,
  },

  // Padding presets
  padSm: { padding: Spacing.sm },
  padMd: { padding: Spacing.md },
  padBase: { padding: Spacing.base },
  padLg: { padding: Spacing.lg },

  padHSm: { paddingHorizontal: Spacing.sm },
  padHBase: { paddingHorizontal: Spacing.base },
  padHLg: { paddingHorizontal: Spacing.lg },

  padVSm: { paddingVertical: Spacing.sm },
  padVBase: { paddingVertical: Spacing.base },
  padVLg: { paddingVertical: Spacing.lg },
});

// ─── Z-Index ─────────────────────────────────────────────────────────────────
export const ZIndex = {
  base: 0,
  card: 10,
  overlay: 50,
  modal: 100,
  toast: 200,
} as const;
