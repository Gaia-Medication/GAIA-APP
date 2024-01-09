import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDaysTakes } from '../../dao/Storage';

//--------------------//
const formatDate = (date) => {
  if (!(date instanceof Date)) {
    console.error("Invalid date");
    return null;
  }

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  let dayOfWeek = days[date.getDay()];
  let dayOfMonth = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let hours = date.getHours().toString()
  let minutes = date.getMinutes().toString().padStart(2, '0')

  return { day: dayOfWeek, dayOfMonth: dayOfMonth, month: month, year: year, hours: hours, minutes: minutes };
};

export const getDailyNotificationTime = async () => {
  const storedTime = await AsyncStorage.getItem('notificationTime');
  if (storedTime) {
    return new Date(storedTime);
  }
}

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }
  }
  return true;
};

export const scheduleLocalNotification = async (
  title: string,
  subtitle: string,
  body: string,
  data = {},
  sound: string,
  color: string,
  priority: Notifications.AndroidNotificationPriority,
  categoryIdentifier: string,
  date: Date // Add a new parameter for the notification date
) => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      subtitle,
      body,
      data,
      sound,
      color,
      priority,
      categoryIdentifier,
    },
    trigger: {
      date, // Set the trigger date
    },
  });
  return notificationId;
};

//--------------------//

export const notificationDaily = async (userName, data: {hour: Date, med: string}[], date) => {
  const notificationTime = new Date(date);
  notificationTime.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);
  let content = "Aujourd'hui : \n\n";
  data.forEach((d) => {
    const str = `💊 ${d.med} à ${formatDate(d.hour).hours}h${formatDate(d.hour).minutes}\n`
    content += str;
  })
  console.log("content", content);
  await scheduleLocalNotification(
    "Bonjour ! ",
    userName,
    content,
    { data: null },
    "default",
    "default",
    Notifications.AndroidNotificationPriority.DEFAULT,
    null,
    notificationTime
  );
}

export const notificationNow = async () => {
  scheduleLocalNotification(
    "🦠 Rappel ",
    "Votre traitement",
    "C'est le moment ! : \n💊 Doliprane 700",
    { data: "data" },
    "default",
    "default",
    Notifications.AndroidNotificationPriority.DEFAULT,
    "reminder",
    new Date()
  );
}

export const notificationForgot = async () => {
  scheduleLocalNotification(
    "⚠️ N'oubliez pas !",
    "Votre traitement",
    "Avez vous pensé à prendre votre : \n\n 💊 Doliprane 700 ?",
    { data: "data" },
    "default",
    "red",
    Notifications.AndroidNotificationPriority.HIGH,
    "alertReminder",
    new Date()
  );
}

//--------------------//

Notifications.setNotificationCategoryAsync('reminder', [
  {
    identifier: 'take',
    buttonTitle: "Pris !",
    options: {
      isDestructive: false,
      isAuthenticationRequired: false,
    },
  },
  {
    identifier: 'snooze',
    buttonTitle: 'Rappeler dans 30 minutes',
    options: {
      isDestructive: false,
      isAuthenticationRequired: false,
    },
  },
]);

Notifications.setNotificationCategoryAsync('alertReminder', [
  {
    identifier: 'take',
    buttonTitle: 'Pris !',
    options: {
      isDestructive: false,
      isAuthenticationRequired: false,
    },
  },
  {
    identifier: 'snooze',
    buttonTitle: 'Rappeler dans 15 minutes',
    options: {
      isDestructive: false,
      isAuthenticationRequired: false,
    },
  },
]);

//--------------------//

export const initDailyNotifications = async (userName) => {
  console.log("initDailyNotifications");
  const notificationTime = await getDailyNotificationTime();
  const treatmentsDays = await getDaysTakes();
  Notifications.cancelAllScheduledNotificationsAsync();

  for (const dateKey in treatmentsDays) {
    let dateNotification = new Date(dateKey);
    dateNotification.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);
    console.log("dateNotification", dateNotification);

    let dataArray = [];
    if (treatmentsDays.hasOwnProperty(dateKey)) {
      const takesForDate = treatmentsDays[dateKey];

      const d =new Date(dateKey)
      d.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);
      
      takesForDate.forEach((take) => {
        console.log("TAKE", take.date)
        dataArray.push({hour: new Date(take.date), med: take.medName})
        console.log("DATAARRAY", dataArray);
      });
    }
    try {
      let dateNotification = new Date(dateKey);
      dateNotification.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);
      await notificationDaily(userName, dataArray, dateNotification)
    } catch (error) {
      console.log(error);
    } finally {
      dataArray = [];
    }
  }
}