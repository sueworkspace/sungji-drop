import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { PixelText } from './PixelText';
import { Colors } from '../../constants/colors';

interface BadgeProps {
  type: 'hot' | 'live' | 'best' | 'new' | 'optimal';
  blink?: boolean;
}

const badgeConfig = {
  hot: { text: 'HOT', color: Colors.alertRed, bg: '#FF6B6B22' },
  live: { text: 'LIVE', color: Colors.alertRed, bg: '#FF6B6B22' },
  best: { text: '★ BEST', color: Colors.dropGreen, bg: Colors.greenOverlay },
  new: { text: 'NEW', color: Colors.dealGold, bg: '#FFD93D22' },
  optimal: { text: '💚 최적', color: Colors.dropGreen, bg: Colors.greenOverlay },
};

export function Badge({ type, blink = false }: BadgeProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!blink) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [blink]);

  const config = badgeConfig[type];

  return (
    <Animated.View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.color, opacity }]}>
      <PixelText size={6} color={config.color}>{config.text}</PixelText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
