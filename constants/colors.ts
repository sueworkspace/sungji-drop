// 성지DROP 컬러 팔레트
// 출처: docs/02-DESIGN-SYSTEM.md

export const Colors = {
  // Primary Brand Colors
  dropGreen: '#00FF88',    // 핵심 액션, 최저가, 브랜드 메인
  alertRed: '#FF6B6B',     // 가격 하락, 긴급 알림, HOT 뱃지
  dealGold: '#FFD93D',     // 특가, 이벤트, 뱃지, 랭킹 1위
  saveGreen: '#6BCB77',    // 절약 금액, 성공 상태

  // Background Colors
  bg: '#0A0A1A',           // 메인 배경 (alias: bgDark)
  bgDark: '#0A0A1A',
  card: '#1A1A2E',         // 카드, 패널, 입력 필드 배경 (alias: cardDark)
  cardDark: '#1A1A2E',
  deepDark: '#0D0D1A',     // 코드 블록, 강조 배경

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#888888',
  textDim: '#555555',      // 비활성/약한 텍스트
  textInverse: '#0A0A1A',  // 밝은 배경 위 텍스트
  textDark: '#333333',

  // Border & Divider
  border: '#333333',
  borderGreen: '#00FF8833',
  borderGreenLight: '#00FF8822',
  borderGreenMid: '#00FF8844',
  divider: '#1E1E3A',

  // Transparent overlays (green)
  greenOverlay: '#00FF8808',
  greenOverlayLight: '#00FF8811',
  greenOverlayMid: '#00FF8822',
  redOverlay: '#FF6B6B11',

  // Glow variants (with alpha)
  dropGreenGlow: '#00FF8888',    // text-shadow용 50% alpha
  dropGreenGlowBox: '#00FF8833', // box-shadow용 20% alpha
  dropGreenGlowSoft: '#00FF8811', // 배경 인셋 글로우
  alertRedGlow: '#FF6B6B88',
  dealGoldGlow: '#FFD93D88',

  // Scanline overlay
  scanlineColor: 'rgba(0,255,136,0.015)',

  // State Colors
  success: '#00FF88',
  error: '#FF6B6B',
  warning: '#FFD93D',
  info: '#6BCB77',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

// Gradient definitions (for LinearGradient components)
export const Gradients = {
  primary: ['#00FF88', '#00AA55'],
  alert: ['#FF6B6B', '#FF3333'],
  neonBg: ['#0A0A1A', '#1A1A2E'],
  neonGlow: ['#0A0A1A', '#1A1A2E'],
  cardHighlight: ['#1A1A2E', '#0D0D1A'],
} as const;

export const Glows = {
  greenText: '0 0 20px #00FF8888',
  greenBox: '0 0 10px #00FF8833',
  redText: '0 0 10px #FF6B6B',
  greenPulseMin: '0 0 5px #00FF8844',
  greenPulseMax: '0 0 20px #00FF8888',
} as const;
