import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { PixelText } from './PixelText';

type BadgeVariant = 'hot' | 'live' | 'new' | 'best' | 'sale' | 'rank1' | 'rank2' | 'rank3';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  style?: ViewStyle;
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string; border?: string; blink?: boolean }> = {
  hot: { bg: Colors.alertRed, text: Colors.textInverse, blink: true },
  live: { bg: 'transparent', text: Colors.alertRed, border: Colors.alertRed, blink: true },
  new: { bg: Colors.dropGreen, text: Colors.textInverse },
  best: { bg: Colors.dropGreen, text: Colors.textInverse, border: Colors.dropGreen },
  sale: { bg: Colors.alertRed, text: Colors.textPrimary },
  rank1: { bg: Colors.dealGold, text: Colors.textInverse },
  rank2: { bg: '#C0C0C0', text: Colors.textInverse },  // silver
  rank3: { bg: '#CD7F32', text: Colors.textInverse },  // bronze
};

const defaultLabels: Record<BadgeVariant, string> = {
  hot: 'HOT',
  live: '● LIVE',
  new: 'NEW',
  best: 'BEST',
  sale: 'SALE',
  rank1: '1st',
  rank2: '2nd',
  rank3: '3rd',
};

export function Badge({ variant, label, style }: BadgeProps) {
  const cfg = variantConfig[variant];
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!cfg.blink) return;

    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 0, duration: 530, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 530, useNativeDriver: true }),
      ])
    );
    blinkLoop.start();
    return () => blinkLoop.stop();
  }, [cfg.blink, opacityAnim]);

  const content = (
    <View
      style={[
        {
          backgroundColor: cfg.bg,
          borderRadius: BorderRadius.sm,
          paddingVertical: 2,
          paddingHorizontal: Spacing.xs,
          borderWidth: cfg.border ? 1 : 0,
          borderColor: cfg.border ?? 'transparent',
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <PixelText size="badge" color={cfg.text}>
        {label ?? defaultLabels[variant]}
      </PixelText>
    </View>
  );

  if (cfg.blink) {
    return <Animated.View style={{ opacity: opacityAnim }}>{content}</Animated.View>;
  }

  return content;
}
