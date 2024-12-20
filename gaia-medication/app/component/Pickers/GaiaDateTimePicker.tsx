import React, { useState } from 'react';
import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate } from '../../utils/functions';

interface GaiaDateTimePickerProps {
    date: Date;
    buttonPlaceholder: string;
    buttonDisabled: boolean;
    onDateChange: (date: Date) => void;
    onLongPress?: () => void;
    mode: "date" | "time" | "datetime";
}

const GaiaDateTimePicker = ({ date, buttonPlaceholder, buttonDisabled, onDateChange, onLongPress, mode }) => {

    const [selectedDate, setSelectedDate] = useState(date);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [buttonText, setButtonText] = useState(buttonPlaceholder);

    const handleConfirm = (date) => {
        setSelectedDate(date);
        setPickerVisible(false);
        onDateChange(date);
    }

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
                <View className="flex flex-row justify-center items-center bg-grey-200 rounded-md p-2">
                    <Text className={`text-white text-center font-medium ${pickerVisible ? "text-green-100" : "text-white"}`}>
                        {formatDate("dd mon yyyy", selectedDate)}
                        
                    </Text>
                </View>

                {mode === "datetime" && (
                    <View className="flex flex-row justify-center items-center bg-grey-200 rounded-md p-2">
                        <Text className={`text-white text-center font-medium ${pickerVisible ? "text-green-100" : "text-white"}`}>
                            {formatDate("hh:mm", selectedDate)}
                        </Text>
                    </View>
                )}
            </View>

            <DateTimePickerModal
                isVisible={pickerVisible}
                mode={mode}
                onConfirm={handleConfirm}
                onCancel={() => setPickerVisible(false)}
                date={selectedDate}
            />
        </TouchableOpacity>
    );
};

export default GaiaDateTimePicker;