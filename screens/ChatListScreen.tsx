import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText, LoadingOverlay, ErrorBox } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useChatRooms, ChatRoomWithDetails } from '../src/hooks/useChatRooms';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return '';
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;

  const d = new Date(isoString);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function ChatListScreen() {
  const navigation = useNavigation<Nav>();
  const { chatRooms, isLoading, error, refetch } = useChatRooms();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = ({ item }: { item: ChatRoomWithDetails }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('ChatRoom', {
          roomId: item.id,
          dealerName: item.dealers?.store_name ?? '딜러',
        })
      }
      activeOpacity={0.75}
    >
      <View style={styles.avatarBox}>
        <Text style={styles.avatarText}>🏪</Text>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatTopRow}>
          <View style={styles.dealerInfo}>
            <Text style={styles.dealerName}>
              {item.dealers?.store_name ?? '딜러'}
            </Text>
            <Text style={styles.dealerRegion}>
              {item.dealers?.region ?? ''}
            </Text>
          </View>
          <View style={styles.rightInfo}>
            <Text style={styles.timeText}>
              {formatRelativeTime(item.last_message_at)}
            </Text>
            {item.user_unread_count > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.user_unread_count}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message ?? '채팅을 시작하세요'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PixelText size="section" color={Colors.dropGreen}>채팅</PixelText>
        </View>
        <LoadingOverlay />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PixelText size="section" color={Colors.dropGreen}>채팅</PixelText>
        </View>
        <ErrorBox message={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PixelText size="section" color={Colors.dropGreen}>채팅</PixelText>
      </View>

      {chatRooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>◈</Text>
          <PixelText size="label" color={Colors.textMuted}>진행중인 채팅이 없습니다</PixelText>
          <Text style={styles.emptySubText}>견적을 받고 딜러와 채팅을 시작하세요</Text>
        </View>
      ) : (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.dropGreen}
              colors={[Colors.dropGreen]}
            />
          }
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
