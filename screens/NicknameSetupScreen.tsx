import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize } from '../constants';
import { PixelText, NeonButton, ScanlineOverlay } from '../components';
import { useAuth } from '../src/contexts/AuthContext';

const MAX_NICKNAME_LENGTH = 12;
const MIN_NICKNAME_LENGTH = 2;

export default function NicknameSetupScreen() {
  const { updateProfile } = useAuth();

  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = nickname.trim();
  const isValid = trimmed.length >= MIN_NICKNAME_LENGTH && trimmed.length <= MAX_NICKNAME_LENGTH;
  const charCount = trimmed.length;

  function handleNicknameChange(text: string) {
    // 최대 길이 제한 (입력 단계에서)
    if (text.length <= MAX_NICKNAME_LENGTH) {
      setNickname(text);
      setError(null);
    }
  }

  async function handleSubmit() {
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    const { error: updateError } = await updateProfile({ nickname: trimmed });

    setIsLoading(false);

    if (updateError) {
      if (updateError.message.includes('duplicate') || updateError.message.includes('unique')) {
        setError('이미 사용 중인 닉네임입니다. 다른 닉네임을 시도해주세요.');
      } else {
        setError(updateError.message || '닉네임 설정에 실패했습니다. 다시 시도해주세요.');
      }
    }
    // 성공 시 AuthContext의 isNewUser가 false로 바뀌고
    // App.tsx의 AppNavigator가 자동으로 메인 앱으로 라우팅합니다.
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScanlineOverlay />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* 상단 로고 */}
          <View style={styles.logoArea}>
            <PixelText size="section" color={Colors.dropGreen} glow>
              SUNGJI DROP
            </PixelText>
          </View>

          {/* 헤더 */}
          <View style={styles.header}>
            <PixelText size="section" color={Colors.textPrimary} style={styles.title}>
              닉네임 설정
            </PixelText>
            <Text style={styles.subtitle}>
              성지DROP에서 사용할 닉네임을 입력해주세요
            </Text>
          </View>

          {/* 입력 영역 */}
          <View style={styles.inputArea}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  nickname.length > 0 && styles.inputActive,
                ]}
                value={nickname}
                onChangeText={handleNicknameChange}
                placeholder="닉네임 입력"
                placeholderTextColor={Colors.textDim}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                maxLength={MAX_NICKNAME_LENGTH}
              />
              {/* 글자수 표시 */}
              <View style={styles.charCountBadge}>
                <Text
                  style={[
                    styles.charCount,
                    charCount >= MAX_NICKNAME_LENGTH && styles.charCountLimit,
                    charCount >= MIN_NICKNAME_LENGTH && charCount < MAX_NICKNAME_LENGTH && styles.charCountOk,
                  ]}
                >
                  {charCount}/{MAX_NICKNAME_LENGTH}
                </Text>
              </View>
            </View>

            {/* 닉네임 규칙 안내 */}
            <View style={styles.rules}>
              <Text style={[styles.rule, charCount >= MIN_NICKNAME_LENGTH && styles.ruleOk]}>
                {charCount >= MIN_NICKNAME_LENGTH ? '✓' : '·'} 최소 2자 이상
              </Text>
              <Text style={[styles.rule, charCount <= MAX_NICKNAME_LENGTH && charCount > 0 && styles.ruleOk]}>
                {charCount > 0 && charCount <= MAX_NICKNAME_LENGTH ? '✓' : '·'} 최대 12자 이하
              </Text>
            </View>

            {/* 에러 메시지 */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>

          {/* 시작 버튼 */}
          <NeonButton
            label="시작하기"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!isValid || isLoading}
            onPress={handleSubmit}
            style={styles.submitButton}
          />

          {/* 하단 설명 */}
          <Text style={styles.footerNote}>
            닉네임은 나중에 마이페이지에서 변경할 수 있습니다
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.body * 1.6,
  },
  inputArea: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    paddingRight: Spacing.huge,
    color: Colors.textPrimary,
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.bodyLg,
    textAlign: 'center',
  },
  inputActive: {
    borderColor: Colors.dropGreen,
  },
  charCountBadge: {
    position: 'absolute',
    right: Spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  charCount: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  charCountOk: {
    color: Colors.dropGreen,
  },
  charCountLimit: {
    color: Colors.alertRed,
  },
  rules: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.base,
    paddingTop: Spacing.xs,
  },
  rule: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.textDim,
  },
  ruleOk: {
    color: Colors.dropGreen,
  },
  errorBox: {
    backgroundColor: Colors.redOverlay,
    borderWidth: 1,
    borderColor: Colors.alertRed,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  errorText: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.alertRed,
    textAlign: 'center',
  },
  submitButton: {
    marginBottom: Spacing.base,
  },
  footerNote: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.textDim,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
