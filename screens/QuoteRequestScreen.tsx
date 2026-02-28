import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText, NeonButton } from '../components';
import { useDevices } from '../src/hooks/useDevices';
import { supabase, getCurrentUserId } from '../src/lib/supabase';

const TOTAL_STEPS = 5;

const CARRIERS = ['SKT', 'KT', 'LG U+', '\uC54C\uB730\uD3F0'];
const PLAN_TYPES = ['5G \uBB34\uC81C\uD55C', '5G \uC2DC\uADF8\uB2C8\uCC98', '5G \uC2AC\uB9BC', 'LTE \uBB34\uC81C\uD55C', 'LTE \uBCA0\uC774\uC9C1', '\uC790\uAE09\uC81C (\uC694\uAE08\uC81C \uC5C6\uC74C)'];
const TRADE_IN_DEVICES = [
  '\uC5C6\uC74C (\uBCF4\uC0C1\uD310\uB9E4 \uC548\uD568)',
  'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15',
  '\uAE30\uD0C0',
];
const TRADE_IN_CONDITIONS = ['\uC644\uC804 \uC0C8 \uC81C\uD488 (\uBBF8\uAC1C\uBD09)', '\uCD5C\uC0C1 (\uC2A4\uD06C\uB798\uCE58 \uC5C6\uC74C)', '\uC0C1 (\uBBF8\uC138 \uC2A4\uD06C\uB798\uCE58)', '\uC911 (\uC0AC\uC6A9\uAC10 \uC788\uC74C)', '\uD558 (\uD30C\uC190/\uC218\uB9AC \uC774\uB825)'];

const BRAND_LABEL: Record<string, string> = {
  samsung: '\uC0BC\uC131',
  apple: '\uC560\uD50C',
  google: '\uAD6C\uAE00',
  other: '\uAE30\uD0C0',
};

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

const STEP_TITLES = ['\uAE30\uAE30 \uC120\uD0DD', '\uC635\uC158 \uC120\uD0DD', '\uD1B5\uC2E0\uC0AC/\uC694\uAE08\uC81C', '\uBCF4\uC0C1\uD310\uB9E4', '\uD655\uC778 & \uB4F1\uB85D'];

export default function QuoteRequestScreen() {
  const navigation = useNavigation();
  const { devices, isLoading: devicesLoading } = useDevices();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const selectedDevice = devices.find((d) => d.id === form.deviceId);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const userId = await getCurrentUserId();
    if (!userId) {
      setSubmitError('\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.');
      setIsSubmitting(false);
      return;
    }

    // Map carrier: UI uses 'LG U+' but DB CHECK constraint expects 'LGU+'
    const carrierMap: Record<string, string> = { 'LG U+': 'LGU+' };
    const carrierValue = carrierMap[form.carrier ?? ''] || form.carrier;

    // Map trade-in condition to DB codes
    const conditionMap: Record<string, string> = {
      '\uC644\uC804 \uC0C8 \uC81C\uD488 (\uBBF8\uAC1C\uBD09)': 'S',
      '\uCD5C\uC0C1 (\uC2A4\uD06C\uB798\uCE58 \uC5C6\uC74C)': 'A',
      '\uC0C1 (\uBBF8\uC138 \uC2A4\uD06C\uB798\uCE58)': 'B',
      '\uC911 (\uC0AC\uC6A9\uAC10 \uC788\uC74C)': 'C',
      '\uD558 (\uD30C\uC190/\uC218\uB9AC \uC774\uB825)': 'C',
    };

    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('quote_requests')
      .insert({
        user_id: userId,
        device_id: form.deviceId!,
        storage: form.storage!,
        color: form.color!,
        carrier: carrierValue as 'SKT' | 'KT' | 'LGU+' | '\uC54C\uB730\uD3F0',
        plan_type: form.planType!,
        trade_in_device: form.tradeInDevice === '\uC5C6\uC74C (\uBCF4\uC0C1\uD310\uB9E4 \uC548\uD568)' ? null : (form.tradeInDevice || null),
        trade_in_condition: form.tradeInCondition ? (conditionMap[form.tradeInCondition] as 'S' | 'A' | 'B' | 'C' || null) : null,
        additional_notes: form.additionalNotes || null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
      return;
    }

    // Generate mock quotes (will fail silently if RPC doesn't exist yet)
    if (data) {
      try {
        await (supabase.rpc as any)('generate_mock_quotes', { p_request_id: (data as any).id });
      } catch (e) {
        console.warn('Mock quote generation skipped:', e);
      }
    }

    setIsSubmitting(false);
    navigation.goBack();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '\uC6D0';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <PixelText size="label" color={Colors.textSecondary}>{'\u2190'}</PixelText>
        </TouchableOpacity>
        <PixelText size="section" color={Colors.dropGreen}>{'\uACAC\uC801 \uC694\uCCAD'}</PixelText>
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
            {devicesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.dropGreen} />
                <Text style={styles.loadingText}>{'\uAE30\uAE30 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uB294 \uC911...'}</Text>
              </View>
            ) : (
              devices.map((device) => (
                <TouchableOpacity
                  key={device.id}
                  style={[
                    styles.deviceOption,
                    form.deviceId === device.id && styles.deviceOptionSelected,
                  ]}
                  onPress={() => {
                    setField('deviceId', device.id);
                    setField('deviceName', device.name);
                    setField('storage', null);
                    setField('color', null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deviceBrandTag}>{BRAND_LABEL[device.brand] ?? device.brand}</Text>
                  <Text style={[
                    styles.deviceOptionName,
                    form.deviceId === device.id && { color: Colors.dropGreen },
                  ]}>
                    {device.name}
                  </Text>
                  <Text style={styles.devicePrice}>{formatPrice(device.original_price)}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Step 2: Options */}
        {currentStep === 2 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionLabel}>{'\uC6A9\uB7C9'}</Text>
            <View style={styles.chipRow}>
              {(selectedDevice?.storage_options ?? []).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, form.storage === s && styles.chipSelected]}
                  onPress={() => setField('storage', s)}
                >
                  <Text style={[styles.chipText, form.storage === s && { color: Colors.dropGreen }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.optionLabel, { marginTop: Spacing.md }]}>{'\uC0C9\uC0C1'}</Text>
            <View style={styles.chipRow}>
              {(selectedDevice?.color_options ?? []).map((c) => (
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
            <Text style={styles.optionLabel}>{'\uD1B5\uC2E0\uC0AC'}</Text>
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

            <Text style={[styles.optionLabel, { marginTop: Spacing.md }]}>{'\uC694\uAE08\uC81C \uC720\uD615'}</Text>
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
                  {form.planType === p && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Trade-in */}
        {currentStep === 4 && (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionLabel}>{'\uBCF4\uC0C1\uD310\uB9E4 \uAE30\uAE30'}</Text>
            <View style={styles.listOptions}>
              {TRADE_IN_DEVICES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.listOption, form.tradeInDevice === d && styles.listOptionSelected]}
                  onPress={() => {
                    setField('tradeInDevice', d);
                    if (d === '\uC5C6\uC74C (\uBCF4\uC0C1\uD310\uB9E4 \uC548\uD568)') setField('tradeInCondition', null);
                  }}
                >
                  <Text style={[styles.listOptionText, form.tradeInDevice === d && { color: Colors.dropGreen }]}>
                    {d}
                  </Text>
                  {form.tradeInDevice === d && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                </TouchableOpacity>
              ))}
            </View>

            {form.tradeInDevice && form.tradeInDevice !== '\uC5C6\uC74C (\uBCF4\uC0C1\uD310\uB9E4 \uC548\uD568)' && (
              <>
                <Text style={[styles.optionLabel, { marginTop: Spacing.md }]}>{'\uAE30\uAE30 \uC0C1\uD0DC'}</Text>
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
                      {form.tradeInCondition === c && <Text style={styles.checkmark}>{'\u2713'}</Text>}
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
              {'\uACAC\uC801 \uC694\uCCAD \uB0B4\uC6A9 \uD655\uC778'}
            </PixelText>

            <View style={styles.summaryCard}>
              {[
                { label: '\uAE30\uAE30', value: form.deviceName ?? '-' },
                { label: '\uC6A9\uB7C9', value: form.storage ?? '-' },
                { label: '\uC0C9\uC0C1', value: form.color ?? '-' },
                { label: '\uD1B5\uC2E0\uC0AC', value: form.carrier ?? '-' },
                { label: '\uC694\uAE08\uC81C', value: form.planType ?? '-' },
                { label: '\uBCF4\uC0C1\uD310\uB9E4', value: form.tradeInDevice ?? '-' },
                form.tradeInCondition ? { label: '\uAE30\uAE30\uC0C1\uD0DC', value: form.tradeInCondition } : null,
              ]
                .filter(Boolean)
                .map((row) => (
                  <View key={row!.label} style={styles.summaryRow}>
                    <PixelText size="badge" color={Colors.textMuted}>{row!.label}</PixelText>
                    <Text style={styles.summaryValue}>{row!.value}</Text>
                  </View>
                ))}
            </View>

            <Text style={styles.notesLabel}>{'\uCD94\uAC00 \uC694\uCCAD\uC0AC\uD56D (\uC120\uD0DD)'}</Text>
            <TextInput
              style={styles.notesInput}
              value={form.additionalNotes}
              onChangeText={(t) => setField('additionalNotes', t)}
              placeholder={'\uC608: \uC0C9\uC0C1 \uC6B0\uC120, \uCD5C\uB300\uD55C \uBE68\uB9AC, \uD2B9\uC815 \uC694\uAE08\uC81C \uBB38\uC758 \uB4F1'}
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {submitError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{submitError}</Text>
              </View>
            )}

            <NeonButton
              label={isSubmitting ? '\uC694\uCCAD \uC911...' : '\uACAC\uC801 \uC694\uCCAD\uD558\uAE30 \u25BC'}
              onPress={isSubmitting ? undefined : handleSubmit}
              size="lg"
              style={{ marginTop: Spacing.lg, opacity: isSubmitting ? 0.6 : 1 }}
            />
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <View style={styles.navButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.prevButton} onPress={goPrev}>
              <PixelText size="label" color={Colors.textSecondary}>{'\u2190 \uC774\uC804'}</PixelText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
            onPress={canProceed() ? goNext : undefined}
            activeOpacity={canProceed() ? 0.7 : 1}
          >
            <PixelText size="label" color={canProceed() ? Colors.textInverse : Colors.textMuted}>
              {'\uB2E4\uC74C \u2192'}
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
  devicePrice: { fontFamily: 'NotoSansKR', fontSize: 11, color: Colors.textMuted, marginTop: 2 },

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

  errorBox: {
    backgroundColor: Colors.redOverlay,
    borderWidth: 1,
    borderColor: Colors.alertRed,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  errorText: {
    fontFamily: 'NotoSansKR',
    fontSize: 13,
    color: Colors.alertRed,
  },

  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  loadingText: {
    fontFamily: 'NotoSansKR',
    fontSize: 14,
    color: Colors.textMuted,
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
