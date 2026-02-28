import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText, NeonButton } from '../components';

const TOTAL_STEPS = 5;

const POPULAR_DEVICES = [
  { id: 'd1', name: 'Galaxy S25 Ultra', brand: '삼성' },
  { id: 'd2', name: 'Galaxy S25+', brand: '삼성' },
  { id: 'd3', name: 'Galaxy S25', brand: '삼성' },
  { id: 'd4', name: 'Galaxy Z Fold 6', brand: '삼성' },
  { id: 'd5', name: 'Galaxy Z Flip 6', brand: '삼성' },
  { id: 'd6', name: 'iPhone 16 Pro Max', brand: '애플' },
  { id: 'd7', name: 'iPhone 16 Pro', brand: '애플' },
  { id: 'd8', name: 'iPhone 16', brand: '애플' },
  { id: 'd9', name: 'iPhone 15', brand: '애플' },
  { id: 'd10', name: 'Galaxy A55', brand: '삼성' },
];

const STORAGES = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const COLORS: Record<string, string[]> = {
  'd1': ['티타늄 블랙', '티타늄 그레이', '티타늄 실버화이트'],
  'd6': ['블랙 티타늄', '화이트 티타늄', '내추럴 티타늄', '데저트 티타늄'],
  default: ['블랙', '화이트', '블루', '그린', '퍼플'],
};
const CARRIERS = ['SKT', 'KT', 'LG U+', '알뜰폰'];
const PLAN_TYPES = ['5G 무제한', '5G 시그니처', '5G 슬림', 'LTE 무제한', 'LTE 베이직', '자급제 (요금제 없음)'];
const TRADE_IN_DEVICES = [
  '없음 (보상판매 안함)',
  'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15',
  '기타',
];
const TRADE_IN_CONDITIONS = ['완전 새 제품 (미개봉)', '최상 (스크래치 없음)', '상 (미세 스크래치)', '중 (사용감 있음)', '하 (파손/수리 이력)'];

interface FormState {
  deviceId: string | null;
  deviceName: string | null;
  storage: string | null;
  color: string | null;
  carrier: string | null;
  planType: string | null;
  tradeInDevice: string | null;
  tradeInCondition: string | null;
  additionalNotes: string;
}

const STEP_TITLES = ['기기 선택', '옵션 선택', '통신사/요금제', '보상판매', '확인 & 등록'];

export default function QuoteRequestScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    deviceId: null,
    deviceName: null,
    storage: null,
    color: null,
    carrier: null,
    planType: null,
    tradeInDevice: null,
    tradeInCondition: null,
    additionalNotes: '',
  });

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };
  const goPrev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const getColors = () => {
    if (!form.deviceId) return COLORS.default;
    return COLORS[form.deviceId] ?? COLORS.default;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!form.deviceId;
      case 2: return !!form.storage && !!form.color;
      case 3: return !!form.carrier && !!form.planType;
      case 4: return !!form.tradeInDevice;
      case 5: return true;
      default: return false;
    }
  };

  const handleSubmit = () => {
    // Placeholder: will integrate with API later
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
        </TouchableOpacity>
        <PixelText size="section" color={Colors.dropGreen}>견적 요청</PixelText>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${(currentStep / TOTAL_STEPS) * 100}%` }]} />
        </View>
        <PixelText size="badge" color={Colors.textMuted}>{currentStep}/{TOTAL_STEPS}</PixelText>
      </View>

      {/* Step Title */}
      <View style={styles.stepTitleRow}>
        <PixelText size="label" color={Colors.dropGreen}>
          STEP {currentStep}
        </PixelText>
        <Text style={styles.stepName}>{STEP_TITLES[currentStep - 1]}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.stepContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Device Selection */}
        {currentStep === 1 && (
          <View style={styles.optionGrid}>
            {POPULAR_DEVICES.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={[
                  styles.deviceOption,
                  form.deviceId === device.id && styles.deviceOptionSelected,
                ]}
                onPress={() => {
                  setField('deviceId', device.id);
                  setField('deviceName', device.name);
                  setField('color', null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.deviceBrandTag}>{device.brand}</Text>
                <Text style={[
                  styles.deviceOptionName,
                  form.deviceId === device.id && { color: Colors.dropGreen },
                ]}>
                  {device.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 2: Options */}
        {currentStep === 2 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionLabel}>용량</Text>
            <View style={styles.chipRow}>
              {STORAGES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, form.storage === s && styles.chipSelected]}
                  onPress={() => setField('storage', s)}
                >
                  <Text style={[styles.chipText, form.storage === s && { color: Colors.dropGreen }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.optionLabel, { marginTop: Spacing.md }]}>색상</Text>
            <View style={styles.chipRow}>
              {getColors().map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, form.color === c && styles.chipSelected]}
                  onPress={() => setField('color', c)}
                >
                  <Text style={[styles.chipText, form.color === c && { color: Colors.dropGreen }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Carrier & Plan */}
        {currentStep === 3 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionLabel}>통신사</Text>
            <View style={styles.chipRow}>
              {CARRIERS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, form.carrier === c && styles.chipSelected]}
                  onPress={() => setField('carrier', c)}
                >
                  <Text style={[styles.chipText, form.carrier === c && { color: Colors.dropGreen }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.optionLabel, { marginTop: Spacing.md }]}>요금제 유형</Text>
            <View style={styles.listOptions}>
              {PLAN_TYPES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.listOption, form.planType === p && styles.listOptionSelected]}
                  onPress={() => setField('planType', p)}
                >
                  <Text style={[styles.listOptionText, form.planType === p && { color: Colors.dropGreen }]}>
                    {p}
                  </Text>
                  {form.planType === p && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Trade-in */}
        {currentStep === 4 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionLabel}>보상판매 기기</Text>
            <View style={styles.listOptions}>
              {TRADE_IN_DEVICES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.listOption, form.tradeInDevice === d && styles.listOptionSelected]}
                  onPress={() => {
                    setField('tradeInDevice', d);
                    if (d === '없음 (보상판매 안함)') setField('tradeInCondition', null);
                  }}
                >
                  <Text style={[styles.listOptionText, form.tradeInDevice === d && { color: Colors.dropGreen }]}>
                    {d}
                  </Text>
                  {form.tradeInDevice === d && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>

            {form.tradeInDevice && form.tradeInDevice !== '없음 (보상판매 안함)' && (
              <>
                <Text style={[styles.optionLabel, { marginTop: Spacing.md }]}>기기 상태</Text>
                <View style={styles.listOptions}>
                  {TRADE_IN_CONDITIONS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.listOption, form.tradeInCondition === c && styles.listOptionSelected]}
                      onPress={() => setField('tradeInCondition', c)}
                    >
                      <Text style={[styles.listOptionText, form.tradeInCondition === c && { color: Colors.dropGreen }]}>
                        {c}
                      </Text>
                      {form.tradeInCondition === c && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <View style={styles.summaryContainer}>
            <PixelText size="label" color={Colors.dropGreen} style={styles.summaryTitle}>
              견적 요청 내용 확인
            </PixelText>

            <View style={styles.summaryCard}>
              {[
                { label: '기기', value: form.deviceName ?? '-' },
                { label: '용량', value: form.storage ?? '-' },
                { label: '색상', value: form.color ?? '-' },
                { label: '통신사', value: form.carrier ?? '-' },
                { label: '요금제', value: form.planType ?? '-' },
                { label: '보상판매', value: form.tradeInDevice ?? '-' },
                form.tradeInCondition ? { label: '기기상태', value: form.tradeInCondition } : null,
              ]
                .filter(Boolean)
                .map((row) => (
                  <View key={row!.label} style={styles.summaryRow}>
                    <PixelText size="badge" color={Colors.textMuted}>{row!.label}</PixelText>
                    <Text style={styles.summaryValue}>{row!.value}</Text>
                  </View>
                ))}
            </View>

            <Text style={styles.notesLabel}>추가 요청사항 (선택)</Text>
            <TextInput
              style={styles.notesInput}
              value={form.additionalNotes}
              onChangeText={(t) => setField('additionalNotes', t)}
              placeholder="예: 색상 우선, 최대한 빨리, 특정 요금제 문의 등"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <NeonButton
              label="견적 요청하기 ▼"
              onPress={handleSubmit}
              size="lg"
              style={{ marginTop: Spacing.lg }}
            />
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <View style={styles.navButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.prevButton} onPress={goPrev}>
              <PixelText size="label" color={Colors.textSecondary}>← 이전</PixelText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
            onPress={canProceed() ? goNext : undefined}
            activeOpacity={canProceed() ? 0.7 : 1}
          >
            <PixelText size="label" color={canProceed() ? Colors.textInverse : Colors.textMuted}>
              다음 →
            </PixelText>
          </TouchableOpacity>
        </View>
      )}
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

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dropGreen,
    shadowColor: Colors.dropGreen,
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },

  stepTitleRow: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    gap: 4,
  },
  stepName: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 4,
  },

  stepContent: { paddingHorizontal: Spacing.base, paddingBottom: 100 },

  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  deviceOption: {
    width: '47%',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
  },
  deviceOptionSelected: {
    backgroundColor: Colors.greenOverlayMid,
    borderColor: Colors.dropGreen,
  },
  deviceBrandTag: { fontFamily: 'PressStart2P', fontSize: 6, color: Colors.textMuted, marginBottom: 4 },
  deviceOptionName: { fontFamily: 'NotoSansKR-Bold', fontSize: 13, color: Colors.textPrimary },

  optionsContainer: { paddingTop: Spacing.sm },
  optionLabel: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.textMuted, marginBottom: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: { backgroundColor: Colors.greenOverlayMid, borderColor: Colors.dropGreen },
  chipText: { fontFamily: 'NotoSansKR', fontSize: 13, color: Colors.textSecondary },

  listOptions: { gap: 1 },
  listOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 2,
  },
  listOptionSelected: { backgroundColor: Colors.greenOverlayMid, borderColor: Colors.dropGreen },
  listOptionText: { fontFamily: 'NotoSansKR', fontSize: 14, color: Colors.textSecondary, flex: 1 },
  checkmark: { fontFamily: 'PressStart2P', fontSize: 8, color: Colors.dropGreen },

  summaryContainer: { paddingTop: Spacing.sm },
  summaryTitle: { marginBottom: Spacing.md },
  summaryCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderGreenMid,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  summaryValue: { fontFamily: 'NotoSansKR-Bold', fontSize: 14, color: Colors.textPrimary },

  notesLabel: { fontFamily: 'PressStart2P', fontSize: 7, color: Colors.textMuted, marginBottom: Spacing.sm },
  notesInput: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontFamily: 'NotoSansKR',
    fontSize: 14,
    minHeight: 80,
  },

  navButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    backgroundColor: Colors.bg,
  },
  prevButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    backgroundColor: Colors.dropGreen,
    borderWidth: 1,
    borderColor: Colors.dropGreen,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
});
