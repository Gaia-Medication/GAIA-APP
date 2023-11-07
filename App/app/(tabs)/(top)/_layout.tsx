import { StyleSheet, useColorScheme } from 'react-native';

import { Text, View } from '../../../components/Themed';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../../../constants/Colors';
import SuivisScreen from './suivis';
import StockScreen from './stock';
import JournalScreen from './journal';

const Tab = createMaterialTopTabNavigator();
export default function TopTabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tab.Screen
        name="Suivis"
        component={SuivisScreen}
        options={{ tabBarLabel: 'Suivis' }}
      />
      <Tab.Screen
        name="Stock"
        component={StockScreen}
        options={{ tabBarLabel: 'Stock' }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{ tabBarLabel: 'Journal' }}
      />
    </Tab.Navigator>
  );
}