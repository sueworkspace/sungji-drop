import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText, FilterChip, NeonButton } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type QuoteStatus = 'open' | 'completed' | 'accepted' | 'expired';

interface MockQuoteRequest {
  id: string;
  deviceName: string;
  storage: string;
  carrier: string;
  status: QuoteStatus;
  quoteCount: number;
  bestPrice: number;
  createdAt: string;
}

const MOCK_QUOTES: MockQuoteRequest[] = [
  {
    id: '1',
    deviceName: 'Galaxy S25 Ultra',
    storage: '256GB',
    carrier: 'SKT',
    status: 'open',
    quoteCount: 3,
    bestPrice: 890000,
    createdAt: '2시간 전',
  },
  {
    id: '2',
    deviceName: 'iPhone 16 Pro',
    storage: '128GB',
    carrier: 'KT',
    status: 'completed',
    quoteCount: 7,
    bestPrice: 1050000,
    createdAt: '1일 전',
  },
  {
    id: '3',
    deviceName: 'Galaxy Z Fold 6',
    storage: '512GB',
    carrier: 'LG U+',
    status: 'accepted',
    quoteCount: 2,
    bestPrice: 1320000,
    createdAt: '3일 전',
  },
  {
    id: '4',
    deviceName: 'Galaxy A55',
    storage: '128GB',
    carrier: 'SKT',
    status: 'expired',
    quoteCount: 0,
    bestPrice: 0,
    createdAt: '5일 전',
  },
];

const FILTERS: Array<{ key: QuoteStatus | '전체'; label: string }> = [
  { key: '전체', label: '전체' },
  { key: 'open', label: '입찰중' },
  { key: 'completed', label: '견적완료' },
  { key: 'accepted', label: '수락됨' },
];

const STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bg: string }> = {
  open: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  completed: { label: '견적완료', color: Colors.dealGold, bg: '#FFD93D22' },
  accepted: { label: '수락됨', color: Colors.saveGreen, bg: '#6BCB7722' },
  expired: { label: '만료', color: Colors.textMuted, bg: '#33333344' },
};

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function QuotesScreen() {
  const navigation = useNavigation<Nav>();
  const [activeFilter, setActiveFilter] = useState<QuoteStatus | '전체'>('전체');

  const filtered =
    activeFilter === '전체'
      ? MOCK_QUOTES
      : MOCK_QUOTES.filter((q) => q.status === activeFilter);

  const renderItem = ({ item }: { item: MockQuoteRequest }) => {
    const statusCfg = STATUS_CONFIG[item.status];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('QuoteDetail', { requestId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.cardTop}>
          <Text style={styles.deviceName}>{item.deviceName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.color }]}>
            <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>
        <Text style={styles.deviceSub}>
          {item.storage} · {item.carrier}
        </Text>
        <View style={styles.cardBottom}>
          <View style={styles.quoteCountBox}>
            <PixelText size="badge" color={Colors.dropGreen}>{item.quoteCount}개</PixelText>
            <Text style={styles.quoteCountLabel}> 견적 수신</Text>
          </View>
          {item.bestPrice > 0 ? (
            <View style={styles.bestPriceBox}>
              <Text style={styles.bestPriceLabel}>최저</Text>
              <Text style={styles.bestPriceValue}>₩{formatPrice(item.bestPrice)}</Text>
            </View>
          ) : (
            <Text style={styles.noPriceText}>견적 없음</Text>
          )}
        </View>
        <Text style={styles.createdAt}>{item.createdAt}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PixelText size="section" color={Colors.dropGreen}>견적함</PixelText>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <FilterChip
            key={f.key}
            label={f.label}
            selected={activeFilter === f.key}
            onPress={() => setActiveFilter(f.key as QuoteStatus | '전체')}
          />
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PixelText size="label" color={Colors.textMuted}>아직 받은 견적이 없습니다</PixelText>
          <NeonButton
            label="견적 요청하기"
            onPress={() => navigation.navigate('QuoteRequest')}
            size="md"
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  list: { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, paddingBottom: 30 },

  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceName: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 2,
  },
  statusText: { fontFamily: 'PressStart2P', fontSize: 6 },
  deviceSub: { fontFamily: 'NotoSansKR', fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.sm },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    paddingTop: Spacing.sm,
    marginBottom: 4,
  },
  quoteCountBox: { flexDirection: 'row', alignItems: 'center' },
  quoteCountLabel: { fontFamily: 'NotoSansKR', fontSize: 12, color: Colors.textSecondary },
  bestPriceBox: { alignItems: 'flex-end' },
  bestPriceLabel: { fontFamily: 'PressStart2P', fontSize: 6, color: Colors.textMuted },
  bestPriceValue: { fontFamily: 'PressStart2P', fontSize: 10, color: Colors.dropGreen },
  noPriceText: { fontFamily: 'NotoSansKR', fontSize: 12, color: Colors.textMuted },
  createdAt: { fontFamily: 'NotoSansKR', fontSize: 11, color: Colors.textMuted, textAlign: 'right' },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  emptyButton: { marginTop: Spacing.md },
});
