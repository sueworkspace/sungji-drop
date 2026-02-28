import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize } from '../constants';
import { PixelText, NeonButton, ScanlineOverlay } from '../components';
import { useAuth } from '../src/contexts/AuthContext';
import { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList>;
type LoginTab = 'phone' | 'email';

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signInWithOtp, verifyOtp, signInWithEmail } = useAuth();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<LoginTab>('phone');

  // 전화번호 OTP 상태
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);

  // 이메일 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // 공통 에러
  const [error, setError] = useState<string | null>(null);

  // 연결 테스트
  const [connStatus, setConnStatus] = useState<string | null>(null);

  // 탭 전환 애니메이션
  const tabIndicatorX = useRef(new Animated.Value(0)).current;

  function switchTab(tab: LoginTab) {
    setActiveTab(tab);
    setError(null);
    Animated.timing(tabIndicatorX, {
      toValue: tab === 'phone' ? 0 : 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }

  // ─── 전화번호 OTP 로그인 ──────────────────────────────────────────────────────

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('010') || digits.startsWith('011')) {
      return `+82${digits.slice(1)}`;
    }
    if (digits.startsWith('82')) {
      return `+${digits}`;
    }
    return digits;
  }

  async function handleSendOtp() {
    const rawPhone = phone.trim();
    if (!rawPhone) {
      setError('전화번호를 입력해주세요.');
      return;
    }
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('올바른 전화번호를 입력해주세요. (예: 010-1234-5678)');
      return;
    }

    setError(null);
    setPhoneLoading(true);
    const formatted = formatPhone(rawPhone);
    const { error: otpError } = await signInWithOtp(formatted);
    setPhoneLoading(false);

    if (otpError) {
      setError(otpError.message || '인증번호 발송에 실패했습니다.');
      return;
    }

    setOtpSent(true);
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) {
      setError('인증번호를 입력해주세요.');
      return;
    }

    setError(null);
    setPhoneLoading(true);
    const formatted = formatPhone(phone.trim());
    const { error: verifyError } = await verifyOtp(formatted, otp.trim());
    setPhoneLoading(false);

    if (verifyError) {
      setError(verifyError.message || '인증번호가 올바르지 않습니다.');
    }
    // 성공 시 AuthContext onAuthStateChange가 자동으로 세션 업데이트
  }

  // ─── 이메일 로그인 ────────────────────────────────────────────────────────────

  async function handleEmailLogin() {
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setError(null);
    setEmailLoading(true);
    const { error: loginError } = await signInWithEmail(email.trim(), password);
    setEmailLoading(false);

    if (loginError) {
      if (
        loginError.message.includes('Invalid login credentials') ||
        loginError.message.includes('invalid_credentials')
      ) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (loginError.message.includes('Email not confirmed')) {
        setError('이메일 인증이 필요합니다. 메일함을 확인해주세요.');
      } else {
        setError(loginError.message || '로그인에 실패했습니다.');
      }
    }
    // 성공 시 AuthContext에서 자동 처리
  }

  // ─── 연결 테스트 ──────────────────────────────────────────────────────────────

  async function handleTestConnection() {
    setConnStatus('테스트 중...');
    try {
      const r = await fetch('https://okrmviftqsrqjfxapyxm.supabase.co/rest/v1/', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcm12aWZ0cXNycWpmeGFweXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTg2MjksImV4cCI6MjA4Nzc5NDYyOX0.Duk13orD42EFLEgBJ8Fj7YnpsfS3H_R61TaIOhXzlrw',
        },
      });
      setConnStatus(`연결 OK (${r.status})`);
    } catch (e: any) {
      setConnStatus(`연결 실패: ${e?.message || '알 수 없는 오류'}`);
    }
  }

  // ─── 소셜 로그인 (준비중) ─────────────────────────────────────────────────────

  function handleSocialLogin(provider: '카카오' | 'Apple') {
    Alert.alert('준비중입니다', `${provider} 로그인은 준비중입니다.`, [
      { text: '확인', style: 'default' },
    ]);
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
          {/* ─── 로고 영역 ─── */}
          <View style={styles.logoArea}>
            <PixelText size="section" color={Colors.dropGreen} glow style={styles.logoText}>
              성지DROP
            </PixelText>
            <Text style={styles.tagline}>성지급 최저가, 실시간 드롭</Text>
            <Text style={styles.taglineEn}>Real prices, dropped.</Text>
          </View>

          {/* ─── 탭 전환 ─── */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'phone' && styles.tabActive]}
              onPress={() => switchTab('phone')}
            >
              <Text style={[styles.tabLabel, activeTab === 'phone' && styles.tabLabelActive]}>
                휴대폰 인증
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'email' && styles.tabActive]}
              onPress={() => switchTab('email')}
            >
              <Text style={[styles.tabLabel, activeTab === 'email' && styles.tabLabelActive]}>
                이메일 로그인
              </Text>
            </TouchableOpacity>
          </View>

          {/* ─── 폼 영역 ─── */}
          <View style={styles.formContainer}>
            {activeTab === 'phone' ? (
              /* ─── 휴대폰 OTP 탭 ─── */
              <View style={styles.form}>
                <View style={styles.fieldGroup}>
                  <PixelText size="label" color={Colors.textMuted} style={styles.fieldLabel}>
                    휴대폰 번호
                  </PixelText>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.inputFlex, otpSent && styles.inputDisabled]}
                      value={phone}
                      onChangeText={(text) => {
                        setPhone(text);
                        setError(null);
                      }}
                      placeholder="010-1234-5678"
                      placeholderTextColor={Colors.textDim}
                      keyboardType="phone-pad"
                      editable={!otpSent}
                    />
                    <NeonButton
                      label={otpSent ? '재발송' : '인증번호 받기'}
                      variant={otpSent ? 'ghost' : 'primary'}
                      size="sm"
                      loading={phoneLoading && !otpSent}
                      onPress={otpSent ? () => { setOtpSent(false); setOtp(''); setError(null); } : handleSendOtp}
                    />
                  </View>
                </View>

                {otpSent && (
                  <View style={styles.fieldGroup}>
                    <PixelText size="label" color={Colors.textMuted} style={styles.fieldLabel}>
                      인증번호
                    </PixelText>
                    <TextInput
                      style={styles.input}
                      value={otp}
                      onChangeText={(text) => {
                        setOtp(text);
                        setError(null);
                      }}
                      placeholder="6자리 인증번호"
                      placeholderTextColor={Colors.textDim}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus
                    />
                    <Text style={styles.otpHint}>
                      인증번호가 문자로 발송되었습니다
                    </Text>
                  </View>
                )}

                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {otpSent && (
                  <NeonButton
                    label="확인"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={phoneLoading}
                    disabled={otp.length < 4 || phoneLoading}
                    onPress={handleVerifyOtp}
                    style={styles.submitButton}
                  />
                )}
              </View>
            ) : (
              /* ─── 이메일 탭 ─── */
              <View style={styles.form}>
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
                      placeholder="비밀번호"
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

                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <NeonButton
                  label="로그인"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={emailLoading}
                  disabled={emailLoading}
                  onPress={handleEmailLogin}
                  style={styles.submitButton}
                />
              </View>
            )}
          </View>

          {/* ─── 소셜 로그인 구분선 ─── */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ─── 소셜 버튼들 ─── */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, styles.kakaoButton]}
              onPress={() => handleSocialLogin('카카오')}
              activeOpacity={0.8}
            >
              <Text style={styles.kakaoText}>카카오로 계속하기</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={() => handleSocialLogin('Apple')}
                activeOpacity={0.8}
              >
                <Text style={styles.appleText}>Apple로 계속하기</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ─── 회원가입 링크 ─── */}
          <View style={styles.signupLinkRow}>
            <Text style={styles.signupLinkText}>아직 계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>회원가입</Text>
            </TouchableOpacity>
          </View>

          {/* ─── 연결 테스트 (디버그) ─── */}
          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={handleTestConnection}
              style={{ paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border, borderRadius: 8 }}
            >
              <Text style={{ fontFamily: FontFamily.korean, fontSize: 12, color: Colors.textMuted }}>
                서버 연결 테스트
              </Text>
            </TouchableOpacity>
            {connStatus && (
              <Text style={{ fontFamily: FontFamily.korean, fontSize: 11, color: connStatus.includes('OK') ? Colors.dropGreen : Colors.alertRed, marginTop: 8 }}>
                {connStatus}
              </Text>
            )}
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

  // 로고
  logoArea: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  logoText: {
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  taglineEn: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // 탭
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.dropGreen,
  },
  tabLabel: {
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.bg,
  },

  // 폼
  formContainer: {
    marginBottom: Spacing.xl,
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
  inputDisabled: {
    opacity: 0.6,
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
  otpHint: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    paddingTop: Spacing.xs,
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
    marginTop: Spacing.xs,
  },

  // 구분선
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.caption,
    color: Colors.textDim,
  },

  // 소셜 버튼
  socialButtons: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  socialButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoText: {
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.body,
    color: '#191919',
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
  },
  appleText: {
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.body,
    color: '#000000',
  },

  // 회원가입 링크
  signupLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  signupLinkText: {
    fontFamily: FontFamily.korean,
    fontSize: FontSize.body,
    color: Colors.textMuted,
  },
  signupLink: {
    fontFamily: FontFamily.koreanBold,
    fontSize: FontSize.body,
    color: Colors.dropGreen,
  },
});
