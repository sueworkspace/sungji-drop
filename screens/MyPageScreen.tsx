import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../src/contexts/AuthContext';
import { useMyStats } from '../src/hooks/useMyStats';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  label: string;
  screen?: keyof RootStackParamList;
  color?: string;
  onPress?: () => void;
}

const MENU_ITEMS: MenuItem[] = [
  { label: '알림 설정', screen: 'Settings' },
  { label: '이용약관' },
  { label: '개인정보처리방침' },
];

export default function MyPageScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, signOut } = useAuth();
  const { stats } = useMyStats();

  const nickname = profile?.nickname ?? '사용자';
  const phone = profile?.phone ?? '';
  const avatarInitial = nickname.charAt(0) || '?';

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PixelText size="section" color={Colors.dropGreen}>MY</PixelText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nickname}>{nickname}</Text>
            {phone ? <Text style={styles.phone}>{phone}</Text> : null}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <PixelText size="section" color={Colors.dropGreen}>
              {stats.totalRequests}
            </PixelText>
            <Text style={styles.statLabel}>견적요청</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <PixelText size="section" color={Colors.saveGreen}>
              {stats.completed}
            </PixelText>
            <Text style={styles.statLabel}>완료</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <PixelText size="section" color={Colors.dealGold}>
              {stats.activeChats}
            </PixelText>
            <Text style={styles.statLabel}>채팅</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => {
                if (item.screen) {
                  navigation.navigate(item.screen as any);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuLabel, item.color ? { color: item.color } : {}]}>
                {item.label}
              </Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={[styles.menuLabel, { color: Colors.alertRed }]}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionRow}>
          <PixelText size="badge" color={Colors.textMuted}>앱 버전 1.0.0</PixelText>
        </View>
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
    borderBottomColor: '#1a1a2e',
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    margin: Spacing.base,
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderGreenMid,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.deepDark,
    borderWidth: 2,
    borderColor: Colors.dropGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dropGreen,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'PressStart2P',
    color: Colors.dropGreen,
  },
  profileInfo: { flex: 1 },
  nickname: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  phone: { fontFamily: 'NotoSansKR', fontSize: 13, color: Colors.textMuted },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statLabel: { fontFamily: 'NotoSansKR', fontSize: 11, color: Colors.textMuted },
  statDivider: { width: 1, backgroundColor: '#1a1a2e' },

  menuSection: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  menuLabel: { fontFamily: 'NotoSansKR', fontSize: 15, color: Colors.textPrimary },
  menuArrow: { fontSize: 14, color: Colors.textMuted },

  versionRow: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});
