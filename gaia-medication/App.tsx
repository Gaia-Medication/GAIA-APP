import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Navigation from './app/Navigation';
import React, { useState } from 'react';
import * as Notifications from 'expo-notifications';
import { PLAYSOUND, SETBADGE, SHOWALERT } from './app/utils/constants';
import { changeTreatments } from './dao/Storage';
import { notificationForgot } from './app/Handlers/NotificationsHandler';
import { useColorScheme } from "nativewind";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: SHOWALERT,
    shouldPlaySound: PLAYSOUND,
    shouldSetBadge: SETBADGE,
  }),
});

// Remove a scheduled notification
async function removeNotification(notificationId) {
  console.log("Removing notification with id: ", notificationId);
  try {
    await Notifications.dismissNotificationAsync(notificationId);
  } catch (error) {
    console.log("Error removing notification: ", error);
  }
  
}

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
      notificationForgot(response.notification.request.content.data.userName, { medName: takeData.medName, take: takeData.take }, 2)
      break;
    case "lateTake":
      if (minutesDifference <= 240) {
        minutesDifference <= 240 ? takeData.take.taken = true : takeData.take.taken = false;
        changeTreatments(takeData.take);
        console.log("STILL OK")
      } else {
        console.log("TOO LATE")
      }
      console.log(response.notification.request.identifier);
      removeNotification(response.notification.request.identifier);
      break;
    default:
      console.log("Other");
      break;
  }
})


export default function App() {
  const {colorScheme} = useColorScheme()
  return (
    <View style={styles.container} className='bg-white dark:bg-[#131f24]'>
      <StatusBar barStyle={colorScheme=="dark"?"light-content":"dark-content"} backgroundColor={colorScheme=="dark"?"#131f24":"#fff"} />
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

