import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { styles } from "../../style/style";
import { getUserByID } from "../../data/Storage";
import * as Icon from "react-native-feather";


const NotificationDisplay = ({ notif, index, onFun }) => {
    const [expanded, setExpanded] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const init = () => {
        const initUser = async () => {
            const currentId = notif.datas[0].take.userId;
            const current = await getUserByID(JSON.parse(currentId));
            setUser(current);
        };
        initUser();
        console.log("Notif", notif);
    };

    function formatTimeDifference(date) {
        const now = new Date();
        date = new Date(date);
        const diffInMilliseconds = now.getTime() - date.getTime();
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays >= 2) {
            return `Il y a ${diffInDays} jours`;
        } else if (diffInDays === 1) {
            return 'hier';
        } else if (diffInHours >= 1) {
            return `il y a ${diffInHours}h`;
        } else if (diffInMinutes >= 1) {
            return `il y a ${diffInMinutes}min`;
        } else {
            return "à l'instant";
        }
    }

    const formatHour = (hour) => {
        if (hour instanceof Date) {
            const hours = hour.getHours();
            const minutes = hour.getMinutes();
            const formattedTime = `${hours.toString()}:${minutes.toString().padStart(2, '0')}`;
            return formattedTime;
        }
        return "";
    };

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

    const avatarColors = [
        "#FFCF26",
        "#268AFF",
        "#1FD13C",
        "#FF4D26",
        "#FF8E26",
        "#C7FF26",
        "#276A0F",
        "#41D0D9",
        "#343ADD",
        "#9234DD",
        "#EA5CCA",
    ];

    useEffect(() => {
        init();
    }, []);

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            margin: 10,
        }}>
            <View
            style={{
                height: "100%",
                width: 5,
                backgroundColor: notif.type === "daily" ? "blue" : notif.type == "take" ? "green" : "red",
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                marginLeft: 10,
            }}
            />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    
                    padding: 10,
                    borderRadius: 10,
                    margin: 10,
                    gap: 20,
                }}
            >
                <View>
                    <Text
                        style={[
                            styles.AvatarIcon,
                            notif.datas[0].take.userId
                                ? { backgroundColor: avatarColors[notif.datas[0].take.userId - 1] }
                                : { backgroundColor: "#8E8E8E" },
                        ]}
                    >
                        {user ? user.firstname.charAt(0) + user.lastname.charAt(0) : "XY"}
                    </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", alignSelf: 'stretch' }}>
                        {notif.datas.map((data, index) => {
                            return (
                                <View key={index} style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "90%" }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail">{"💊 "+data.take.medName}</Text>
                                    <Text>{formatHour(data.take.date)}</Text>
                                </View>
                            );
                        }
                        )}

                    </View>
                    <Text>{notif ? notif.userName : null}</Text>
                    <Text>{formatTimeDifference(notif.date)}</Text>
                </View>
            </View>


        </View>

    );
};

export default NotificationDisplay;
