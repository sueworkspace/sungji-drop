import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText, NeonButton, ScanlineOverlay, LoadingOverlay, ErrorBox } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useMyQuoteRequests, QuoteRequestWithDevice } from '../src/hooks/useMyQuoteRequests';
import { useDevices } from '../src/hooks/useDevices';
import { useNotifications } from '../src/hooks/useNotifications';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type QuoteStatus = 'open' | 'quoted' | 'accepted' | 'completed' | 'expired' | 'cancelled';

// ─── Helpers ────────────────────────────────────────────────────────────────────

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

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR');
}

// ─── Status config ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  quoted: { label: '입찰중', color: Colors.dropGreen, bg: '#00FF8822' },
  completed: { label: '견적완료', color: Colors.dealGold, bg: '#FFD93D22' },
  accepted: { label: '수락됨', color: Colors.saveGreen, bg: '#6BCB7722' },
  expired: { label: '만료', color: Colors.textMuted, bg: '#33333333' },
  cancelled: { label: '취소', color: Colors.textMuted, bg: '#33333333' },
};

// ─── Component ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { requests, isLoading: reqLoading, error: reqError, refetch } = useMyQuoteRequests();
  const { devices } = useDevices();
  const { unreadCount } = useNotifications();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderRequestCard = ({ item }: { item: QuoteRequestWithDevice }) => {
    const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.expired;
    const isOpen = item.status === 'open' || item.status === 'quoted';
    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => navigation.navigate('QuoteDetail', { requestId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.requestCardTop}>
          <View style={styles.deviceNameRow}>
            <Text style={styles.deviceName}>{item.devices?.name ?? '기기 정보 없음'}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.color }]}>
              {isOpen && (
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
            <Text style={styles.quoteCountNum}>{item.quote_count}</Text>개 견적
          </Text>
          <Text style={styles.createdAt}>{formatRelativeTime(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Show full-screen loading only on first load
  if (reqLoading && requests.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScanlineOverlay />
        <LoadingOverlay />
      </SafeAreaView>
    );
  }

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
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dropGreen}
            colors={[Colors.dropGreen]}
          />
        }
      >
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
          <TouchableOpacity onPress={() => navigation.navigate('Tabs', { screen: 'Quotes' } as any)}>
            <PixelText size="badge" color={Colors.textMuted}>전체보기 →</PixelText>
          </TouchableOpacity>
        </View>

        {reqError ? (
          <ErrorBox message={reqError} onRetry={refetch} />
        ) : requests.length === 0 ? (
          <View style={styles.emptyBox}>
            <PixelText size="label" color={Colors.textMuted}>아직 견적 요청이 없습니다</PixelText>
            <Text style={styles.emptySubtext}>첫 견적을 요청하고 최저가를 받아보세요!</Text>
            <NeonButton
              label="견적 요청하기"
              onPress={() => navigation.navigate('QuoteRequest')}
              size="md"
              style={styles.emptyCta}
            />
          </View>
        ) : (
          <FlatList
            data={requests}
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
          {devices.slice(0, 5).map((device) => (
            <TouchableOpacity key={device.id} style={styles.popularCard} activeOpacity={0.75}>
              <View style={styles.popularIconPlaceholder}>
                <Text style={styles.popularIconText}>📱</Text>
              </View>
              <Text style={styles.popularDeviceName} numberOfLines={2}>
                {device.name}
              </Text>
              <Text style={styles.popularBrand}>
                {device.brand === 'samsung' ? '삼성' : device.brand === 'apple' ? '애플' : device.brand === 'google' ? '구글' : device.brand}
              </Text>
              <Text style={styles.popularPrice}>₩{formatPrice(device.original_price)}</Text>
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
    gap: Spacing.sm,
  },
  emptySubtext: {
    fontFamily: 'NotoSansKR',
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  emptyCta: {
    marginTop: Spacing.xs,
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
  popularPrice: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    color: Colors.dropGreen,
    marginTop: 4,
  },
});
