import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import DisassembleScreen from '../screens/DisassembleScreen';
import WishlistScreen from '../screens/WishlistScreen';
import MyPageScreen from '../screens/MyPageScreen';
import { Colors } from '../constants';

export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Disassemble: undefined;
  Wishlist: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, { color: focused ? Colors.dropGreen : '#444' }]}>{icon}</Text>
      <Text style={[styles.tabLabel, { color: focused ? Colors.dropGreen : '#444' }]}>{label}</Text>
    </View>
  );
}

export default function TabNavigator() {
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
          tabBarIcon: ({ focused }) => <TabIcon icon="▼" label="드롭" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="◎" label="성지맵" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Disassemble"
        component={DisassembleScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⚡" label="해체" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="★" label="찜" focused={focused} />,
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
});
