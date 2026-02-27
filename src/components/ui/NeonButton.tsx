import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function NeonButton({ title, onPress, variant = 'primary', size = 'md', fullWidth = false, style }: NeonButtonProps) {
  const bgColor = variant === 'primary' ? Colors.dropGreen : variant === 'danger' ? Colors.alertRed : 'transparent';
  const textColor = variant === 'secondary' ? Colors.textSecondary : Colors.bgDark;
  const borderColor = variant === 'secondary' ? Colors.border : bgColor;
  const padding = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const fontSize = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: bgColor,
          borderColor,
          paddingVertical: padding,
          paddingHorizontal: padding * 2,
        },
        fullWidth && styles.fullWidth,
        variant === 'primary' && {
          shadowColor: Colors.dropGreen,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 5,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: 'PressStart2P',
    letterSpacing: 1,
  },
});
