import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDaysTakes } from '../../dao/Storage';

// Renvoi la date au format { day: dayOfWeek, dayOfMonth: dayOfMonth, month: month, year: year, hours: hours, minutes: minutes }
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

// Renvoi l'heure de notification quotidienne
export const getDailyNotificationTime = async () => {
  const storedTime = await AsyncStorage.getItem('notificationTime');
  if (storedTime) {
    return new Date(storedTime);
  }
}

// Demande les permissions pour les notifications
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

// Créer une notification locale
export const scheduleLocalNotification = async (
  title: string,
  subtitle: string,
  body: string,
  data = {},
  sound: string,
  color: string,
  priority: Notifications.AndroidNotificationPriority,
  categoryIdentifier: string,
  sticky: boolean,
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
      sticky,
    },
    trigger: {
      date, // Set the trigger date
    },
  });
  return notificationId;
};

//--------------------//

// Creer une notification quotidienne
export const notificationDaily = async (userName, data: NotifData[], date) => {
  const notificationTime = new Date(date);
  notificationTime.setHours(notificationTime.getHours(), notificationTime.getMinutes(), 0, 0);
  let content = "Aujourd'hui : \n\n";
  data.forEach((d) => {
    const str = `💊 ${d.medName} à ${formatDate(new Date(d.take.date)).hours}h${formatDate(new Date(d.take.date)).minutes}\n`
    content += str;
  })
  return await scheduleLocalNotification(
    "Bonjour ! ",
    userName,
    content,
    { data: null },
    "default",
    "default",
    Notifications.AndroidNotificationPriority.DEFAULT,
    null,
    false,
    notificationTime,
  );
}

// Creer une notification de prise
export const notificationNow = async (userName, data: NotifData, remainigTime) => {
  const notificationTime = new Date(data.take.date);
  notificationTime.setHours(notificationTime.getHours(), notificationTime.getMinutes() + remainigTime, 0, 0);
  return await scheduleLocalNotification(
    "C'est le moment !",
    userName,
    `💊 ${data.medName} à ${formatDate(new Date(data.take.date)).hours}h${formatDate(new Date(data.take.date)).minutes}`,
    { notifData: data, userName: userName },
    "default",
    "default",
    Notifications.AndroidNotificationPriority.DEFAULT,
    "reminder",
    false,
    notificationTime
  );
}

// Creer une notification de prise oubliée
export const notificationForgot = async (userName, data: NotifData, lateMin) => {
  let notificationTime = new Date(data.take.date);
  notificationTime.setHours(notificationTime.getHours(), notificationTime.getMinutes() + (lateMin + 1), 0, 0);
  console.log("notificationTime", notificationTime); 
  

  return scheduleLocalNotification(
    "⚠️ N'oubliez pas !",
    userName,
    `💊 ${data.medName}`,
    { notifData: data, userName: userName, remainigTime: lateMin },
    "default",
    "red",
    Notifications.AndroidNotificationPriority.MAX,
    "alertReminder",
    true,
    notificationTime
  );
}

//--------------------//
// Création des catégories de notifications

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
    buttonTitle: 'Rappeler dans 10 minutes',
    options: {
      isDestructive: false,
      isAuthenticationRequired: false,
    },
  },
]);

Notifications.setNotificationCategoryAsync('alertReminder', [
  {
    identifier: 'lateTake',
    buttonTitle: 'Pris !',
    options: {
      isDestructive: false,
      isAuthenticationRequired: false,
    },
  }
]);

//--------------------//

// Initialisation des notifications quotidiennes
export const initDailyNotifications = async (userName, userId) => {
  console.log("initDailyNotifications");
  const notificationTime = await getDailyNotificationTime();
  const treatmentsDays = await getDaysTakes();
  const arrayOfNotifications: Notif[] = [];
  Notifications.cancelAllScheduledNotificationsAsync();
  if(notificationTime){
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
    } finally {
      dataArray = [];
    }
  }}
  return arrayOfNotifications;
}

// Initialisation des notifications de prise
export const initTakeNotifications = async (userName, userId) => {
  console.log("initTakeNotifications");
  const notificationTime = await getDailyNotificationTime();
  const treatmentsDays = await getDaysTakes();
  const arrayOfNotifications: Notif[] = [];

  for (const dateKey in treatmentsDays) {

    for (const take of treatmentsDays[dateKey]) {
      
      try {
        const dateNotification = new Date(take.date);
        if(dateNotification){
        dateNotification.setHours(dateNotification.getHours(), dateNotification.getMinutes(), 0, 0);
        console.log("dateNotification", dateNotification);
        if (dateNotification >= new Date()) {
          let notif = null
          try {
            notif = await notificationNow(userName, { medName: take.medName, take: take }, 1)
          } catch (error) {
            console.log(error);
          }
          
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
        }}

      } catch (error) {
        console.log(error);
      }
    }

  }
  return arrayOfNotifications;
}

// Initialisation des notifications de prise oubliée
export const initLateNotifications = async (userName, userId) => {
  console.log("initLateNotifications");
  const treatmentsDays = await getDaysTakes();
  const arrayOfNotifications: Notif[] = [];
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 4, currentDate.getMinutes(), 0, 0);

  for (const dateKey in treatmentsDays) {

    for (const take of treatmentsDays[dateKey]) {

      try {
        const dateNotification = new Date(take.date);
        dateNotification.setHours(dateNotification.getHours(), dateNotification.getMinutes(), 0, 0);
        if (dateNotification.getTime() >= currentDate.getTime() && take.taken === false) {
          if (dateNotification.getTime() < new Date().getTime()) {
            console.log("YOU'RE LATE")
            const newDate = new Date();
            let minDiff = Math.round((newDate.getTime() - dateNotification.getTime()) / 60000);
            console.log("AND YOU'RE LATE BY", minDiff, "MINUTES")
            const notif = await notificationForgot(userName, { medName: take.medName, take: take }, minDiff)
            const returnedNotif: Notif = {
              notifId: notif,
              userId: userName,
              date: dateNotification,
              type: "late",
              datas: [{
                medName: take.medName,
                take: take,
              }]
            };
            arrayOfNotifications.push(returnedNotif);
          } else {
            console.log("YOU LL BE LATE")
            const notif = await notificationForgot(userName, { medName: take.medName, take: take }, 240)
            const returnedNotif: Notif = {
              notifId: notif,
              userId: userName,
              date: dateNotification,
              type: "late",
              datas: [{
                medName: take.medName,
                take: take,
              }]
            };
            arrayOfNotifications.push(returnedNotif);
          }
        }

      } catch (error) {
        console.log(error);
      }
    }

  }
  return arrayOfNotifications;
}