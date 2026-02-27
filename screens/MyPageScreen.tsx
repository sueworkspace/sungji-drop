import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { userProfile, achievements, dailyMissions, formatPrice } from '../src/data/mock';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MyPageScreen() {
  const navigation = useNavigation<Nav>();
  const progressPct = Math.round((userProfile.points / userProfile.nextRankPoints) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{userProfile.rank.icon}</Text>
          </View>
          <Text style={styles.nickname}>{userProfile.nickname}</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{userProfile.rank.name}</Text>
          </View>
        </View>

        {/* Points & Progress */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <Text style={styles.pointsLabel}>POINTS</Text>
            <Text style={styles.pointsValue}>{userProfile.points}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressText}>
            다음 등급까지 {formatPrice(userProfile.nextRankPoints - userProfile.points)}pt
          </Text>
        </View>

        {/* Activity Summary */}
        <View style={styles.activityRow}>
          <View style={styles.activityItem}>
            <Text style={styles.activityNum}>{userProfile.reviewCount}</Text>
            <Text style={styles.activityLabel}>리뷰</Text>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <Text style={styles.activityNum}>{userProfile.verifyCount}</Text>
            <Text style={styles.activityLabel}>인증</Text>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <Text style={[styles.activityNum, { color: Colors.saveGreen }]}>
              {formatPrice(userProfile.totalSaved)}
            </Text>
            <Text style={styles.activityLabel}>절약 총액</Text>
          </View>
        </View>

        {/* Daily Missions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 오늘의 미션</Text>
          {dailyMissions.map(m => (
            <View key={m.id} style={styles.missionRow}>
              <Text style={[styles.missionCheck, { color: m.completed ? Colors.dropGreen : '#444' }]}>
                {m.completed ? '✓' : '○'}
              </Text>
              <Text style={[styles.missionText, m.completed && styles.missionDone]}>
                {m.text}
              </Text>
              <Text style={styles.missionPts}>+{m.points}pt</Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 업적</Text>
          <View style={styles.achieveGrid}>
            {achievements.map(a => (
              <View key={a.id} style={[styles.achieveItem, !a.unlocked && styles.achieveLocked]}>
                <Text style={styles.achieveIcon}>{a.unlocked ? a.icon : '🔒'}</Text>
                <Text style={[styles.achieveName, !a.unlocked && { color: '#444' }]}>{a.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>● MENU</Text>
          {[
            { label: '내 리뷰 관리', screen: null },
            { label: '가격 인증 내역', screen: null },
            { label: '해체 결과 저장함', screen: null },
            { label: '헌터 랭킹', screen: 'Ranking' as const },
            { label: '설정', screen: 'Settings' as const },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <Text style={styles.menuText}>{item.label}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  profileSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.card, borderWidth: 2, borderColor: Colors.dropGreen,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.dropGreen, shadowOpacity: 0.3, shadowRadius: 10,
  },
  avatarEmoji: { fontSize: 36 },
  nickname: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 12 },
  rankBadge: {
    marginTop: 6, paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: '#00FF8822', borderWidth: 1, borderColor: Colors.dropGreen,
  },
  rankText: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.dropGreen },

  pointsCard: {
    marginHorizontal: Spacing.base, padding: 16,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  pointsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  pointsLabel: { fontFamily: 'PressStart2P', fontSize: 8, color: '#888' },
  pointsValue: { fontFamily: 'PressStart2P', fontSize: 16, color: Colors.dropGreen },
  progressBar: {
    height: 8, backgroundColor: '#222', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: Colors.dropGreen,
    shadowColor: Colors.dropGreen, shadowOpacity: 0.5, shadowRadius: 4,
  },
  progressText: { fontSize: 11, color: '#666', marginTop: 6 },

  activityRow: {
    flexDirection: 'row', marginHorizontal: Spacing.base, marginTop: 12,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 16,
  },
  activityItem: { flex: 1, alignItems: 'center' },
  activityNum: { fontFamily: 'PressStart2P', fontSize: 12, color: Colors.dropGreen },
  activityLabel: { fontSize: 11, color: '#666', marginTop: 4 },
  activityDivider: { width: 1, backgroundColor: '#222' },

  section: { paddingHorizontal: Spacing.base, marginTop: 24 },
  sectionTitle: { fontFamily: 'PressStart2P', fontSize: 9, color: Colors.dropGreen, marginBottom: 12 },

  missionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  missionCheck: { fontFamily: 'PressStart2P', fontSize: 12 },
  missionText: { flex: 1, fontSize: 13, color: '#ccc' },
  missionDone: { color: '#666', textDecorationLine: 'line-through' },
  missionPts: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.dealGold },

  achieveGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  achieveItem: {
    width: 90, height: 90, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  achieveLocked: { opacity: 0.4 },
  achieveIcon: { fontSize: 28, marginBottom: 4 },
  achieveName: { fontFamily: 'PressStart2P', fontSize: 6, color: '#aaa', textAlign: 'center' },

  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  menuText: { fontSize: 15, color: '#ccc' },
  menuArrow: { fontSize: 14, color: '#555' },
});
