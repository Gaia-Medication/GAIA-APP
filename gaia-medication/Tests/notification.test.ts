import {
    notificationDaily,
    notificationNow,
    notificationForgot,
    scheduleLocalNotification,
    getDailyNotificationTime,
    requestNotificationPermissions,
    initDailyNotifications,
    initTakeNotifications,
    initLateNotifications,
} from '../app/Handlers/NotificationsHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import treatmentTest1 from './data/treatmentTest1.json';
import treatmentTest2 from './data/treatmentTest2.json';
import * as Notifications from 'expo-notifications';
import NotificationsSettings from '../app/Home/Settings/NotificationsSettings';
import { getDaysTakes, saveNotifs } from '../dao/Storage';
import { device } from 'detox';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-notifications', () => ({
    scheduleNotificationAsync: jest.fn(),
    setNotificationCategoryAsync: jest.fn(),
    cancelAllScheduledNotificationsAsync: jest.fn(),
    getAllScheduledNotificationsAsync: jest.fn(),
    AndroidNotificationPriority: {
        DEFAULT: "DEFAULT",
        HIGH: "HIGH",
        LOW: "LOW",
        MAX: "MAX",
        MIN: "MIN",
    },
}));
let user = {
    userId: '1',
    firstname: "John",
    lastname: "Titor",
    dateOfBirth: "1995-12-17T00:00:00",
    weight: 85,
    gender: "male",
    preference: null,
}
let notificationTime = new Date();
notificationTime.setHours(8, 0, 0, 0);

beforeEach(() => {
    AsyncStorage.clear();
    AsyncStorage.setItem('users', JSON.stringify([user]));
    expect(AsyncStorage.getItem('users')).resolves.toBe(JSON.stringify([user]));
    AsyncStorage.setItem('notificationTime', notificationTime.toISOString());
})

const createTreatmentTest1 = async () => {
    const asyncTreatments = await AsyncStorage.getItem("treatments");
    const asyncTreatmentsParsed = JSON.parse(asyncTreatments);
    const treatment = JSON.parse(JSON.stringify(treatmentTest1));
    console.log("TREATMENT => ", treatment);
    if (asyncTreatmentsParsed == null) {
        await AsyncStorage.setItem("treatments", JSON.stringify([treatment]));
        return;
    } else {
        asyncTreatmentsParsed.push(treatment);
        await AsyncStorage.setItem("treatments", JSON.stringify(asyncTreatmentsParsed));
    }
   
};

const createTreatmentTest2 = async () => {
    const asyncTreatments = await AsyncStorage.getItem("treatments");
    const asyncTreatmentsParsed = JSON.parse(asyncTreatments);
    const treatment = JSON.parse(JSON.stringify(treatmentTest2));
    console.log("TREATMENT => ", treatment);
    if (asyncTreatmentsParsed == null) {
        await AsyncStorage.setItem("treatments", JSON.stringify([treatment]));
        return;
    } else {
        asyncTreatmentsParsed.push(treatment);
        await AsyncStorage.setItem("treatments", JSON.stringify(asyncTreatmentsParsed));
    }
    console.log("TREATMENT ADDED");
};

test('Test Daily Notifications 1', async () => {
    await createTreatmentTest1();
    expect(AsyncStorage.getItem('treatments')).resolves.toBe(JSON.stringify([treatmentTest1]));
    expect(AsyncStorage.getItem("notificationTime")).resolves.toBe(notificationTime.toISOString());   
    let dailyNotifs = await initDailyNotifications(user.firstname, user.userId);
    expect(dailyNotifs.length).toBe(6);
})

test('Test Takes Notifications 1', async () => {
    await createTreatmentTest1();
    let takesNotifs = await initTakeNotifications(user.firstname, user.userId);
    expect(takesNotifs.length).toBe(10);
})

test('Test Late Notifications 1', async () => {
    await createTreatmentTest1();
    let takesNotifs = await initLateNotifications(user.firstname, user.userId);
    expect(takesNotifs.length).toBe(10);
})

test('Test Daily Notifications 2', async () => {
    await createTreatmentTest2();
    expect(AsyncStorage.getItem('treatments')).resolves.toBe(JSON.stringify([treatmentTest2]));
    expect(AsyncStorage.getItem("notificationTime")).resolves.toBe(notificationTime.toISOString());   
    let dailyNotifs = await initDailyNotifications(user.firstname, user.userId);
    expect(dailyNotifs.length).toBe(4);
})

test('Test Takes Notifications 2', async () => {
    await createTreatmentTest2();
    let takesNotifs = await initTakeNotifications(user.firstname, user.userId);
    expect(takesNotifs.length).toBe(8);
})

test('Test Late Notifications 2', async () => {
    await createTreatmentTest2();
    let takesNotifs = await initLateNotifications(user.firstname, user.userId);
    expect(takesNotifs.length).toBe(8);
})

test('Test Saved Notifications 1', async () => {
    await createTreatmentTest1();
    let takesNotifs = await initTakeNotifications(user.firstname, user.userId);
    let lateNotifs = await initLateNotifications(user.firstname, user.userId);
    let dailyNotifs = await initDailyNotifications(user.firstname, user.userId);
    console.log(dailyNotifs.concat(takesNotifs).concat(lateNotifs).length);
    await saveNotifs(dailyNotifs.concat(takesNotifs).concat(lateNotifs))
    .then(async () => {
        const asyncNotifs = await AsyncStorage.getItem("notifications");
        const asyncNotifsParsed = JSON.parse(asyncNotifs);
        console.log(asyncNotifsParsed);
        const asyncNotifsLength = asyncNotifsParsed.length;
        expect(asyncNotifsParsed.length).toBe(26);
        
    });
    
    expect(takesNotifs.length).toBe(10);
})

test('Test Saved Notifications 2', async () => {
    await createTreatmentTest1();
    const savedTreatments = await AsyncStorage.getItem("treatments");
    console.log("SAVED TREATMENTS => ", savedTreatments);
    const TreatmentsParsed = JSON.parse(savedTreatments);
    console.log("TREATMENT PARSED => ", TreatmentsParsed);
    let takesNotifs = await initTakeNotifications(user.firstname, user.userId);
    let lateNotifs = await initLateNotifications(user.firstname, user.userId);
    let dailyNotifs = await initDailyNotifications(user.firstname, user.userId);
    console.log(dailyNotifs.concat(takesNotifs).concat(lateNotifs).length);
    await saveNotifs(dailyNotifs.concat(takesNotifs).concat(lateNotifs))
    let newDate = new Date();
    newDate.setHours(20, 0, 0, 0);
    TreatmentsParsed[0].instructions[0].takes[0].date = newDate.toISOString()
    await AsyncStorage.setItem("treatments", JSON.stringify(TreatmentsParsed));
    takesNotifs = await initTakeNotifications(user.firstname, user.userId);
    lateNotifs = await initLateNotifications(user.firstname, user.userId);
    dailyNotifs = await initDailyNotifications(user.firstname, user.userId);
    await saveNotifs(dailyNotifs.concat(takesNotifs).concat(lateNotifs))
    .then(async () => {
        const asyncNotifs = await AsyncStorage.getItem("notifications");
        const asyncNotifsParsed = JSON.parse(asyncNotifs);
        console.log(asyncNotifsParsed);
        const asyncNotifsLength = asyncNotifsParsed.length;
        expect(asyncNotifsParsed.length).toBe(27);
    });
    
    expect(takesNotifs.length).toBe(10);
})
