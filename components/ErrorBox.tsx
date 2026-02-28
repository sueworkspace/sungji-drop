import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants';
import { PixelText } from './PixelText';
import { NeonButton } from './NeonButton';

interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  return (
    <View style={styles.container}>
      <PixelText size="section" color={Colors.alertRed}>
        ERROR
      </PixelText>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <NeonButton
          label="다시 시도"
          onPress={onRetry}
          size="md"
          variant="danger"
          style={styles.retryButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: Spacing.base,
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.alertRed,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  message: {
    fontFamily: 'NotoSansKR',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: Spacing.xs,
  },
});
