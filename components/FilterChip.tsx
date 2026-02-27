import React from 'react';
import { ScrollView, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { PixelText } from './PixelText';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function FilterChip({ label, selected = false, onPress, style }: FilterChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        {
          backgroundColor: selected ? Colors.dropGreen : 'transparent',
          borderRadius: BorderRadius.full,
          borderWidth: 1,
          borderColor: selected ? Colors.dropGreen : Colors.border,
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.sm,
          marginRight: Spacing.xs,
        },
        style,
      ]}
    >
      <PixelText
        size="badge"
        color={selected ? Colors.textInverse : Colors.textSecondary}
      >
        {label}
      </PixelText>
    </TouchableOpacity>
  );
}

interface FilterChipRowProps {
  chips: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  style?: ViewStyle;
}

export function FilterChipRow({ chips, selectedId, onSelect, style }: FilterChipRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs }, style]}
    >
      {chips.map((chip) => (
        <FilterChip
          key={chip.id}
          label={chip.label}
          selected={selectedId === chip.id}
          onPress={() => onSelect(chip.id)}
        />
      ))}
    </ScrollView>
  );
}
