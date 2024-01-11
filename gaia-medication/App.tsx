import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Home from './app/Home/Home';
import Navigation from './app/Navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import * as Notifications from 'expo-notifications';
import { PLAYSOUND, SETBADGE, SHOWALERT } from './app/utils/constants';
import { changeTreatments } from './dao/Storage';
import { notificationNow } from './app/Handlers/NotificationsHandler';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: SHOWALERT,
    shouldPlaySound: PLAYSOUND,
    shouldSetBadge: SETBADGE,
  }),
});

Notifications.addNotificationResponseReceivedListener(response => {
  const takeData: NotifData = response.notification.request.content.data.notifData;
  const minutesDifference = Math.floor((new Date().getTime() - new Date(takeData.take.date).getTime()) / 60000);
  switch (response.actionIdentifier) {
    case "take":
      minutesDifference < 240 ? takeData.take.taken = true : takeData.take.taken = false;
      changeTreatments(takeData.take);

      break;
    case "snooze":
      console.log("LATER");
      break;
    default:
      console.log("Other");
      break;
  }
})

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

