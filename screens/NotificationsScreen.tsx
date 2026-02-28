import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type NotificationType = 'new_quote' | 'quote_accepted' | 'chat_message' | 'quote_expired' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  requestId?: string;
  roomId?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'new_quote',
    title: '새 견적이 도착했습니다!',
    body: '명동 스마트폰 성지에서 Galaxy S25 Ultra 견적을 보냈습니다.',
    read: false,
    createdAt: '2026-02-28T14:30:00',
    requestId: '1',
  },
  {
    id: 'n2',
    type: 'chat_message',
    title: '강남 폰 센터에서 메시지',
    body: '요금제는 어떤 걸로 하실 예정인가요?',
    read: false,
    createdAt: '2026-02-28T13:15:00',
    roomId: 'r2',
  },
  {
    id: 'n3',
    type: 'new_quote',
    title: '새 견적이 도착했습니다!',
    body: '홍대 모바일 샵에서 iPhone 16 Pro 견적을 보냈습니다.',
    read: true,
    createdAt: '2026-02-27T10:00:00',
    requestId: '2',
  },
  {
    id: 'n4',
    type: 'quote_accepted',
    title: '견적이 수락되었습니다',
    body: '요청하신 Galaxy Z Fold 6 견적이 수락되었습니다. 채팅을 확인하세요.',
    read: true,
    createdAt: '2026-02-26T16:00:00',
    requestId: '3',
  },
  {
    id: 'n5',
    type: 'quote_expired',
    title: '견적 요청이 만료되었습니다',
    body: 'Galaxy A55 견적 요청 기간이 만료되었습니다.',
    read: true,
    createdAt: '2026-02-24T09:00:00',
  },
  {
    id: 'n6',
    type: 'system',
    title: '성지DROP을 이용해주셔서 감사합니다!',
    body: '이제 전국 딜러에게 실시간 견적을 받아보세요.',
    read: true,
    createdAt: '2026-02-20T08:00:00',
  },
];

const TABS: Array<{ key: NotificationType | '전체'; label: string }> = [
  { key: '전체', label: '전체' },
  { key: 'new_quote', label: '새견적' },
  { key: 'chat_message', label: '채팅' },
  { key: 'system', label: '시스템' },
];

const TYPE_ICON: Record<NotificationType, string> = {
  new_quote: '▼',
  quote_accepted: '✓',
  chat_message: '◈',
  quote_expired: '⊘',
  system: '◉',
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
  const [activeTab, setActiveTab] = useState<NotificationType | '전체'>('전체');

  const filtered =
    activeTab === '전체'
      ? MOCK_NOTIFICATIONS
      : MOCK_NOTIFICATIONS.filter((n) => n.type === activeTab);

  const handlePress = (item: Notification) => {
    if (item.requestId) {
      navigation.navigate('QuoteDetail', { requestId: item.requestId });
    } else if (item.roomId) {
      navigation.navigate('ChatRoom', { roomId: item.roomId, dealerName: '딜러' });
    }
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffH < 1) return '방금';
    if (diffH < 24) return `${diffH}시간 전`;
    return `${diffD}일 전`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
        </TouchableOpacity>
        <PixelText size="section" color={Colors.dropGreen}>알림</PixelText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key as NotificationType | '전체')}
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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifItem, item.read && styles.notifItemRead]}
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
                {!item.read && <View style={styles.unreadDot} />}
                <Text style={[styles.notifTitle, item.read && styles.notifTitleRead]}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>{formatTime(item.createdAt)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <PixelText size="label" color={Colors.textMuted}>알림이 없습니다</PixelText>
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
});
