import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';
import { plans, formatPrice } from '../src/data/mock';

type Carrier = 'SK' | 'KT' | 'LGU' | 'all';

const CARRIERS: { id: Carrier; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'SK', label: 'SK' },
  { id: 'KT', label: 'KT' },
  { id: 'LGU', label: 'LG U+' },
];

export default function DisassembleScreen() {
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedCarrier === 'all'
    ? plans
    : plans.filter(p => p.carrier === selectedCarrier);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PixelText size="section" color={Colors.dropGreen}>⚡ 요금제 해체</PixelText>
        <PixelText size="badge" color={Colors.textMuted} style={styles.subtitle}>
          통신사가 숨긴 가격을 해체합니다
        </PixelText>
      </View>

      {/* Carrier filter */}
      <View style={styles.carrierRow}>
        {CARRIERS.map(c => (
          <TouchableOpacity
            key={c.id}
            onPress={() => setSelectedCarrier(c.id)}
            style={[styles.carrierChip, selectedCarrier === c.id && styles.carrierChipActive]}
          >
            <PixelText
              size="badge"
              color={selectedCarrier === c.id ? Colors.dropGreen : Colors.textMuted}
            >
              {c.label}
            </PixelText>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(plan => {
          const expanded = expandedId === plan.id;
          const monthlyTotal = plan.monthlyFee * 24;
          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.8}
              onPress={() => setExpandedId(expanded ? null : plan.id)}
              style={[styles.planCard, expanded && styles.planCardExpanded]}
            >
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.carrier}>{plan.carrier}</Text>
                  <Text style={styles.planName}>{plan.name}</Text>
                </View>
                <View style={styles.planFee}>
                  <PixelText size="cardPrice" color={Colors.dropGreen}>
                    {formatPrice(plan.monthlyFee)}원
                  </PixelText>
                  <Text style={styles.perMonth}>/월</Text>
                </View>
              </View>

              {expanded && (
                <View style={styles.planDetail}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>데이터</Text>
                    <Text style={styles.detailValue}>{plan.data}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>통화</Text>
                    <Text style={styles.detailValue}>{plan.call}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>공시지원금</Text>
                    <PixelText size="badge" color={Colors.alertRed}>
                      -{formatPrice(plan.subsidy)}원
                    </PixelText>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>선택약정(25%)</Text>
                    <PixelText size="badge" color={Colors.saveGreen}>
                      -{formatPrice(plan.selectDiscount)}원/월
                    </PixelText>
                  </View>
                  <View style={[styles.detailRow, styles.totalRow]}>
                    <PixelText size="badge" color={Colors.textSecondary}>24개월 총액</PixelText>
                    <PixelText size="label" color={Colors.dealGold}>
                      {formatPrice(monthlyTotal)}원
                    </PixelText>
                  </View>
                </View>
              )}

              <PixelText size="badge" color={Colors.textMuted} style={styles.expandHint}>
                {expanded ? '▲ 닫기' : '▼ 해체 보기'}
              </PixelText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  subtitle: { marginTop: Spacing.xs },
  carrierRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  carrierChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  carrierChipActive: { borderColor: Colors.dropGreen, backgroundColor: Colors.greenOverlay },
  list: { padding: Spacing.base, paddingBottom: Spacing.xl },
  planCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  planCardExpanded: { borderColor: Colors.dropGreen, backgroundColor: Colors.greenOverlay },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planInfo: { flex: 1 },
  carrier: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.dropGreen, marginBottom: 4 },
  planName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  planFee: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  perMonth: { fontSize: 10, color: Colors.textMuted },
  planDetail: { marginTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: { fontSize: 12, color: Colors.textMuted },
  detailValue: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 6, marginTop: 2 },
  expandHint: { marginTop: Spacing.sm, textAlign: 'right' },
});
