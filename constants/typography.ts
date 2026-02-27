// 성지DROP 타이포그래피 시스템
// 출처: docs/02-DESIGN-SYSTEM.md

export const FontFamily = {
  // 픽셀/게임 UI — 순위, 뱃지, 레이블, 가격 표시, 상태 텍스트
  pixel: 'PressStart2P',

  // 한국어 본문
  korean: 'NotoSansKR-Regular',
  koreanBold: 'NotoSansKR-Bold',

  // 코드/데이터 — 가격 수치, 데이터 표시
  mono: 'JetBrainsMono-Regular',
  monoBold: 'JetBrainsMono-Bold',
} as const;

export const FontSize = {
  // Pixel font sizes (Press Start 2P)
  badge: 6,        // 뱃지 텍스트
  label: 7,        // 소형 레이블
  labelSm: 9,      // 소형 레이블 (크게)
  section: 11,     // 섹션 타이틀
  cardPrice: 11,   // 가격 (카드 내)
  mainPrice: 28,   // 가격 (메인 표시)

  // Korean font sizes (Noto Sans KR)
  caption: 12,
  body: 14,
  bodyLg: 16,
  bodyXl: 18,
  subTitle: 20,
  title: 24,
  titleLg: 28,
  heading: 32,
  wordmark: 36,    // 브랜드 워드마크 기준
} as const;

export const FontWeight = {
  light: '300',
  regular: '400',
  bold: '700',
  black: '900',
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
  // Pixel font — tight line height to match game UI
  pixel: 1.6,
} as const;

export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 1,
  wider: 2,
  widest: 4,
  // Pixel font typically needs wider spacing
  pixel: 2,
} as const;

// Preset text styles for common use cases
export const TextStyles = {
  pixelBadge: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.badge,
    letterSpacing: LetterSpacing.pixel,
  },
  pixelLabel: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.label,
    letterSpacing: LetterSpacing.pixel,
  },
  pixelSection: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.section,
    letterSpacing: LetterSpacing.pixel,
  },
  pixelCardPrice: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.cardPrice,
    letterSpacing: LetterSpacing.pixel,
  },
  pixelMainPrice: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.mainPrice,
    letterSpacing: LetterSpacing.pixel,
  },
  body: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.body * LineHeight.normal,
  },
  bodyBold: {
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.body * LineHeight.normal,
  },
  caption: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.caption * LineHeight.normal,
  },
  wordmark: {
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.wordmark,
    fontWeight: FontWeight.black,
  },
} as const;
