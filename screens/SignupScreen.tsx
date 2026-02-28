import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize } from '../constants';
import { PixelText, NeonButton, ScanlineOverlay } from '../components';
import { useAuth } from '../src/contexts/AuthContext';
import { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export default function SignupScreen() {
  const navigation = useNavigation<Nav>();
  const { signUpWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validate(): string | null {
    if (!email.trim()) return '이메일을 입력해주세요.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return '유효한 이메일 주소를 입력해주세요.';
    if (password.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.';
    if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다.';
    return null;
  }

  async function handleSignup() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    const { error: signupError } = await signUpWithEmail(email.trim(), password);

    setIsLoading(false);

    if (signupError) {
      if (signupError.message.includes('already registered')) {
        setError('이미 사용 중인 이메일입니다.');
      } else {
        setError(signupError.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <ScanlineOverlay />
        <View style={styles.successContainer}>
          <PixelText size="section" color={Colors.dropGreen} glow style={styles.successIcon}>
            ★
          </PixelText>
          <PixelText size="section" color={Colors.dropGreen} glow style={styles.successTitle}>
            가입 완료!
          </PixelText>
          <Text style={styles.successBody}>
            인증 이메일을 발송했습니다.{'\n'}
            이메일을 확인하고 링크를 클릭해주세요.
          </Text>
          <NeonButton
            label="로그인으로 이동"
            variant="primary"
            size="lg"
            fullWidth
            style={styles.successButton}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScanlineOverlay />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 뒤로가기 */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <PixelText size="label" color={Colors.textMuted}>
              {'< 뒤로'}
            </PixelText>
          </TouchableOpacity>

          {/* 헤더 */}
          <View style={styles.header}>
            <PixelText size="section" color={Colors.dropGreen} glow>
              회원가입
            </PixelText>
            <Text style={styles.subtitle}>성지DROP 계정을 만들어보세요</Text>
          </View>

          {/* 폼 */}
          <View style={styles.form}>
            {/* 이메일 */}
            <View style={styles.fieldGroup}>
              <PixelText size="label" color={Colors.textMuted} style={styles.fieldLabel}>
                이메일
              </PixelText>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                placeholder="example@email.com"
                placeholderTextColor={Colors.textDim}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* 비밀번호 */}
            <View style={styles.fieldGroup}>
              <PixelText size="label" color={Colors.textMuted} style={styles.fieldLabel}>
                비밀번호
              </PixelText>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  placeholder="6자 이상"
                  placeholderTextColor={Colors.textDim}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeText}>{showPassword ? '숨김' : '표시'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 비밀번호 확인 */}
            <View style={styles.fieldGroup}>
              <PixelText size="label" color={Colors.textMuted} style={styles.fieldLabel}>
                비밀번호 확인
              </PixelText>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={passwordConfirm}
                  onChangeText={(text) => {
                    setPasswordConfirm(text);
                    setError(null);
                  }}
                  placeholder="비밀번호 재입력"
                  placeholderTextColor={Colors.textDim}
                  secureTextEntry={!showPasswordConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  <Text style={styles.eyeText}>{showPasswordConfirm ? '숨김' : '표시'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 에러 메시지 */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* 가입 버튼 */}
            <NeonButton
              label="가입하기"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
              onPress={handleSignup}
            />
          </View>

          {/* 로그인 링크 */}
          <View style={styles.loginLinkRow}>
            <Text style={styles.loginLinkText}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>로그인</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  backButton: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  form: {
    gap: Spacing.base,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    color: Colors.textPrimary,
    fontFamily: FontFamily.korean,
    fontSize: FontSize.body,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  inputFlex: {
    flex: 1,
  },
  eyeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  eyeText: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  errorBox: {
    backgroundColor: Colors.redOverlay,
    borderWidth: 1,
    borderColor: Colors.alertRed,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.alertRed,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  loginLinkText: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.body,
    color: Colors.textMuted,
  },
  loginLink: {
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.body,
    color: Colors.dropGreen,
  },
  // 가입 완료 상태
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.base,
  },
  successIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  successTitle: {
    marginBottom: Spacing.sm,
  },
  successBody: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.body * 1.7,
    marginBottom: Spacing.xl,
  },
  successButton: {
    marginTop: Spacing.sm,
  },
});
