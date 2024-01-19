import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Navigation from './app/Navigation';
import React from 'react';
import * as Notifications from 'expo-notifications';
import { PLAYSOUND, SETBADGE, SHOWALERT } from './app/utils/constants';
import { changeTreatments } from './dao/Storage';
import { notificationForgot } from './app/Handlers/NotificationsHandler';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: SHOWALERT,
    shouldPlaySound: PLAYSOUND,
    shouldSetBadge: SETBADGE,
  }),
});

// Reception des réponses des notifications
Notifications.addNotificationResponseReceivedListener(response => {
  const takeData: NotifData = response.notification.request.content.data.notifData;
  const minutesDifference = Math.floor((new Date().getTime() - new Date(takeData.take.date).getTime()) / 60000);
  switch (response.actionIdentifier) {
    case "take":
      minutesDifference <= 240 ? takeData.take.taken = true : takeData.take.taken = false;
      changeTreatments(takeData.take);

      break;
    case "snooze":
        notificationForgot(response.notification.request.content.data.userName, { medName: takeData.medName, take: takeData.take }, 1)
      break;
    case "lateTake":
      if (minutesDifference <= 240) {
        minutesDifference <= 240 ? takeData.take.taken = true : takeData.take.taken = false;
      changeTreatments(takeData.take);
        console.log("STILL OK")
      } else {
        console.log("TOO LATE")
      }
      break;
    case "lateSnooze":
      if (minutesDifference + 10 <= 240) {
        console.log("STILL OK")
        notificationForgot(response.notification.request.content.data.userName, { medName: takeData.medName, take: takeData.take }, 10)
      } else {
        console.log("TOO LATE")
      }
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

