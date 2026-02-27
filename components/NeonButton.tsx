import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize, LetterSpacing } from '../constants';
import { PixelText } from './PixelText';

type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'gold';

interface NeonButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, { bg: string; border: string; text: string; glow: string }> = {
  primary: {
    bg: 'transparent',
    border: Colors.dropGreen,
    text: Colors.dropGreen,
    glow: Colors.dropGreen,
  },
  danger: {
    bg: 'transparent',
    border: Colors.alertRed,
    text: Colors.alertRed,
    glow: Colors.alertRed,
  },
  ghost: {
    bg: 'transparent',
    border: Colors.border,
    text: Colors.textSecondary,
    glow: 'transparent',
  },
  gold: {
    bg: 'transparent',
    border: Colors.dealGold,
    text: Colors.dealGold,
    glow: Colors.dealGold,
  },
};

const sizeStyles: Record<'sm' | 'md' | 'lg', { paddingV: number; paddingH: number; fontSize: number }> = {
  sm: { paddingV: Spacing.xs, paddingH: Spacing.sm, fontSize: FontSize.label },
  md: { paddingV: Spacing.sm, paddingH: Spacing.base, fontSize: FontSize.section },
  lg: { paddingV: Spacing.md, paddingH: Spacing.xl, fontSize: FontSize.section },
};

export function NeonButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...props
}: NeonButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  const glowShadow = Platform.select({
    ios: {
      shadowColor: v.glow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: isDisabled ? 0 : 0.8,
      shadowRadius: 8,
    },
    android: { elevation: isDisabled ? 0 : 6 },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      {...props}
      style={[
        {
          backgroundColor: v.bg,
          borderWidth: 1,
          borderColor: isDisabled ? Colors.border : v.border,
          borderRadius: BorderRadius.sm,
          paddingVertical: s.paddingV,
          paddingHorizontal: s.paddingH,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        glowShadow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <PixelText
          size="label"
          color={isDisabled ? Colors.textMuted : v.text}
          style={[{ fontSize: s.fontSize }, textStyle]}
        >
          {label}
        </PixelText>
      )}
    </TouchableOpacity>
  );
}
