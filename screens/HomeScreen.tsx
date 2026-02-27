import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity,
  StyleSheet, Animated, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, CommonStyles } from '../constants';
import { deals, devices, stores, getDevice, getStore, formatPrice, dailyMissions } from '../src/data/mock';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS = ['전체', '삼성', '애플', '자급제', 'SK', 'KT', 'LG U+', '알뜰폰'];
const SORT_OPTIONS = ['할인율순', '가격순', '최신순', '인기순'];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [liveCount] = useState(deals.filter(d => d.isLive).length);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const sortedDeals = [...deals].sort((a, b) => b.discountRate - a.discountRate);

  const filteredDeals = sortedDeals.filter(deal => {
    if (selectedFilter === '전체') return true;
    const device = getDevice(deal.deviceId);
    if (!device) return false;
    if (selectedFilter === '삼성') return device.brand === 'samsung';
    if (selectedFilter === '애플') return device.brand === 'apple';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          성지<Text style={styles.logoGreen}>DROP</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Live Counter */}
      <View style={styles.liveRow}>
        <Animated.View style={[styles.liveDot, { opacity: blinkAnim }]} />
        <Text style={styles.liveText}>LIVE {liveCount}개 성지 드롭 중</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="기종, 지역, 통신사 검색..."
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setSelectedFilter(f)}
            style={[styles.filterChip, selectedFilter === f && styles.filterChipActive]}
          >
            <Text style={[
              styles.filterText,
              { color: selectedFilter === f ? Colors.dropGreen : Colors.textMuted },
            ]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text style={styles.sortText}>할인율순 ▼</Text>
      </View>

      {/* Deal List */}
      <FlatList
        data={filteredDeals}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingBottom: 20 }}
        renderItem={({ item, index }) => {
          const device = getDevice(item.deviceId);
          const store = getStore(item.storeId);
          if (!device || !store) return null;
          const rank = index + 1;
          const rankColor = rank === 1 ? Colors.dealGold : rank <= 3 ? '#C0C0C0' : '#555';

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('DealDetail', { dealId: item.id })}
              activeOpacity={0.7}
              style={[styles.dealCard, item.isHot && styles.dealCardHot]}
            >
              <View style={styles.rankBox}>
                <Text style={[styles.rankText, { color: rankColor }]}>{rank}</Text>
              </View>
              <View style={styles.dealInfo}>
                <View style={styles.dealNameRow}>
                  <Text style={styles.dealName}>{device.name}</Text>
                  <Text style={styles.dealStorage}>{device.storage}</Text>
                  {item.isHot && (
                    <Animated.Text style={[styles.hotBadge, { opacity: blinkAnim }]}>HOT</Animated.Text>
                  )}
                </View>
                <Text style={styles.dealLocation}>📍 {store.name}</Text>
                {item.stock <= 3 && (
                  <Text style={styles.stockWarning}>잔여 {item.stock}대</Text>
                )}
              </View>
              <View style={styles.dealPrice}>
                <Text style={styles.priceNeon}>₩{formatPrice(item.price)}</Text>
                <Text style={styles.priceOriginal}>₩{formatPrice(item.originalPrice)}</Text>
                <Text style={styles.discount}>-{item.discountRate}%</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  logo: { fontSize: 22, fontWeight: '900', color: '#fff' },
  logoGreen: { color: Colors.dropGreen },
  bellIcon: { fontSize: 22 },
  notifBadge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: Colors.alertRed, borderRadius: 8,
    width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },
  notifBadgeText: { fontFamily: 'PressStart2P', fontSize: 6, color: '#fff' },

  // Live
  liveRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.base, paddingVertical: 6,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.alertRed },
  liveText: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.alertRed },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: Spacing.md, marginVertical: 6,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: Colors.textPrimary },

  // Filters
  filterRow: { paddingHorizontal: Spacing.md, paddingVertical: 6, maxHeight: 42 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    marginRight: 6,
  },
  filterChipActive: { backgroundColor: '#00FF8822', borderColor: Colors.dropGreen },
  filterText: { fontFamily: 'PressStart2P', fontSize: 7 },

  // Sort
  sortRow: { paddingHorizontal: Spacing.base, paddingVertical: 4, alignItems: 'flex-end' },
  sortText: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.textMuted },

  // Deal Card
  dealCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: '#222',
    padding: 12, marginBottom: 8, gap: 12,
  },
  dealCardHot: { backgroundColor: '#00FF8808', borderColor: '#00FF8833' },
  rankBox: { width: 28, alignItems: 'center' },
  rankText: { fontFamily: 'PressStart2P', fontSize: 14 },
  dealInfo: { flex: 1 },
  dealNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  dealName: { fontSize: 13, fontWeight: '700', color: '#fff' },
  dealStorage: { fontSize: 10, color: '#666' },
  hotBadge: { fontFamily: 'PressStart2P', fontSize: 6, color: Colors.alertRed },
  dealLocation: { fontSize: 10, color: '#666', marginTop: 3 },
  stockWarning: { fontFamily: 'PressStart2P', fontSize: 6, color: Colors.alertRed, marginTop: 2 },
  dealPrice: { alignItems: 'flex-end' },
  priceNeon: {
    fontFamily: 'PressStart2P', fontSize: 11, color: Colors.dropGreen,
    textShadowColor: '#00FF8866', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
  },
  priceOriginal: { fontSize: 10, color: '#555', textDecorationLine: 'line-through', marginVertical: 2 },
  discount: { fontFamily: 'PressStart2P', fontSize: 8, color: Colors.alertRed },
});
