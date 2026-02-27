import React from 'react';
import { View, StyleSheet } from 'react-native';

export function ScanlineOverlay() {
  const lines = Array.from({ length: 200 });
  return (
    <View style={styles.container} pointerEvents="none">
      {lines.map((_, i) => (
        <View
          key={i}
          style={[
            styles.line,
            i % 2 === 0 ? styles.transparent : styles.scanline,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    opacity: 0.5,
  },
  line: {
    height: 2,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  scanline: {
    backgroundColor: 'rgba(0,255,136,0.015)',
  },
});
