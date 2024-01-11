import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { addTake, dropTake } from '../../dao/Storage';
import * as Icon from "react-native-feather";

const TakeItem = ({ item }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [modifiedDate, setModifiedDate] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showNewTimePicker, setShowNewTimePicker] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const [take, setTake] = useState<Take>(null);

    useEffect(() => {
        item.date = new Date(item.date);
        setTake(item);
    })

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

    const onTimeChange = async (event, selectedTime) => {
        setShowNewTimePicker(false);
        if (selectedTime) {
            const newDateTime = new Date(tempDate);
            newDateTime.setHours(selectedTime.getHours());
            newDateTime.setMinutes(selectedTime.getMinutes());
            console.log(newDateTime);
            await dropTake(take)
            take.date = newDateTime;
            await addTake(take).then(() => {
                setTake(take);
            });
        }
    };

    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempDate(new Date(selectedDate));
            setShowDatePicker(false);
            setShowNewTimePicker(true);
        } else {
            setShowDatePicker(false);
        }
    };

    const deleteTake = async () => {
        console.log(("aa"))
        await dropTake(take);
        setTake(null);
    }

    return take ? (
        <View style={[styles.container, { display: "flex", flexDirection: "row", justifyContent: "space-between" }]}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text>{formatDate(take.date).day} {formatDate(take.date).dayOfMonth} {formatDate(take.date).month} {formatDate(take.date).year}</Text>
                <Text>{formatHour(take.date)}</Text>
            </View>
            
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ backgroundColor: "#3498DB", padding: 8, borderRadius: 10 }}>
                <Icon.Calendar height={28} width={28} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTake()}  style={{ backgroundColor: "#E74C3C", padding: 8, borderRadius: 10 }}>
                <Icon.Trash height={28} width={28} color={"white"} />
            </TouchableOpacity>
            </View>
            
            {showDatePicker ? (
                <DateTimePicker
                    testID="datePicker"
                    value={tempDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            ) : (null)}
            {showNewTimePicker ? (
                <DateTimePicker
                    testID="timePicker"
                    value={tempDate}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onTimeChange}
                />
            ) : (null)}
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        marginBottom: 10,
    },
});

export default TakeItem;
