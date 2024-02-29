import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDailyNotificationTime } from '../../Handlers/NotificationsHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';


const NotificationsSettings = () => {
    const [notificationTime, setNotificationTime] = useState<Date>(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleNotificationTimeChange = (event, selectedDate) => {
        setShowTimePicker(false);
        selectedDate.setSeconds(0, 0)
        setNotificationTime(selectedDate);
        AsyncStorage.setItem('notificationTime', selectedDate.toISOString());
    };

    const init = async () => {
        await getDailyNotificationTime().then((time) => {
            console.log(time);
            if (time) {
                setNotificationTime(time);
            }
        })
    }

    // Renvoi l'heure au format HH:MM
    const formatHour = (hour) => {
        if (hour instanceof Date) {
            const hours = hour.getHours();
            const minutes = hour.getMinutes();
            const formattedTime = `${hours.toString()}:${minutes.toString().padStart(2, '0')}`;
            return formattedTime;
        }
        return "";
    };

    const requestNotificationPermissions = async () => {
        await Notifications.requestPermissionsAsync().then((status) => {
            console.log("STATUS => ", status);
            if (status.granted) {
                Alert.alert('Notifications activées', 'Vous pouvez actuellement recevoir des notifications de Gaïa');
            } else {
                Alert.alert(
                    'Permissions de notification requises',
                    'Pour activer les notifications, accedez aux paramètres de l\'application.',
                    [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Paramètres', onPress: () => Linking.openSettings() }
                    ]
                );
            }
        });

    }
    useEffect(() => {
        init()
    }, []);

    return (
        <View style={styles.container}>
            <Text>Notifications Settings</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ display: 'flex', flexDirection: 'row', padding: 10, backgroundColor: "#CCCCCC" }}>
                <Text>Daily Notification Time</Text>
                {notificationTime ? (
                    <Text>{formatHour(notificationTime)}</Text>
                ) : (
                    <Text>Not set</Text>
                )}
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    value={notificationTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleNotificationTimeChange}
                />
            )}
            <TouchableOpacity onPress={() => requestNotificationPermissions()} style={{ display: 'flex', flexDirection: 'row', padding: 10, backgroundColor: "#CCCCCC" }}>
                <Text>Autorisation notifications</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default NotificationsSettings;
