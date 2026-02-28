import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';

export default function SettingsScreen() {
  const navigation = useNavigation();

  // Notification Settings
  const [newQuoteAlert, setNewQuoteAlert] = React.useState(true);
  const [chatAlert, setChatAlert] = React.useState(true);
  const [quoteExpiredAlert, setQuoteExpiredAlert] = React.useState(true);
  const [soundFx, setSoundFx] = React.useState(true);
  const [vibration, setVibration] = React.useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '계정을 삭제하면 모든 데이터가 사라집니다. 정말 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
        </TouchableOpacity>
        <PixelText size="section" color={Colors.dropGreen}>설정</PixelText>
        <View style={{ width: 24 }} />
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <PixelText size="label" color={Colors.textMuted} style={styles.sectionTitle}>
          알림 설정
        </PixelText>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>새 견적 알림</Text>
            <Switch
              value={newQuoteAlert}
              onValueChange={setNewQuoteAlert}
              trackColor={{ true: Colors.dropGreen }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>채팅 메시지 알림</Text>
            <Switch
              value={chatAlert}
              onValueChange={setChatAlert}
              trackColor={{ true: Colors.dropGreen }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>견적 만료 알림</Text>
            <Switch
              value={quoteExpiredAlert}
              onValueChange={setQuoteExpiredAlert}
              trackColor={{ true: Colors.dropGreen }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>효과음</Text>
            <Switch
              value={soundFx}
              onValueChange={setSoundFx}
              trackColor={{ true: Colors.dropGreen }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>진동</Text>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ true: Colors.dropGreen }}
            />
          </View>
        </View>
      </View>

      {/* Account Management */}
      <View style={styles.section}>
        <PixelText size="label" color={Colors.textMuted} style={styles.sectionTitle}>
          계정 관리
        </PixelText>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <Text style={styles.label}>휴대폰 번호 변경</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.row}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, { color: Colors.alertRed }]}>계정 삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <PixelText size="label" color={Colors.textMuted} style={styles.sectionTitle}>
          앱 정보
        </PixelText>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>버전</Text>
            <PixelText size="badge" color={Colors.textMuted}>v1.0.0</PixelText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  back: { padding: Spacing.xs },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: { marginBottom: Spacing.sm },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  divider: { height: 1, backgroundColor: '#1a1a2e' },
  label: { fontSize: 14, color: Colors.textPrimary, fontFamily: 'NotoSansKR' },
  arrow: { fontSize: 14, color: Colors.textMuted },
});
