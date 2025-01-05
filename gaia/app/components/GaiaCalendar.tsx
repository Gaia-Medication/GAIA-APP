import React, { useState } from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";

interface GaiaCalendarProps {
    markedDates: Date[];
    onDayPress: (date: Date) => void;
}

export const GaiaCalendar: React.FC<GaiaCalendarProps> = ({ markedDates, onDayPress }) => {

    return (
        <View>
            <Calendar
                markedDates={markedDates.reduce((acc, date) => {
                    acc[date.toISOString().substring(0, 10)] = { selected: true, selectedColor: "#2E8B57" };
                    return acc;
                }, {})}
                onDayPress={(day) => onDayPress(new Date(day.dateString))}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#dd99ee'
                  }}
            />
        </View>
    );
}