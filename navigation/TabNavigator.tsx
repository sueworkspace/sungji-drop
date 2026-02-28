import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import QuotesScreen from '../screens/QuotesScreen';
import ChatListScreen from '../screens/ChatListScreen';
import MyPageScreen from '../screens/MyPageScreen';
import { Colors } from '../constants';
import { useChatRooms } from '../src/hooks/useChatRooms';

export type { TabParamList } from './types';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ icon, label, focused, badge }: { icon: string; label: string; focused: boolean; badge?: number }) {
  return (
    <View style={styles.tabItem}>
      <View>
        <Text style={[styles.tabIcon, { color: focused ? Colors.dropGreen : '#444' }]}>{icon}</Text>
        {badge != null && badge > 0 && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.tabLabel, { color: focused ? Colors.dropGreen : '#444' }]}>{label}</Text>
    </View>
  );
}

export default function TabNavigator() {
  const { chatRooms } = useChatRooms();
  const unreadChats = chatRooms.reduce((sum, r) => sum + (r.user_unread_count || 0), 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="▼" label="홈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Quotes"
        component={QuotesScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="▦" label="견적함" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="◈" label="채팅" focused={focused} badge={unreadChats} />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="●" label="MY" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 6,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.alertRed,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  tabBadgeText: {
    fontFamily: 'PressStart2P',
    fontSize: 5,
    color: '#fff',
  },
});
