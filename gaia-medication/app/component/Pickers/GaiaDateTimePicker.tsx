import React, { useState } from 'react';
import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate } from '../../utils/functions';

const GaiaDateTimePicker = ({ buttonPlaceholder, buttonDisabled, onDateChange }) => {
    
    const [selectedDate, setSelectedDate] = useState(new Date());
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
            className="flex flex-row justify-between items-center bg-grey-300 rounded-lg w-[100%] py-1 my-2 h-fit-content px-3"
        >
            <TextInput
                className="text-white text-center font-medium"
                editable={false}
                value={buttonText}
            />

            <View className="flex flex-row justify-center items-center bg-grey-200 rounded-md p-2">
                <Text className={`text-white text-center font-medium ${pickerVisible ? "text-green-100" : "text-white"}`}>
                    {formatDate("dd mon yyyy", selectedDate)}
                </Text>
            </View>
            <DateTimePickerModal
                isVisible={pickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setPickerVisible(false)}
                date={selectedDate}
            />
        </TouchableOpacity>
    );
};

export default GaiaDateTimePicker;