import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import NicknameSetupScreen from './screens/NicknameSetupScreen';
import { Colors } from './constants';
import { AuthStackParamList } from './navigation/types';

// ─── 스플래시 화면 유지 (폰트 로딩 전) ─────────────────────────────────────────
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

// ─── Auth 인지 네비게이터 ─────────────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AppNavigator() {
  const { session, isLoading, isNewUser } = useAuth();

  // 로딩 중 — 세션 확인 전
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.bg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={Colors.dropGreen} />
      </View>
    );
  }

  // 비로그인 상태 — 인증 스택
  if (!session) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Signup" component={SignupScreen} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  // 로그인했지만 닉네임 미설정 — 닉네임 설정 화면
  if (isNewUser) {
    return (
      <NavigationContainer>
        <NicknameSetupScreen />
      </NavigationContainer>
    );
  }

  // 완전 인증된 사용자 — 메인 앱 (RootNavigator가 Tabs + Stack 전체를 담당)
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

// ─── 메인 앱 컴포넌트 ─────────────────────────────────────────────────────────

export default function App() {
  const [fontsLoaded] = useFonts({
    PressStart2P: require('./assets/fonts/PressStart2P-Regular.ttf'),
    'NotoSansKR-Regular': require('./assets/fonts/NotoSansKR-Regular.ttf'),
    'NotoSansKR-Bold': require('./assets/fonts/NotoSansKR-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && Platform.OS !== 'web') {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 폰트 로딩 완료 전에는 빈 화면 렌더링 (SplashScreen이 표시 중)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <View
            style={{ flex: 1, backgroundColor: Colors.bg }}
            onLayout={onLayoutRootView}
          >
            <StatusBar style="light" backgroundColor={Colors.bg} />
            <AppNavigator />
          </View>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
