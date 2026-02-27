import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { notifications } from '../src/data/mock';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS = ['전체', '드롭', '찜', '리뷰', '시스템'];

export default function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState('전체');

  const filtered = activeTab === '전체'
    ? notifications
    : notifications.filter(n => {
        if (activeTab === '드롭') return n.type === 'drop';
        if (activeTab === '찜') return n.type === 'wishlist' || n.type === 'target';
        if (activeTab === '리뷰') return n.type === 'review';
        if (activeTab === '시스템') return n.type === 'system';
        return true;
      });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔔 알림</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notifItem}
            onPress={() => item.dealId && navigation.navigate('DealDetail', { dealId: item.dealId })}
          >
            {!item.read && <View style={styles.unreadDot} />}
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>
                {new Date(item.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  back: { fontFamily: 'PressStart2P', fontSize: 9, color: Colors.dropGreen },
  title: { fontFamily: 'PressStart2P', fontSize: 11, color: Colors.dropGreen },

  tabRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: 8, gap: 6 },
  tab: {
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  tabActive: { backgroundColor: '#00FF8822', borderColor: Colors.dropGreen },
  tabText: { fontFamily: 'PressStart2P', fontSize: 7, color: '#666' },
  tabTextActive: { color: Colors.dropGreen },

  notifItem: {
    flexDirection: 'row', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.dropGreen, marginRight: 10, marginTop: 4,
  },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  notifBody: { fontSize: 12, color: '#999', lineHeight: 18 },
  notifTime: { fontSize: 10, color: '#555', marginTop: 4 },
});
