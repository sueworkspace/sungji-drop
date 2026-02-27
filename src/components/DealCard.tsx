import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PixelText } from './ui/PixelText';
import { Badge } from './ui/Badge';
import { Colors } from '../constants/colors';
import { Deal, getDevice, getStore, formatPrice } from '../data/mock';

interface DealCardProps {
  deal: Deal;
  rank: number;
  onPress: () => void;
}

export function DealCard({ deal, rank, onPress }: DealCardProps) {
  const device = getDevice(deal.deviceId);
  const store = getStore(deal.storeId);
  if (!device || !store) return null;

  const rankColor = rank === 1 ? Colors.dealGold : rank <= 3 ? '#C0C0C0' : Colors.textDim;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, deal.isHot && styles.hotCard]}
    >
      {/* Rank */}
      <View style={styles.rankContainer}>
        <PixelText size={14} color={rankColor}>{String(rank)}</PixelText>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <PixelText size={9} color={Colors.textPrimary} style={styles.deviceName}>
            {device.name}
          </PixelText>
          <PixelText size={7} color={Colors.textMuted}> {device.storage}</PixelText>
          {deal.isHot && <Badge type="hot" blink />}
        </View>
        <PixelText size={7} color={Colors.textDim} style={styles.location}>
          📍 {store.name}
        </PixelText>
      </View>

      {/* Price */}
      <View style={styles.priceContainer}>
        <PixelText size={11} color={Colors.dropGreen} glow>
          ₩{formatPrice(deal.price)}
        </PixelText>
        <PixelText size={7} color={Colors.textDim} style={styles.originalPrice}>
          ₩{formatPrice(deal.originalPrice)}
        </PixelText>
        <PixelText size={8} color={Colors.alertRed}>
          -{deal.discountRate}%
        </PixelText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: '#222',
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  hotCard: {
    backgroundColor: Colors.greenOverlay,
    borderColor: Colors.borderGreen,
  },
  rankContainer: {
    width: 28,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  deviceName: {
    fontWeight: '700',
  },
  location: {
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginVertical: 2,
  },
});
