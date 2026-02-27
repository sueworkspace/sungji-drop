import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';
import { stores } from '../src/data/mock';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <PixelText size="section" color={Colors.dropGreen}>◎ 성지맵</PixelText>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <PixelText size="label" color={Colors.textMuted}>[ MAP AREA ]</PixelText>
        <PixelText size="badge" color={Colors.textMuted} style={styles.mapNote}>
          위치 기반 성지 탐색
        </PixelText>
      </View>

      {/* Store list */}
      <ScrollView contentContainerStyle={styles.storeList}>
        <PixelText size="label" color={Colors.textSecondary} style={styles.sectionTitle}>
          인근 성지
        </PixelText>
        {stores.map(store => (
          <TouchableOpacity key={store.id} activeOpacity={0.7} style={styles.storeCard}>
            <View style={styles.storeMain}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeRegion}>{store.region}</Text>
            </View>
            <View style={styles.storeRight}>
              <PixelText size="badge" color={Colors.dealGold}>★ {store.rating}</PixelText>
              {store.verified && (
                <PixelText size="badge" color={Colors.dropGreen}>인증</PixelText>
              )}
              <Text style={styles.storeHours}>{store.openHours}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mapPlaceholder: {
    height: 220,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGreen,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  mapNote: { marginTop: Spacing.xs },
  storeList: { padding: Spacing.base },
  sectionTitle: { marginBottom: Spacing.sm },
  storeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  storeMain: { flex: 1 },
  storeName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  storeRegion: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  storeRight: { alignItems: 'flex-end', gap: 4 },
  storeHours: { fontSize: 10, color: Colors.textMuted },
});
