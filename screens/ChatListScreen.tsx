import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface ChatRoom {
  id: string;
  dealerName: string;
  dealerRegion: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  deviceName: string;
}

const MOCK_CHATS: ChatRoom[] = [
  {
    id: 'r1',
    dealerName: '명동 스마트폰 성지',
    dealerRegion: '서울 중구',
    lastMessage: '갤럭시 S25 Ultra 256GB, 공시지원금 적용하면 89만원에 드릴 수 있습니다.',
    lastTime: '방금',
    unreadCount: 2,
    deviceName: 'Galaxy S25 Ultra',
  },
  {
    id: 'r2',
    dealerName: '강남 폰 센터',
    dealerRegion: '서울 강남',
    lastMessage: '요금제는 어떤 걸로 하실 예정인가요?',
    lastTime: '15분 전',
    unreadCount: 0,
    deviceName: 'iPhone 16 Pro',
  },
  {
    id: 'r3',
    dealerName: '홍대 모바일 샵',
    dealerRegion: '서울 마포',
    lastMessage: '확인해보겠습니다!',
    lastTime: '1시간 전',
    unreadCount: 1,
    deviceName: 'Galaxy Z Fold 6',
  },
];

export default function ChatListScreen() {
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatRoom', { roomId: item.id, dealerName: item.dealerName })}
      activeOpacity={0.75}
    >
      <View style={styles.avatarBox}>
        <Text style={styles.avatarText}>🏪</Text>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatTopRow}>
          <View style={styles.dealerInfo}>
            <Text style={styles.dealerName}>{item.dealerName}</Text>
            <Text style={styles.dealerRegion}>{item.dealerRegion}</Text>
          </View>
          <View style={styles.rightInfo}>
            <Text style={styles.timeText}>{item.lastTime}</Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.deviceTag}>{item.deviceName}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PixelText size="section" color={Colors.dropGreen}>채팅</PixelText>
      </View>

      {MOCK_CHATS.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>◈</Text>
          <PixelText size="label" color={Colors.textMuted}>진행중인 채팅이 없습니다</PixelText>
          <Text style={styles.emptySubText}>견적을 받고 딜러와 채팅을 시작하세요</Text>
        </View>
      ) : (
        <FlatList
          data={MOCK_CHATS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  list: { paddingBottom: 30 },

  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 22 },
  chatContent: { flex: 1 },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  dealerInfo: { flex: 1 },
  dealerName: { fontFamily: 'NotoSansKR-Bold', fontSize: 14, color: Colors.textPrimary },
  dealerRegion: { fontFamily: 'NotoSansKR', fontSize: 11, color: Colors.textMuted },
  rightInfo: { alignItems: 'flex-end', gap: 4 },
  timeText: { fontFamily: 'NotoSansKR', fontSize: 11, color: Colors.textMuted },
  unreadBadge: {
    backgroundColor: Colors.dropGreen,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: { fontFamily: 'PressStart2P', fontSize: 6, color: Colors.textInverse },
  deviceTag: {
    fontFamily: 'PressStart2P',
    fontSize: 6,
    color: Colors.dropGreen,
    marginBottom: 3,
  },
  lastMessage: { fontFamily: 'NotoSansKR', fontSize: 12, color: Colors.textSecondary },

  separator: { height: 1, backgroundColor: '#1a1a2e', marginLeft: Spacing.base },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  emptyIcon: { fontSize: 48, color: Colors.textMuted },
  emptySubText: { fontFamily: 'NotoSansKR', fontSize: 13, color: Colors.textMuted, marginTop: 4 },
});
