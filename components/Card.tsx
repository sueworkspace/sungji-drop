import React from 'react';
import {
  View,
  ViewProps,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';

interface CardProps extends ViewProps {
  variant?: 'default' | 'neon' | 'hot' | 'gold';
  style?: ViewStyle;
  children: React.ReactNode;
}

interface PressableCardProps extends TouchableOpacityProps {
  variant?: 'default' | 'neon' | 'hot' | 'gold';
  style?: ViewStyle;
  children: React.ReactNode;
}

const variantConfig = {
  default: {
    bg: Colors.card,
    border: Colors.border,
    glow: undefined as string | undefined,
  },
  neon: {
    bg: Colors.card,
    border: Colors.dropGreen,
    glow: Colors.dropGreen,
  },
  hot: {
    bg: '#00FF8808',  // dropGreen at ~3% opacity
    border: Colors.dropGreen,
    glow: Colors.dropGreen,
  },
  gold: {
    bg: Colors.card,
    border: Colors.dealGold,
    glow: Colors.dealGold,
  },
};

function buildCardStyle(variant: CardProps['variant'] = 'default', extra?: ViewStyle): ViewStyle[] {
  const cfg = variantConfig[variant];
  const glowShadow = cfg.glow
    ? Platform.select({
        ios: {
          shadowColor: cfg.glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: { elevation: 4 },
      })
    : {};

  return [
    {
      backgroundColor: cfg.bg,
      borderRadius: BorderRadius.lg,
      padding: Spacing.base,
      borderWidth: 1,
      borderColor: cfg.border,
    },
    glowShadow as ViewStyle,
    extra ?? {},
  ];
}

export function Card({ variant = 'default', style, children, ...props }: CardProps) {
  return (
    <View {...props} style={buildCardStyle(variant, style)}>
      {children}
    </View>
  );
}

export function PressableCard({ variant = 'default', style, children, ...props }: PressableCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} {...props} style={buildCardStyle(variant, style)}>
      {children}
    </TouchableOpacity>
  );
}
