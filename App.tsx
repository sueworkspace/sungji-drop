import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { Colors } from './constants';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={Colors.bg} />
          <View style={{ flex: 1, backgroundColor: Colors.bg }} onLayout={onLayoutRootView}>
            <RootNavigator />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
