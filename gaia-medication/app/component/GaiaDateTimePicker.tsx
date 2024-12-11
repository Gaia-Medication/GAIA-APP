import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate } from '../utils/functions';

const GaiaDateTimePicker = ({ buttonPlaceholder, buttonDisabled, onDateChange }) => {
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [pickerVisible, setPickerVisible] = useState(false);
    const [buttonText, setButtonText] = useState(buttonPlaceholder);

    const handleConfirm = (date) => {
        setSelectedDate(date);
        setPickerVisible(false);
        onDateChange(date);
        setButtonText(formatDate(date));
    }

    return (
        <TouchableOpacity
            disabled={buttonDisabled}
            onPress={() => setPickerVisible(true)}
            className="flex flex-row justify-center items-center bg-green-100 rounded-lg w-[100%] py-2 my-2 h-fit-content"
        >
            <TextInput
                className="text-white text-center font-semibold"
                editable={false}
                value={buttonText}
            />

            <DateTimePickerModal
                isVisible={pickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setPickerVisible(false)}
            />
        </TouchableOpacity>
    );
};

export default GaiaDateTimePicker;