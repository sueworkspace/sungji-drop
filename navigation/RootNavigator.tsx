import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DealDetailScreen from '../screens/DealDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import RankingScreen from '../screens/RankingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReviewWriteScreen from '../screens/ReviewWriteScreen';
import { Colors } from '../constants';

export type RootStackParamList = {
  Tabs: undefined;
  DealDetail: { dealId: string };
  Notifications: undefined;
  Ranking: undefined;
  Settings: undefined;
  ReviewWrite: { storeId: string; storeName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="DealDetail" component={DealDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="ReviewWrite"
        component={ReviewWriteScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
