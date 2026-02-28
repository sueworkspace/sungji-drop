import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText, NeonButton, ScanlineOverlay } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useStore } from '../src/stores/useStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type QuoteStatus = 'open' | 'completed' | 'expired';

interface MockRequest {
  id: string;
  deviceName: string;
  storage: string;
  color: string;
  carrier: string;
  status: QuoteStatus;
  quoteCount: number;
  createdAt: string;
}

const MOCK_REQUESTS: MockRequest[] = [
  {
    id: '1',
    deviceName: 'Galaxy S25 Ultra',
    storage: '256GB',
    color: '티타늄 블랙',
    carrier: 'SKT',
    status: 'open',
    quoteCount: 3,
    createdAt: '2시간 전',
  },
  {
    id: '2',
    deviceName: 'iPhone 16 Pro',
    storage: '128GB',
    color: '내추럴 티타늄',
    carrier: 'KT',
    status: 'completed',
    quoteCount: 7,
    createdAt: '1일 전',
  },
  {
    id: '3',
    deviceName: 'Galaxy Z Fold 6',
    storage: '512GB',
    color: '네이비',
    carrier: 'LG U+',
    status: 'expired',
    quoteCount: 2,
    createdAt: '3일 전',
  },
];

const POPULAR_DEVICES = [
  { id: 'p1', name: 'Galaxy S25 Ultra', brand: '삼성', badge: 'HOT' },
  { id: 'p2', name: 'iPhone 16 Pro Max', brand: '애플', badge: 'NEW' },
  { id: 'p3', name: 'Galaxy Z Flip 6', brand: '삼성', badge: '' },
  { id: 'p4', name: 'iPhone 15', brand: '애플', badge: '' },
  { id: 'p5', name: 'Galaxy A55', brand: '삼성', badge: 'SALE' },
];

const STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bg: string }> = {
  open: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  completed: { label: '견적완료', color: Colors.dealGold, bg: '#FFD93D22' },
  expired: { label: '만료', color: Colors.textMuted, bg: '#33333333' },
};

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { unreadNotifications } = useStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const renderRequestCard = ({ item }: { item: MockRequest }) => {
    const statusCfg = STATUS_CONFIG[item.status];
    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => navigation.navigate('QuoteDetail', { requestId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.requestCardTop}>
          <View style={styles.deviceNameRow}>
            <Text style={styles.deviceName}>{item.deviceName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.color }]}>
              {item.status === 'open' && (
                <Animated.View style={[styles.pulseDot, { opacity: pulseAnim, backgroundColor: statusCfg.color }]} />
              )}
              <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
            </View>
          </View>
          <Text style={styles.deviceOptions}>
            {item.storage} · {item.color} · {item.carrier}
          </Text>
        </View>
        <View style={styles.requestCardBottom}>
          <Text style={styles.quoteCount}>
            <Text style={styles.quoteCountNum}>{item.quoteCount}</Text>개 견적
          </Text>
          <Text style={styles.createdAt}>{item.createdAt}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScanlineOverlay />

      {/* Header */}
      <View style={styles.header}>
        <PixelText size="section" color={Colors.dropGreen} style={styles.logoText}>
          성지DROP
        </PixelText>
        <TouchableOpacity
          style={styles.bellWrapper}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          {unreadNotifications > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaSubtitle}>성지급 최저가를 딜러에게 직접 받으세요</Text>
          <NeonButton
            label="견적 요청하기 ▼"
            onPress={() => navigation.navigate('QuoteRequest')}
            size="lg"
            style={styles.ctaButton}
          />
        </View>

        {/* My Quote Requests */}
        <View style={styles.sectionHeader}>
          <PixelText size="section" color={Colors.dropGreen}>내 견적 요청</PixelText>
          <TouchableOpacity>
            <PixelText size="badge" color={Colors.textMuted}>전체보기 →</PixelText>
          </TouchableOpacity>
        </View>

        {MOCK_REQUESTS.length === 0 ? (
          <View style={styles.emptyBox}>
            <PixelText size="label" color={Colors.textMuted}>아직 견적 요청이 없습니다</PixelText>
          </View>
        ) : (
          <FlatList
            data={MOCK_REQUESTS}
            keyExtractor={(item) => item.id}
            renderItem={renderRequestCard}
            scrollEnabled={false}
            contentContainerStyle={styles.requestList}
          />
        )}

        {/* Popular Devices */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
          <PixelText size="section" color={Colors.dropGreen}>인기 기기</PixelText>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularRow}
        >
          {POPULAR_DEVICES.map((device) => (
            <TouchableOpacity key={device.id} style={styles.popularCard} activeOpacity={0.75}>
              {device.badge !== '' && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>{device.badge}</Text>
                </View>
              )}
              <View style={styles.popularIconPlaceholder}>
                <Text style={styles.popularIconText}>📱</Text>
              </View>
              <Text style={styles.popularDeviceName} numberOfLines={2}>
                {device.name}
              </Text>
              <Text style={styles.popularBrand}>{device.brand}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
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
  logoText: {
    textShadowColor: Colors.dropGreenGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  bellWrapper: { position: 'relative', padding: 4 },
  bellIcon: { fontSize: 22 },
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.alertRed,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  notifBadgeText: { fontFamily: 'PressStart2P', fontSize: 6, color: '#fff' },

  ctaSection: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  ctaSubtitle: {
    fontFamily: 'NotoSansKR',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  ctaButton: { width: '100%' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },

  requestList: { paddingHorizontal: Spacing.base, gap: Spacing.sm },

  requestCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  requestCardTop: { marginBottom: Spacing.sm },
  deviceNameRow: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 2,
  },
  pulseDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'PressStart2P', fontSize: 6 },
  deviceOptions: {
    fontFamily: 'NotoSansKR',
    fontSize: 12,
    color: Colors.textMuted,
  },
  requestCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    paddingTop: Spacing.sm,
  },
  quoteCount: { fontFamily: 'NotoSansKR', fontSize: 12, color: Colors.textSecondary },
  quoteCountNum: { fontFamily: 'PressStart2P', fontSize: 11, color: Colors.dropGreen },
  createdAt: { fontFamily: 'NotoSansKR', fontSize: 11, color: Colors.textMuted },

  emptyBox: {
    margin: Spacing.base,
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },

  popularRow: { paddingHorizontal: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing.sm },
  popularCard: {
    width: 110,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    alignItems: 'center',
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.alertRed,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  popularBadgeText: { fontFamily: 'PressStart2P', fontSize: 5, color: '#fff' },
  popularIconPlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: Colors.deepDark,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  popularIconText: { fontSize: 28 },
  popularDeviceName: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 11,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  popularBrand: { fontFamily: 'NotoSansKR', fontSize: 10, color: Colors.textMuted },
});
