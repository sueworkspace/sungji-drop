import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText, NeonButton, LoadingOverlay, ErrorBox } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useQuoteDetail, QuoteWithDealer } from '../src/hooks/useQuoteDetail';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteP = RouteProp<RootStackParamList, 'QuoteDetail'>;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  quoted: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  completed: { label: '견적완료', color: Colors.dealGold, bg: '#FFD93D22' },
  accepted: { label: '수락됨', color: Colors.saveGreen, bg: '#6BCB7722' },
  expired: { label: '만료', color: Colors.textMuted, bg: '#33333333' },
  cancelled: { label: '취소', color: Colors.textMuted, bg: '#33333333' },
};

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export default function QuoteDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteP>();
  const { request, quotes, isLoading, error, refetch } = useQuoteDetail(route.params?.requestId);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
          </TouchableOpacity>
          <PixelText size="section" color={Colors.dropGreen}>견적 상세</PixelText>
          <View style={{ width: 24 }} />
        </View>
        <LoadingOverlay />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
          </TouchableOpacity>
          <PixelText size="section" color={Colors.dropGreen}>견적 상세</PixelText>
          <View style={{ width: 24 }} />
        </View>
        <ErrorBox message={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // Null guard
  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
          </TouchableOpacity>
          <PixelText size="section" color={Colors.dropGreen}>견적 상세</PixelText>
          <View style={{ width: 24 }} />
        </View>
        <ErrorBox message="견적 요청을 찾을 수 없습니다." />
      </SafeAreaView>
    );
  }

  const statusCfg = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.expired;

  const renderQuote = ({ item, index }: { item: QuoteWithDealer; index: number }) => {
    const isBest = index === 0; // Already sorted by total_cost_24m ascending from hook
    return (
      <View style={[styles.quoteCard, isBest && styles.quoteCardBest]}>
        {isBest && (
          <View style={styles.bestLabel}>
            <PixelText size="badge" color={Colors.textInverse}>BEST</PixelText>
          </View>
        )}
        <View style={styles.quoteTop}>
          <View style={styles.dealerInfo}>
            <Text style={styles.dealerName}>{item.dealers?.store_name ?? '딜러 정보 없음'}</Text>
            <Text style={styles.dealerRegion}>{item.dealers?.region ?? ''}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>★ {item.dealers?.rating?.toFixed(1) ?? '0.0'}</Text>
              <Text style={styles.reviewCount}>({item.dealers?.review_count ?? 0}개 리뷰)</Text>
            </View>
          </View>
          <View style={styles.priceColumn}>
            <PixelText size="section" color={Colors.dropGreen}>
              ₩{formatPrice(item.total_cost_24m)}
            </PixelText>
            <Text style={styles.priceNote}>24개월 총합</Text>
          </View>
        </View>

        <View style={styles.quotePriceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>기기값</Text>
            <Text style={styles.priceValue}>₩{formatPrice(item.device_price)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>월 요금</Text>
            <Text style={styles.priceValue}>₩{formatPrice(item.monthly_fee)}/월</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>공시지원금</Text>
            <Text style={[styles.priceValue, { color: Colors.dropGreen }]}>
              -₩{formatPrice(item.subsidy)}
            </Text>
          </View>
        </View>

        <NeonButton
          label="채팅하기 ◈"
          onPress={() =>
            navigation.navigate('ChatRoom', {
              roomId: item.id,
              dealerName: item.dealers?.store_name ?? '딜러',
            })
          }
          size="md"
          style={styles.chatButton}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
        </TouchableOpacity>
        <PixelText size="section" color={Colors.dropGreen}>견적 상세</PixelText>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Request Info Card */}
            <View style={styles.requestCard}>
              <View style={styles.requestCardTop}>
                <Text style={styles.requestDeviceName}>{request.devices?.name ?? '기기 정보 없음'}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.color }]}>
                  <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                </View>
              </View>
              <View style={styles.requestDetailGrid}>
                {[
                  { label: '용량', value: request.storage },
                  { label: '색상', value: request.color },
                  { label: '통신사', value: request.carrier },
                  { label: '요금제', value: request.plan_type },
                ].map((row) => (
                  <View key={row.label} style={styles.requestDetailRow}>
                    <PixelText size="badge" color={Colors.textMuted}>{row.label}</PixelText>
                    <Text style={styles.requestDetailValue}>{row.value}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.requestDate}>요청일: {formatDate(request.created_at)}</Text>
            </View>

            <View style={styles.quotesHeader}>
              <PixelText size="section" color={Colors.dropGreen}>받은 견적</PixelText>
              <PixelText size="badge" color={Colors.textMuted}>{quotes.length}개</PixelText>
            </View>

            {quotes.length === 0 && (
              <View style={styles.emptyQuotes}>
                <Text style={styles.emptyQuotesText}>
                  아직 견적이 도착하지 않았습니다.{'\n'}
                  대리점에서 견적을 보내면 알려드릴게요!
                </Text>
              </View>
            )}
          </>
        }
        renderItem={renderQuote}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  listContent: { paddingHorizontal: Spacing.base, paddingBottom: 30 },

  requestCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderGreenMid,
    padding: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  requestCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  requestDeviceName: { fontFamily: 'NotoSansKR-Bold', fontSize: 16, color: Colors.textPrimary, flex: 1 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 2,
  },
  statusText: { fontFamily: 'PressStart2P', fontSize: 6 },
  requestDetailGrid: { gap: Spacing.xs, marginBottom: Spacing.sm },
  requestDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  requestDetailValue: { fontFamily: 'NotoSansKR', fontSize: 13, color: Colors.textSecondary },
  requestDate: { fontFamily: 'NotoSansKR', fontSize: 11, color: Colors.textMuted, textAlign: 'right' },

  quotesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  quoteCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  quoteCardBest: {
    borderColor: Colors.dealGold,
    backgroundColor: '#FFD93D08',
  },
  bestLabel: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.dealGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quoteTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  dealerInfo: { flex: 1 },
  dealerName: { fontFamily: 'NotoSansKR-Bold', fontSize: 15, color: Colors.textPrimary, marginBottom: 2 },
  dealerRegion: { fontFamily: 'NotoSansKR', fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.dealGold },
  reviewCount: { fontFamily: 'NotoSansKR', fontSize: 11, color: Colors.textMuted },
  priceColumn: { alignItems: 'flex-end', paddingLeft: Spacing.sm },
  priceNote: { fontFamily: 'PressStart2P', fontSize: 6, color: Colors.textMuted, marginTop: 2 },

  quotePriceBreakdown: {
    backgroundColor: Colors.deepDark,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  priceLabel: { fontFamily: 'PressStart2P', fontSize: 6, color: Colors.textMuted },
  priceValue: { fontFamily: 'NotoSansKR-Bold', fontSize: 13, color: Colors.textSecondary },

  chatButton: { alignSelf: 'flex-end' },

  emptyQuotes: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  emptyQuotesText: {
    fontFamily: 'NotoSansKR',
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
