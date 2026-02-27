import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { PixelText } from './PixelText';
import { Colors } from '../../constants/colors';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected = false, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        selected && styles.selected,
      ]}
    >
      <PixelText
        size={7}
        color={selected ? Colors.dropGreen : Colors.textDim}
      >
        {label}
      </PixelText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  selected: {
    backgroundColor: Colors.greenOverlayMid,
    borderColor: Colors.dropGreen,
  },
});
