import {
    notificationDaily,
    notificationNow,
    notificationForgot,
    scheduleLocalNotification,
    getDailyNotificationTime,
    requestNotificationPermissions,
    initDailyNotifications,
    initTakeNotifications
} from '../app/Handlers/NotificationsHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import treatmentTest1 from './data/treatmentTest1.json';
import * as Notifications from 'expo-notifications';
import NotificationsSettings from '../app/Home/Settings/NotificationsSettings';
import { getDaysTakes } from '../dao/Storage';
import { device } from 'detox';

// jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
// jest.mock('expo-notifications', () => ({
//     scheduleNotificationAsync: jest.requireActual,
//     setNotificationCategoryAsync: jest.fn(),
//     cancelAllScheduledNotificationsAsync: jest.fn(),
//     getAllScheduledNotificationsAsync: jest.fn(),
//     AndroidNotificationPriority: {
//         DEFAULT: "DEFAULT",
//         HIGH: "HIGH",
//         LOW: "LOW",
//         MAX: "MAX",
//         MIN: "MIN",
//     },
// }));
// let user = {
//     userId: '1',
//     firstname: "John",
//     lastname: "Titor",
//     dateOfBirth: "1995-12-17T00:00:00",
//     weight: 85,
//     gender: "male",
//     preference: null,
// }
// let notificationTime = new Date();
// notificationTime.setHours(8, 0, 0, 0);

// beforeEach(() => {
//     AsyncStorage.clear();
//     AsyncStorage.setItem('users', JSON.stringify([user]));
//     expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
//     expect(AsyncStorage.getItem('users')).resolves.toBe(JSON.stringify([user]));
//     AsyncStorage.setItem('notificationTime', notificationTime.toISOString());
// })

// const createTreatmentTest1 = async () => {
//     const treatment = JSON.parse(JSON.stringify(treatmentTest1));
//     await AsyncStorage.setItem("treatments", JSON.stringify(treatment));
// };

// test('Test Daily Notifications 1', async () => {
//     await createTreatmentTest1();
//     expect(AsyncStorage.getItem('treatments')).resolves.toBe(JSON.stringify(treatmentTest1));
//     expect(AsyncStorage.getItem("notificationTime")).resolves.toBe(notificationTime.toISOString());   
//     let dailyNotifs = await initDailyNotifications(user.firstname, user.userId);
//     let all = await Notifications.getAllScheduledNotificationsAsync();
//     expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
//     //expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
//     expect(dailyNotifs.length).toBe(6);
//     expect(Notifications.getAllScheduledNotificationsAsync.length).toBe(1);
// })

// test('Test Takes Notifications 1', async () => {
//     await createTreatmentTest1();
//     let takesNotifs = await initTakeNotifications(user.firstname, user.userId);
//     //expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
//     expect(takesNotifs.length).toBe(10);
//     expect(Notifications.getAllScheduledNotificationsAsync.length).toBe(1);
//     let all = await Notifications.getAllScheduledNotificationsAsync();
// })

// test('Test Receive Notifications', async () => {
//     await createTreatmentTest1();
//     let dailyNotifs = await initDailyNotifications(user.firstname, user.userId);
//     console.log(dailyNotifs);
//     const originalDate = global.Date;
//     const fixedDate = new Date('2024-02-20T12:00:00');
//     global.Date = jest.fn(() => fixedDate) as unknown as typeof Date;
//     global.Date = originalDate;
// })

describe('Test Notifications', () => {
    beforeAll(async () => {
        await device.launchApp();
      });
})