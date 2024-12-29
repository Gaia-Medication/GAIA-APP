import React, { useState } from 'react';
import { TouchableOpacity, Text, TextInput, View, Platform, SafeAreaView } from 'react-native';
import { formatDate } from '../../utils/functions';
// Remove this:
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker'; // <-- NEW IMPORT

interface GaiaDateTimePickerProps {
    date: Date;
    buttonPlaceholder: string;
    buttonDisabled: boolean;
    onDateChange: (date: Date) => void;
    onLongPress?: () => void;
    mode: 'date' | 'time' | 'datetime' | 'calendar';
}

const GaiaDateTimePicker = ({
    date,
    buttonPlaceholder,
    buttonDisabled,
    onDateChange,
    onLongPress,
    mode,
}: GaiaDateTimePickerProps) => {
    const [selectedDate, setSelectedDate] = useState(date);
    const [pickerVisible, setPickerVisible] = useState(false);

    // We'll store the text shown in the left TextInput
    const [buttonText] = useState(buttonPlaceholder);

    // Handler for when user picks/dismisses
    const handleChange = (event: any, newDate?: Date) => {
        // On Android, pressing "cancel" or system back can give newDate as undefined
        // On iOS, tapping outside or 'Cancel' sets event.type='dismissed'
        if (Platform.OS === 'android') {
            setPickerVisible(false);
        }

        if (event.type === 'set' && newDate) {
            setSelectedDate(newDate);
            onDateChange(newDate);
        }
        // If event.type === 'dismissed', do nothing special, just close.
    };

    return (
        <TouchableOpacity
            disabled={buttonDisabled}
            onPress={() => setPickerVisible(true)}
            onLongPress={onLongPress}
            className="flex flex-row justify-between items-center bg-grey-300 rounded-lg w-[100%] py-1 my-2 h-fit-content px-3"
        >
            <TextInput
                className="text-white text-center font-medium"
                editable={false}
                value={buttonText}
            />
            <View className="flex flex-row justify-center items-center gap-2">
                {/* Date portion */}
                <View className="flex flex-row justify-center items-center bg-grey-200 rounded-md p-2">
                    <Text className={`text-white text-center font-medium ${pickerVisible ? "text-green-100" : "text-white"}`}>
                    {formatDate('dd mon yyyy', selectedDate)}
                </Text>
            </View>

            {/* Time portion if mode='datetime' */}
            {mode === 'datetime' && (
                <View className="flex flex-row justify-center items-center bg-grey-200 rounded-md p-2">
                    <Text className={`text-white text-center font-medium ${pickerVisible ? "text-green-100" : "text-white"}`}>
                        {formatDate('hh:mm', selectedDate)}
                    </Text>
                </View>
            )}
        </View>

      {/* Conditionally render the native picker */ }
    {
        pickerVisible && mode == "calendar" && (
            <DateTimePicker
                value={selectedDate}
                mode='date'
                // For iOS only: 'datetime' is valid. On Android, 'datetime' is not
                // officially supported. Typically we do two passes: one for date, then time.
                // If you want a single pass on iOS, use mode="datetime" here.

                display="default" // or "spinner", "calendar", etc.
                onChange={handleChange}
            // optional: is24Hour={true}
            />
        )
    }

    {
        pickerVisible && mode !== "calendar" && (

            <DateTimePickerModal
                isVisible={pickerVisible}
                mode={mode}
                date={selectedDate}
                onConfirm={(date: Date) => {
                    setSelectedDate(date);
                    onDateChange(date);
                    setPickerVisible(false);
                }}
                onCancel={() => setPickerVisible(false)}
                modalStyleIOS={{ marginBottom: 40 }}
            />
        )
    }

    </TouchableOpacity >
  );
};

export default GaiaDateTimePicker;
