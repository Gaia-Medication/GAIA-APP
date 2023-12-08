import * as Notifications from 'expo-notifications';

//--------------------//

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
    categoryIdentifier: string
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
    trigger: null, // You can specify a trigger if needed.
  });
  return notificationId;
};

//--------------------//

export const notificationDaily = async () => {
  scheduleLocalNotification(
    "🦠 Rappel ", 
    "Votre traitement", 
    "Aujourd'hui :\n\n 💊 Doliprane 700\n 💊 Aspirine\n 💊 Betadine", 
    { data: "data" }, 
    "default", 
    "default", 
    Notifications.AndroidNotificationPriority.DEFAULT,
    "reminder"
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
    "reminder"
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
    "alertReminder"
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
