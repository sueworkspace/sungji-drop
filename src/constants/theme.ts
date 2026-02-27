// Re-export from canonical root constants
export { Spacing, BorderRadius, GlowEffects, Shadows, Duration, CommonStyles, ZIndex } from '../../constants/theme';

// Re-export colors and fonts for convenience (matches original src/constants/theme.ts API)
export { Colors, Gradients, Glows } from '../../constants/colors';
export { FontFamily as Fonts, FontSize as FontSizes } from '../../constants/typography';

// Legacy named exports used by TabNavigator and DealCard
export const TabBar = {
  height: 60,
  bg: '#0A0A1A',
  activeColor: '#00FF88',
  inactiveColor: '#555555',
  labelFont: 'PressStart2P',
  labelSize: 6,
  borderTopColor: '#00FF8822',
} as const;

export const CardStyle = {
  backgroundColor: '#1A1A2E',
  borderColor: '#00FF8822',
  borderWidth: 1 as const,
  padding: 16,
} as const;

export const HotCardStyle = {
  backgroundColor: '#00FF8808',
  borderColor: '#00FF8833',
  borderWidth: 1 as const,
  padding: 16,
} as const;
