import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';

const TABS = ['가격 인증왕', '리뷰왕', '절약왕', '종합'];

const rankingData = [
  { rank: 1, name: '최저가킹', level: '마스터헌터', pts: 4200, icon: '👑' },
  { rank: 2, name: '폰마스터', level: '성지순례자', pts: 3100, icon: '🥈' },
  { rank: 3, name: '알뜰왕01', level: '성지순례자', pts: 2800, icon: '🥉' },
  { rank: 4, name: '성지러버', level: '탐색자', pts: 1900, icon: '' },
  { rank: 5, name: '가격해커', level: '탐색자', pts: 1500, icon: '' },
  { rank: 6, name: '드롭헌터', level: '탐색자', pts: 1200, icon: '' },
  { rank: 7, name: '스마트폰덕', level: '뉴비', pts: 900, icon: '' },
  { rank: 8, name: '알뜰소비러', level: '뉴비', pts: 700, icon: '' },
];

export default function RankingScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('종합');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏆 헌터 랭킹</Text>
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
        data={rankingData}
        keyExtractor={item => String(item.rank)}
        contentContainerStyle={{ padding: Spacing.md }}
        renderItem={({ item }) => {
          const isTop = item.rank <= 3;
          return (
            <View style={[styles.rankItem, isTop && styles.rankItemTop]}>
              <Text style={[
                styles.rankNum,
                { color: item.rank === 1 ? Colors.dealGold : item.rank <= 3 ? '#C0C0C0' : '#555' },
              ]}>
                {item.icon || item.rank}
              </Text>
              <View style={styles.rankInfo}>
                <Text style={[styles.rankName, item.rank === 1 && styles.rank1Name]}>{item.name}</Text>
                <Text style={styles.rankLevel}>{item.level}</Text>
              </View>
              <Text style={[styles.rankPts, item.rank === 1 && styles.rank1Pts]}>
                {item.pts.toLocaleString()}pt
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.myRank}>
        <Text style={styles.myRankText}>당신의 순위: 42위 (상위 15%)</Text>
      </View>
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

  tabRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: 8, gap: 4 },
  tab: {
    flex: 1, paddingVertical: 6, alignItems: 'center',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  tabActive: { backgroundColor: '#00FF8822', borderColor: Colors.dropGreen },
  tabText: { fontFamily: 'PressStart2P', fontSize: 6, color: '#666' },
  tabTextActive: { color: Colors.dropGreen },

  rankItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  rankItemTop: { paddingVertical: 18 },
  rankNum: { fontFamily: 'PressStart2P', fontSize: 16, width: 36, textAlign: 'center' },
  rankInfo: { flex: 1 },
  rankName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  rank1Name: {
    color: Colors.dealGold,
    textShadowColor: '#FFD93D66', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
  },
  rankLevel: { fontFamily: 'PressStart2P', fontSize: 6, color: '#666', marginTop: 2 },
  rankPts: { fontFamily: 'PressStart2P', fontSize: 10, color: Colors.dropGreen },
  rank1Pts: { color: Colors.dealGold },

  myRank: {
    paddingVertical: 16, paddingHorizontal: Spacing.base,
    backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.dropGreen,
  },
  myRankText: { fontFamily: 'PressStart2P', fontSize: 8, color: Colors.dropGreen, textAlign: 'center' },
});
