import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface PixelTextProps extends TextProps {
  size?: number;
  color?: string;
  glow?: boolean;
}

export function PixelText({ size = 9, color = Colors.dropGreen, glow = false, style, ...props }: PixelTextProps) {
  return (
    <Text
      style={[
        styles.base,
        { fontSize: size, color },
        glow && {
          textShadowColor: color,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'PressStart2P',
  },
});
