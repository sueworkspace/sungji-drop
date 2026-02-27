import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { deals, getDevice, getStore, formatPrice } from '../src/data/mock';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// 찜한 아이템 시뮬레이션 (deal1, deal3, deal7)
const wishlistDeals = [deals[0], deals[2], deals[6]];
const priceChanges: Record<string, number> = {
  deal1: -50000,
  deal3: -30000,
  deal7: 20000,
};

export default function WishlistScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>★ 찜 목록</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{wishlistDeals.length}</Text>
        </View>
      </View>

      <FlatList
        data={wishlistDeals}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Spacing.md }}
        renderItem={({ item }) => {
          const device = getDevice(item.deviceId);
          const store = getStore(item.storeId);
          if (!device || !store) return null;
          const change = priceChanges[item.id] || 0;
          const isDown = change < 0;

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('DealDetail', { dealId: item.id })}
              activeOpacity={0.7}
              style={[styles.card, isDown && styles.cardGlow]}
            >
              <View style={styles.cardTop}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.storage}>{device.storage}</Text>
              </View>
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.price}>₩{formatPrice(item.price)}</Text>
                  <Text style={styles.storeName}>📍 {store.name}</Text>
                </View>
                <View style={styles.changeBox}>
                  <Text style={[
                    styles.changeText,
                    { color: isDown ? Colors.dropGreen : Colors.alertRed },
                  ]}>
                    {isDown ? '▼' : '▲'} {formatPrice(Math.abs(change))}원 {isDown ? '내림' : '오름'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>★</Text>
            <Text style={styles.emptyText}>찜한 기기가 없습니다</Text>
            <Text style={styles.emptyHint}>드롭 피드에서 관심 있는 딜을 찜해보세요</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  title: { fontFamily: 'PressStart2P', fontSize: 11, color: Colors.dropGreen },
  countBadge: {
    backgroundColor: Colors.dropGreen, paddingHorizontal: 6, paddingVertical: 2,
  },
  countText: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.bg },

  card: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: '#222',
    padding: 16, marginBottom: 10,
  },
  cardGlow: {
    borderColor: '#00FF8844',
    shadowColor: Colors.dropGreen, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15, shadowRadius: 8,
  },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  deviceName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  storage: { fontSize: 12, color: '#666' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontFamily: 'PressStart2P', fontSize: 13, color: Colors.dropGreen },
  storeName: { fontSize: 11, color: '#666', marginTop: 4 },
  changeBox: { alignItems: 'flex-end' },
  changeText: { fontFamily: 'PressStart2P', fontSize: 7 },

  emptyBox: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 40, color: '#333', marginBottom: 16 },
  emptyText: { fontFamily: 'PressStart2P', fontSize: 9, color: '#555' },
  emptyHint: { fontSize: 13, color: '#444', marginTop: 8 },
});
