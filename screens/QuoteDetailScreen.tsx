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
import { PixelText, Card, NeonButton } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteP = RouteProp<RootStackParamList, 'QuoteDetail'>;

interface DealerQuote {
  id: string;
  dealerName: string;
  region: string;
  rating: number;
  reviewCount: number;
  devicePrice: number;
  monthlyFee: number;
  subsidy: number;
  total24m: number;
  isBest: boolean;
}

const MOCK_REQUEST = {
  id: '1',
  deviceName: 'Galaxy S25 Ultra',
  storage: '256GB',
  color: '티타늄 블랙',
  carrier: 'SKT',
  planType: '5G 무제한',
  createdAt: '2026.02.28',
  status: 'open' as const,
  quoteCount: 3,
};

const MOCK_QUOTES: DealerQuote[] = [
  {
    id: 'q1',
    dealerName: '명동 스마트폰 성지',
    region: '서울 중구',
    rating: 4.8,
    reviewCount: 234,
    devicePrice: 890000,
    monthlyFee: 89000,
    subsidy: 150000,
    total24m: 2276000,
    isBest: true,
  },
  {
    id: 'q2',
    dealerName: '강남 폰 센터',
    region: '서울 강남',
    rating: 4.5,
    reviewCount: 112,
    devicePrice: 950000,
    monthlyFee: 89000,
    subsidy: 100000,
    total24m: 2386000,
    isBest: false,
  },
  {
    id: 'q3',
    dealerName: '홍대 모바일 샵',
    region: '서울 마포',
    rating: 4.2,
    reviewCount: 67,
    devicePrice: 920000,
    monthlyFee: 95000,
    subsidy: 120000,
    total24m: 2400000,
    isBest: false,
  },
];

const STATUS_CONFIG = {
  open: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  completed: { label: '견적완료', color: Colors.dealGold, bg: '#FFD93D22' },
  expired: { label: '만료', color: Colors.textMuted, bg: '#33333333' },
};

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function QuoteDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteP>();

  const request = MOCK_REQUEST;
  const quotes = MOCK_QUOTES;
  const statusCfg = STATUS_CONFIG[request.status];

  const renderQuote = ({ item, index }: { item: DealerQuote; index: number }) => (
    <View style={[styles.quoteCard, item.isBest && styles.quoteCardBest]}>
      {item.isBest && (
        <View style={styles.bestLabel}>
          <PixelText size="badge" color={Colors.textInverse}>BEST</PixelText>
        </View>
      )}
      <View style={styles.quoteTop}>
        <View style={styles.dealerInfo}>
          <Text style={styles.dealerName}>{item.dealerName}</Text>
          <Text style={styles.dealerRegion}>{item.region}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount}개 리뷰)</Text>
          </View>
        </View>
        <View style={styles.priceColumn}>
          <PixelText size="section" color={Colors.dropGreen}>
            ₩{formatPrice(item.total24m)}
          </PixelText>
          <Text style={styles.priceNote}>24개월 총합</Text>
        </View>
      </View>

      <View style={styles.quotePriceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>기기값</Text>
          <Text style={styles.priceValue}>₩{formatPrice(item.devicePrice)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>월 요금</Text>
          <Text style={styles.priceValue}>₩{formatPrice(item.monthlyFee)}/월</Text>
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
            dealerName: item.dealerName,
          })
        }
        size="md"
        style={styles.chatButton}
      />
    </View>
  );

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
                <Text style={styles.requestDeviceName}>{request.deviceName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.color }]}>
                  <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                </View>
              </View>
              <View style={styles.requestDetailGrid}>
                {[
                  { label: '용량', value: request.storage },
                  { label: '색상', value: request.color },
                  { label: '통신사', value: request.carrier },
                  { label: '요금제', value: request.planType },
                ].map((row) => (
                  <View key={row.label} style={styles.requestDetailRow}>
                    <PixelText size="badge" color={Colors.textMuted}>{row.label}</PixelText>
                    <Text style={styles.requestDetailValue}>{row.value}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.requestDate}>요청일: {request.createdAt}</Text>
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
