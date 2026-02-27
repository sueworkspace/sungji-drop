import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { deals, getDevice, getStore, formatPrice, priceHistory, plans, reviews } from '../src/data/mock';
import { RootStackParamList } from '../navigation/RootNavigator';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';

type Route = RouteProp<RootStackParamList, 'DealDetail'>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DealDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const [purchaseMode, setPurchaseMode] = useState<'unlocked' | 'contract'>('unlocked');

  const deal = deals.find(d => d.id === route.params.dealId);
  const device = deal ? getDevice(deal.deviceId) : null;
  const store = deal ? getStore(deal.storeId) : null;
  if (!deal || !device || !store) return null;

  const history = priceHistory[deal.deviceId] || [];
  const savings = deal.originalPrice - deal.price;
  const storeReviews = reviews.filter(r => r.storeId === store.id);
  const carrierPlans = plans.filter(p => ['SK', 'KT', 'LGU'].includes(p.carrier));

  // Chart
  const chartW = SCREEN_WIDTH - 48;
  const chartH = 150;
  const prices = history.map(h => h.price);
  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.02;
  const points = history.map((h, i) => {
    const x = (i / (history.length - 1)) * chartW;
    const y = chartH - ((h.price - minP) / (maxP - minP)) * chartH;
    return `${x},${y}`;
  }).join(' ');
  const minIdx = prices.indexOf(Math.min(...prices));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← 뒤로</Text>
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity><Text style={styles.actionIcon}>📤</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.actionIcon}>★</Text></TouchableOpacity>
          </View>
        </View>

        {/* Device Pixel Art Placeholder */}
        <View style={styles.imageBox}>
          <Text style={styles.pixelPhone}>📱</Text>
          <Text style={styles.imageLabel}>PIXEL ART</Text>
        </View>

        {/* Device Info */}
        <View style={styles.section}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceMeta}>{device.storage}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {device.colors.map(c => (
              <View key={c} style={styles.colorChip}>
                <Text style={styles.colorChipText}>{c}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Price */}
        <View style={styles.priceSection}>
          <Text style={styles.currentPrice}>₩{formatPrice(deal.price)}</Text>
          <Text style={styles.originalPrice}>₩{formatPrice(deal.originalPrice)}</Text>
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>{formatPrice(savings)}원 절약!</Text>
          </View>
        </View>

        {/* Price Chart */}
        {history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>● PRICE HISTORY</Text>
            <View style={styles.chartBox}>
              <Svg width={chartW} height={chartH + 20}>
                <Polyline
                  points={points}
                  fill="none"
                  stroke={Colors.dropGreen}
                  strokeWidth="2"
                />
                {history.map((h, i) => {
                  const x = (i / (history.length - 1)) * chartW;
                  const y = chartH - ((h.price - minP) / (maxP - minP)) * chartH;
                  return (
                    <React.Fragment key={i}>
                      <Circle cx={x} cy={y} r={i === minIdx ? 5 : 3}
                        fill={i === minIdx ? Colors.dealGold : Colors.dropGreen} />
                      {i % 2 === 0 && (
                        <SvgText x={x} y={chartH + 14} fontSize="8" fill="#666" textAnchor="middle">
                          {h.date}
                        </SvgText>
                      )}
                    </React.Fragment>
                  );
                })}
              </Svg>
            </View>
          </View>
        )}

        {/* Store Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>● STORE INFO</Text>
          <View style={styles.storeCard}>
            <View style={styles.storeHeader}>
              <Text style={styles.storeName}>{store.name}</Text>
              {store.verified && <Text style={styles.verifiedBadge}>✓ 인증</Text>}
            </View>
            <Text style={styles.storeInfo}>{store.address}</Text>
            <Text style={styles.storeInfo}>영업시간: {store.openHours}</Text>
            <Text style={[styles.storeInfo, { color: Colors.saveGreen }]}>영업중</Text>
            <View style={styles.storeRating}>
              <Text style={styles.ratingText}>★ {store.rating}</Text>
              <Text style={styles.reviewCount}>리뷰 {store.reviewCount}개</Text>
            </View>
            {storeReviews.length > 0 && (
              <View style={styles.reviewPreview}>
                <Text style={styles.reviewUser}>{storeReviews[0].userName}</Text>
                <Text style={styles.reviewText} numberOfLines={2}>{storeReviews[0].text}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Plan Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>● PLAN COMPARE</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggle, purchaseMode === 'unlocked' && styles.toggleActive]}
              onPress={() => setPurchaseMode('unlocked')}
            >
              <Text style={[styles.toggleText, purchaseMode === 'unlocked' && styles.toggleTextActive]}>
                자급제 구매
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggle, purchaseMode === 'contract' && styles.toggleActive]}
              onPress={() => setPurchaseMode('contract')}
            >
              <Text style={[styles.toggleText, purchaseMode === 'contract' && styles.toggleTextActive]}>
                약정 구매
              </Text>
            </TouchableOpacity>
          </View>

          {purchaseMode === 'unlocked' ? (
            <View style={styles.planCard}>
              <Text style={styles.planCardTitle}>단말기 가격</Text>
              <Text style={styles.planCardPrice}>₩{formatPrice(deal.price)}</Text>
              <Text style={styles.planCardHint}>+ 알뜰폰 요금제 추천 →</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(['SK', 'KT', 'LGU'] as const).map((carrier, idx) => {
                const plan = plans.find(p => p.carrier === carrier && p.monthlyFee >= 75000);
                if (!plan) return null;
                const monthly = plan.monthlyFee + Math.round((deal.price - plan.subsidy) / 24);
                const total = monthly * 24;
                const isBest = idx === 0;
                return (
                  <View key={carrier} style={[styles.planCard, styles.planCardHoriz, isBest && styles.planCardBest]}>
                    {isBest && <Text style={styles.bestBadge}>💚 최적</Text>}
                    <Text style={styles.planCarrier}>{carrier}</Text>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planSub}>공시지원금: {formatPrice(plan.subsidy)}원</Text>
                    <Text style={styles.planMonthly}>월 {formatPrice(monthly)}원</Text>
                    <Text style={styles.planTotal}>24개월 총 {formatPrice(total)}원</Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.callBtn}>
          <Text style={styles.callBtnText}>📞 매장 전화</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.visitBtn}>
          <Text style={styles.visitBtnText}>🚀 바로 방문 예약</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  backBtn: { fontFamily: 'PressStart2P', fontSize: 9, color: Colors.dropGreen },
  topActions: { flexDirection: 'row', gap: 16 },
  actionIcon: { fontSize: 20 },

  imageBox: {
    height: 200, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.card, marginHorizontal: Spacing.base,
    borderWidth: 1, borderColor: Colors.border,
  },
  pixelPhone: { fontSize: 80 },
  imageLabel: { fontFamily: 'PressStart2P', fontSize: 7, color: '#555', marginTop: 8 },

  section: { paddingHorizontal: Spacing.base, marginTop: Spacing.lg },
  sectionTitle: { fontFamily: 'PressStart2P', fontSize: 9, color: Colors.dropGreen, marginBottom: 12 },

  deviceName: { fontSize: 22, fontWeight: '900', color: '#fff' },
  deviceMeta: { fontSize: 14, color: '#888', marginTop: 4 },
  colorChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    marginRight: 8,
  },
  colorChipText: { fontSize: 12, color: '#aaa' },

  priceSection: {
    paddingHorizontal: Spacing.base, marginTop: Spacing.lg,
    alignItems: 'center',
  },
  currentPrice: {
    fontFamily: 'PressStart2P', fontSize: 24, color: Colors.dropGreen,
    textShadowColor: '#00FF8866', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12,
  },
  originalPrice: {
    fontSize: 14, color: '#555', textDecorationLine: 'line-through', marginTop: 4,
  },
  savingsBadge: {
    backgroundColor: '#00FF8822', borderWidth: 1, borderColor: Colors.dropGreen,
    paddingHorizontal: 12, paddingVertical: 6, marginTop: 8,
  },
  savingsText: { fontFamily: 'PressStart2P', fontSize: 8, color: Colors.saveGreen },

  chartBox: { paddingVertical: 10 },

  storeCard: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    padding: 16,
  },
  storeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  storeName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  verifiedBadge: {
    fontFamily: 'PressStart2P', fontSize: 6, color: Colors.dropGreen,
    backgroundColor: '#00FF8822', paddingHorizontal: 6, paddingVertical: 3,
    borderWidth: 1, borderColor: Colors.dropGreen,
  },
  storeInfo: { fontSize: 12, color: '#888', marginBottom: 2 },
  storeRating: { flexDirection: 'row', gap: 8, marginTop: 8 },
  ratingText: { fontFamily: 'PressStart2P', fontSize: 9, color: Colors.dealGold },
  reviewCount: { fontSize: 12, color: '#888' },
  reviewPreview: {
    marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#222',
  },
  reviewUser: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.dropGreen, marginBottom: 4 },
  reviewText: { fontSize: 12, color: '#aaa', lineHeight: 18 },

  toggleRow: { flexDirection: 'row', gap: 0, marginBottom: 12 },
  toggle: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  toggleActive: { backgroundColor: '#00FF8822', borderColor: Colors.dropGreen },
  toggleText: { fontFamily: 'PressStart2P', fontSize: 8, color: '#666' },
  toggleTextActive: { color: Colors.dropGreen },

  planCard: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    padding: 16, marginBottom: 8,
  },
  planCardHoriz: { width: 200, marginRight: 8 },
  planCardBest: { borderColor: Colors.dropGreen, backgroundColor: '#00FF8808' },
  bestBadge: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.dropGreen, marginBottom: 6 },
  planCardTitle: { fontFamily: 'PressStart2P', fontSize: 9, color: '#aaa', marginBottom: 8 },
  planCardPrice: { fontFamily: 'PressStart2P', fontSize: 18, color: Colors.dropGreen },
  planCardHint: { fontSize: 12, color: Colors.dropGreen, marginTop: 8 },
  planCarrier: { fontFamily: 'PressStart2P', fontSize: 10, color: Colors.dropGreen, marginBottom: 4 },
  planName: { fontSize: 13, color: '#ddd', fontWeight: '700', marginBottom: 6 },
  planSub: { fontSize: 11, color: '#888', marginBottom: 4 },
  planMonthly: { fontFamily: 'PressStart2P', fontSize: 10, color: '#fff', marginTop: 6 },
  planTotal: { fontSize: 11, color: Colors.alertRed, marginTop: 4 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 8,
    paddingHorizontal: Spacing.base, paddingVertical: 12, paddingBottom: 30,
    backgroundColor: Colors.bg, borderTopWidth: 1, borderTopColor: '#1a1a2e',
  },
  callBtn: {
    flex: 1, paddingVertical: 14, alignItems: 'center',
    borderWidth: 2, borderColor: '#555',
  },
  callBtnText: { fontFamily: 'PressStart2P', fontSize: 8, color: '#aaa' },
  visitBtn: {
    flex: 2, paddingVertical: 14, alignItems: 'center',
    backgroundColor: Colors.dropGreen,
    shadowColor: Colors.dropGreen, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 8,
  },
  visitBtnText: { fontFamily: 'PressStart2P', fontSize: 9, color: Colors.bg },
});
