import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Home from './app/Home/Home';
import Navigation from './app/Navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import * as Notifications from 'expo-notifications';
import { PLAYSOUND, SETBADGE, SHOWALERT } from './app/utils/constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: SHOWALERT,
    shouldPlaySound: PLAYSOUND,
    shouldSetBadge: SETBADGE,
  }),
});

export default function App() {
  return (
    <View style={styles.container} >
      <StatusBar barStyle={"dark-content"} backgroundColor="transparent" />
      <Navigation />
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

