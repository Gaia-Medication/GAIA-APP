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
    const today = new Date();
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
                <View>
                    <Text style={styles.title}>Aujourd'hui</Text>
                    {storedNotifications ? storedNotifications.map((notif, index) => {
                        const notifDate = new Date(notif.date);
                        if (notifDate.toDateString() === today.toDateString()) {
                            return <NotificationDisplay key={index} notif={notif} index={index} onFun={null} />;
                        }
                        return null;
                    }) : null}
                </View>
                <View>
                    <Text style={styles.title}>Cette semaine</Text>
                    {storedNotifications ? storedNotifications.map((notif, index) => {
                        const notifDate = new Date(notif.date);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        if (notifDate >= oneWeekAgo && notifDate <= today) {
                            return <NotificationDisplay key={index} notif={notif} index={index} onFun={null} />;
                        }
                        return null;
                    }) : null}
                </View>
                <View>
                    <Text style={styles.title}>Avant</Text>
                    {storedNotifications ? storedNotifications.map((notif, index) => {
                        const notifDate = new Date(notif.date);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        if (notifDate < oneWeekAgo) {
                            return <NotificationDisplay key={index} notif={notif} index={index} onFun={null} />;
                        }
                        return null;
                    }) : null}
                </View>
                {storedNotifications.length === 0 ? <Text>Aucune notification ENREGISTREE</Text> : 
                <Text>Notifications enregistrées : {storedNotifications.length}</Text>}
            </ScrollView>
        </SafeAreaView>
    );
}
