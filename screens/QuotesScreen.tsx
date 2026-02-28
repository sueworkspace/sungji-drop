import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText, FilterChip, NeonButton, LoadingOverlay, ErrorBox } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useMyQuoteRequests, QuoteRequestWithDevice } from '../src/hooks/useMyQuoteRequests';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type FilterKey = '전체' | '입찰중' | '견적완료' | '수락됨';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: '전체', label: '전체' },
  { key: '입찰중', label: '입찰중' },
  { key: '견적완료', label: '견적완료' },
  { key: '수락됨', label: '수락됨' },
];

type QuoteStatus = 'open' | 'quoted' | 'accepted' | 'completed' | 'expired' | 'cancelled';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  quoted: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  completed: { label: '견적완료', color: Colors.dealGold, bg: '#FFD93D22' },
  accepted: { label: '수락됨', color: Colors.saveGreen, bg: '#6BCB7722' },
  expired: { label: '만료', color: Colors.textMuted, bg: '#33333344' },
  cancelled: { label: '취소', color: Colors.textMuted, bg: '#33333344' },
};

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;

  const months = Math.floor(days / 30);
  return `${months}개월 전`;
}

function matchesFilter(status: string, filter: FilterKey): boolean {
  if (filter === '전체') return true;
  if (filter === '입찰중') return status === 'open' || status === 'quoted';
  if (filter === '견적완료') return status === 'completed';
  if (filter === '수락됨') return status === 'accepted';
  return false;
}

function getBestPrice(item: QuoteRequestWithDevice): number {
  if (!item.quotes || item.quotes.length === 0) return 0;
  return Math.min(...item.quotes.map((q) => q.total_cost_24m));
}

export default function QuotesScreen() {
  const navigation = useNavigation<Nav>();
  const { requests, isLoading, error, refetch } = useMyQuoteRequests();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('전체');

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filtered = requests.filter((r) => matchesFilter(r.status, activeFilter));

  const renderItem = ({ item }: { item: QuoteRequestWithDevice }) => {
    const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.expired;
    const bestPrice = getBestPrice(item);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('QuoteDetail', { requestId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.cardTop}>
          <Text style={styles.deviceName}>{item.devices?.name ?? '기기 정보 없음'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.color }]}>
            <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>
        <Text style={styles.deviceSub}>
          {item.storage} · {item.carrier}
        </Text>
        <View style={styles.cardBottom}>
          <View style={styles.quoteCountBox}>
            <PixelText size="badge" color={Colors.dropGreen}>{item.quote_count}개</PixelText>
            <Text style={styles.quoteCountLabel}> 견적 수신</Text>
          </View>
          {bestPrice > 0 ? (
            <View style={styles.bestPriceBox}>
              <Text style={styles.bestPriceLabel}>최저</Text>
              <Text style={styles.bestPriceValue}>₩{formatPrice(bestPrice)}</Text>
            </View>
          ) : (
            <Text style={styles.noPriceText}>견적 없음</Text>
          )}
        </View>
        <Text style={styles.createdAt}>{formatRelativeTime(item.created_at)}</Text>
      </TouchableOpacity>
    );
  };

  // Full-screen loading on first load
  if (isLoading && requests.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PixelText size="section" color={Colors.dropGreen}>견적함</PixelText>
        </View>
        <LoadingOverlay />
      </SafeAreaView>
    );
  }

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
            onPress={() => setActiveFilter(f.key)}
          />
        ))}
      </View>

      {error ? (
        <ErrorBox message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.dropGreen}
              colors={[Colors.dropGreen]}
            />
          }
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
