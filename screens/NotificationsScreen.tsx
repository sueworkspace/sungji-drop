import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useNotifications } from '../src/hooks/useNotifications';
import type { Notification } from '../src/lib/supabase-types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type NotificationType = 'new_quote' | 'quote_accepted' | 'chat_message' | 'quote_expired' | 'system';

const TABS: Array<{ key: NotificationType | '\uC804\uCCB4'; label: string }> = [
  { key: '\uC804\uCCB4', label: '\uC804\uCCB4' },
  { key: 'new_quote', label: '\uC0C8\uACAC\uC801' },
  { key: 'chat_message', label: '\uCC44\uD305' },
  { key: 'system', label: '\uC2DC\uC2A4\uD15C' },
];

const TYPE_ICON: Record<NotificationType, string> = {
  new_quote: '\u25BC',
  quote_accepted: '\u2713',
  chat_message: '\u25C8',
  quote_expired: '\u2298',
  system: '\u25C9',
};

const TYPE_COLOR: Record<NotificationType, string> = {
  new_quote: Colors.dropGreen,
  quote_accepted: Colors.saveGreen,
  chat_message: Colors.dealGold,
  quote_expired: Colors.textMuted,
  system: Colors.textMuted,
};

export default function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<NotificationType | '\uC804\uCCB4'>('\uC804\uCCB4');
  const { notifications, isLoading, error, refetch, markAsRead } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const filtered =
    activeTab === '\uC804\uCCB4'
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const handlePress = useCallback(async (item: Notification) => {
    // Mark as read first
    if (!item.is_read) {
      await markAsRead(item.id);
    }

    const data = item.data as Record<string, unknown> | null;

    if (data?.request_id) {
      navigation.navigate('QuoteDetail', { requestId: data.request_id as string });
    } else if (data?.room_id) {
      navigation.navigate('ChatRoom', { roomId: data.room_id as string, dealerName: '\uB51C\uB7EC' });
    }
  }, [navigation, markAsRead]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffH < 1) return '\uBC29\uAE08';
    if (diffH < 24) return `${diffH}\uC2DC\uAC04 \uC804`;
    return `${diffD}\uC77C \uC804`;
  };

  if (isLoading && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <PixelText size="label" color={Colors.textSecondary}>{'\u2190'}</PixelText>
          </TouchableOpacity>
          <PixelText size="section" color={Colors.dropGreen}>{'\uC54C\uB9BC'}</PixelText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dropGreen} />
          <Text style={styles.loadingText}>{'\uC54C\uB9BC\uC744 \uBD88\uB7EC\uC624\uB294 \uC911...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <PixelText size="label" color={Colors.textSecondary}>{'\u2190'}</PixelText>
          </TouchableOpacity>
          <PixelText size="section" color={Colors.dropGreen}>{'\uC54C\uB9BC'}</PixelText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <PixelText size="label" color={Colors.dropGreen}>{'\uB2E4\uC2DC \uC2DC\uB3C4'}</PixelText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <PixelText size="label" color={Colors.textSecondary}>{'\u2190'}</PixelText>
        </TouchableOpacity>
        <PixelText size="section" color={Colors.dropGreen}>{'\uC54C\uB9BC'}</PixelText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key as NotificationType | '\uC804\uCCB4')}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.md }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dropGreen}
            colors={[Colors.dropGreen]}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifItem, item.is_read && styles.notifItemRead]}
            onPress={() => handlePress(item)}
            activeOpacity={0.75}
          >
            <View style={[styles.typeIconBox, { borderColor: TYPE_COLOR[item.type] }]}>
              <Text style={[styles.typeIcon, { color: TYPE_COLOR[item.type] }]}>
                {TYPE_ICON[item.type]}
              </Text>
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifTitleRow}>
                {!item.is_read && <View style={styles.unreadDot} />}
                <Text style={[styles.notifTitle, item.is_read && styles.notifTitleRead]}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>{formatTime(item.created_at)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <PixelText size="label" color={Colors.textMuted}>{'\uC54C\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4'}</PixelText>
          </View>
        }
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

  tabRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: 8, gap: 6 },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { backgroundColor: '#00FF8822', borderColor: Colors.dropGreen },
  tabText: { fontFamily: 'PressStart2P', fontSize: 7, color: '#666' },
  tabTextActive: { color: Colors.dropGreen },

  notifItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  notifItemRead: { opacity: 0.7 },
  typeIconBox: {
    width: 32,
    height: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  typeIcon: { fontFamily: 'PressStart2P', fontSize: 10 },
  notifContent: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dropGreen,
    flexShrink: 0,
  },
  notifTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  notifTitleRead: { color: Colors.textSecondary },
  notifBody: { fontSize: 12, color: Colors.textMuted, lineHeight: 18, marginBottom: 4 },
  notifTime: { fontFamily: 'PressStart2P', fontSize: 6, color: Colors.textMuted },

  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontFamily: 'NotoSansKR',
    fontSize: 14,
    color: Colors.textMuted,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  errorBox: {
    backgroundColor: Colors.redOverlay,
    borderWidth: 1,
    borderColor: Colors.alertRed,
    padding: Spacing.md,
    width: '100%',
  },
  errorText: {
    fontFamily: 'NotoSansKR',
    fontSize: 13,
    color: Colors.alertRed,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.dropGreen,
  },
});
