import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useIsFocused, Route } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { Button, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    requestNotificationPermissions,
    notificationDaily,
    notificationNow,
    notificationForgot,
} from "./../Handlers/NotificationsHandler";
import data from "./../Suivis/treatment.json";
import { getAllTreatments, getUserByID, readList } from "../../dao/Storage";
import * as Icon from "react-native-feather";
import { styles } from "../../style/style";
import NotificationDisplay from "../component/NotificationDisplay";


export default function Notifications({ navigation }) {
    const data = (useRoute().params as { data?: any })?.data;
    const isFocused = useIsFocused();
    const [newNotifications, setNewNotifications] = useState<Notif[]>([]);
    const [storedNotifications, setStoredNotifications] = useState<Notif[]>([]);

    const init = async () => {
        const asyncNotifs = await readList("notifications");
        
            JSON.parse(data).forEach((notif) => {
            if (!asyncNotifs.find((asyncNotif) => asyncNotif.id === notif.id)) {
                asyncNotifs.push(notif);
            }
        })
        setStoredNotifications(asyncNotifs);
        await AsyncStorage.setItem("notifications", JSON.stringify(asyncNotifs));
        
        console.log("Stored Notifs :", asyncNotifs.length);
        console.log(storedNotifications)
    }

    useEffect(() => {
        if (isFocused) {
            console.log("Nav on Notifications Page");
            init();
        }
    }, [isFocused]);

    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

        let dayOfWeek = days[date.getDay()];
        let dayOfMonth = date.getDate();
        let month = months[date.getMonth()];
        let year = date.getFullYear();

        return { day: dayOfWeek, dayOfMonth: dayOfMonth, month: month, year: year };
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {storedNotifications ? storedNotifications.map((notif, index) => (
                    <NotificationDisplay key={index} notif={notif} index={index} onFun={null} />
                )) : null}
            </ScrollView>
        </SafeAreaView>
    );
}
