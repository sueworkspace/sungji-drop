import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Colors, FontFamily, FontSize, LetterSpacing } from '../constants';

type PixelSize = 'badge' | 'label' | 'labelSm' | 'section' | 'cardPrice' | 'mainPrice';

interface PixelTextProps extends TextProps {
  size?: PixelSize;
  color?: string;
  glow?: boolean;
  style?: TextStyle | TextStyle[];
}

const sizeMap: Record<PixelSize, number> = {
  badge: FontSize.badge,
  label: FontSize.label,
  labelSm: FontSize.labelSm,
  section: FontSize.section,
  cardPrice: FontSize.cardPrice,
  mainPrice: FontSize.mainPrice,
};

export function PixelText({
  size = 'label',
  color = Colors.textPrimary,
  glow = false,
  style,
  children,
  ...props
}: PixelTextProps) {
  const glowStyle: TextStyle = glow
    ? {
        // React Native supports textShadow on iOS via shadowColor
        // We use a workaround with overlapping Text for glow on Android
        textShadowColor: Colors.dropGreen,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      }
    : {};

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: FontFamily.pixel,
          fontSize: sizeMap[size],
          color,
          letterSpacing: LetterSpacing.pixel,
          lineHeight: sizeMap[size] * 1.8,
        },
        glowStyle,
        style,
      ]}
    >
      {children}
    </Text>
  );
}
