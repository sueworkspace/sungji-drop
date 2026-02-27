import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface CardProps extends ViewProps {
  hot?: boolean;
}

export function Card({ hot = false, style, children, ...props }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        hot && styles.hot,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderGreenLight,
    padding: 16,
    marginBottom: 8,
  },
  hot: {
    backgroundColor: Colors.greenOverlay,
    borderColor: Colors.borderGreen,
  },
});
