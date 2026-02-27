import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [dropAlert, setDropAlert] = React.useState(true);
  const [soundFx, setSoundFx] = React.useState(true);
  const [vibration, setVibration] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
        </TouchableOpacity>
        <PixelText size="section" color={Colors.dropGreen}>설정</PixelText>
      </View>

      <View style={styles.section}>
        <PixelText size="label" color={Colors.textMuted} style={styles.sectionTitle}>알림</PixelText>
        <View style={styles.row}>
          <Text style={styles.label}>드롭 알림</Text>
          <Switch value={dropAlert} onValueChange={setDropAlert} trackColor={{ true: Colors.dropGreen }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>효과음</Text>
          <Switch value={soundFx} onValueChange={setSoundFx} trackColor={{ true: Colors.dropGreen }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>진동</Text>
          <Switch value={vibration} onValueChange={setVibration} trackColor={{ true: Colors.dropGreen }} />
        </View>
      </View>

      <View style={styles.section}>
        <PixelText size="label" color={Colors.textMuted} style={styles.sectionTitle}>앱 정보</PixelText>
        <View style={styles.row}>
          <Text style={styles.label}>버전</Text>
          <PixelText size="badge" color={Colors.textMuted}>v1.0.0</PixelText>
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
    gap: Spacing.md,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  label: { fontSize: 14, color: Colors.textPrimary },
});
