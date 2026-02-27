import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ScanlineOverlayProps {
  style?: ViewStyle;
}

// CRT 스캔라인 효과 오버레이
// React Native에서 repeating-linear-gradient를 직접 지원하지 않으므로
// 얇은 View 라인들을 반복하여 스캔라인 효과를 구현합니다.
// 성능을 위해 포인터 이벤트를 none으로 설정합니다.
export function ScanlineOverlay({ style }: ScanlineOverlayProps) {
  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container, style]}
      pointerEvents="none"
    >
      {/* 스캔라인 패턴: 2px 투명 + 2px 네온 그린 반투명 반복 */}
      {Array.from({ length: 200 }).map((_, i) => (
        <View key={i} style={styles.line} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    zIndex: 0,
  },
  line: {
    height: 4,             // 2px transparent + 2px scanline
    backgroundColor: 'rgba(0,255,136,0.015)',
    marginBottom: 2,       // creates the transparent gap
  },
});
