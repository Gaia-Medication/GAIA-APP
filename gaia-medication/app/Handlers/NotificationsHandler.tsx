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

export const notificationDaily = async (userName, data: NotifData[], date) => {
  const notificationTime = new Date(date);
  notificationTime.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);
  let content = "Aujourd'hui : \n\n";
  data.forEach((d) => {
    const str = `💊 ${d.medName} à ${formatDate(new Date(d.take.date)).hours}h${formatDate(new Date(d.take.date)).minutes}\n`
    content += str;
  })
  console.log("content", content);
  return await scheduleLocalNotification(
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

export const notificationNow = async (userName, data: NotifData) => {
  const notificationTime = new Date(data.take.date);
  notificationTime.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);
  return await scheduleLocalNotification(
    "C'est le moment !",
    userName,
    `💊 ${data.medName} à ${formatDate(new Date(data.take.date)).hours}h${formatDate(new Date(data.take.date)).minutes}`,
    { notifData: data, userName: userName },
    "default",
    "default",
    Notifications.AndroidNotificationPriority.HIGH,
    "reminder",
    notificationTime
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
    buttonTitle: 'Rappeler dans 5 minutes',
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

export const initDailyNotifications = async (userName, userId) => {
  console.log("initDailyNotifications");
  const notificationTime = await getDailyNotificationTime();
  const treatmentsDays = await getDaysTakes();
  const arrayOfNotifications: Notif[] = [];
  Notifications.cancelAllScheduledNotificationsAsync();

  for (const dateKey in treatmentsDays) {
    let dateNotification = new Date(dateKey);
    dateNotification.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);

    let dataArray: NotifData[] = [];
    if (treatmentsDays.hasOwnProperty(dateKey)) {
      const takesForDate = treatmentsDays[dateKey];

      const d = new Date(dateKey)
      d.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);

      takesForDate.forEach((take) => {
        dataArray.push({ medName: take.medName, take: take })
      });
    }
    try {
      let dateNotification = new Date(dateKey);
      dateNotification.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);
      const notif = await notificationDaily(userName, dataArray, dateNotification)
      console.log('dateNotification', dateNotification)
      const returnedNotif: Notif = {
        notifId: notif,
        userId: userName,
        date: dateNotification,
        type: "daily",
        datas: dataArray,
      };
      arrayOfNotifications.push(returnedNotif);
    } catch (error) {
      console.log(error);
    } finally {
      dataArray = [];
    }
  }
  return arrayOfNotifications;
}

export const initTakeNotifications = async (userName, userId) => {
  console.log("initTakeNotifications");
  const notificationTime = await getDailyNotificationTime();
  const treatmentsDays = await getDaysTakes();
  console.log("treatmentsDays", treatmentsDays);
  const arrayOfNotifications: Notif[] = [];
  Notifications.cancelAllScheduledNotificationsAsync();

  for (const dateKey in treatmentsDays) {

    for (const take of treatmentsDays[dateKey]) {
      console.log("take", take);
      
      try {
        const dateNotification = new Date(take.date);
        dateNotification.setHours(dateNotification.getHours(), dateNotification.getMinutes(), 0, 0);
        console.log("dateNotification", dateNotification);
        if (dateNotification >= new Date()) {
          console.log("take", take);
          
          const notif = await notificationNow(userName, { medName: take.medName, take: take })
          const returnedNotif: Notif = {
            notifId: notif,
            userId: userName,
            date: dateNotification,
            type: "take",
            datas: [{
              medName: take.medName,
              take: take,
            }]
          };
          arrayOfNotifications.push(returnedNotif);
        }

      } catch (error) {
        console.log(error);
      }
    }

  }
  console.log("END");
  return arrayOfNotifications;
}