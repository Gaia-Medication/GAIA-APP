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
            className="flex flex-row justify-center items-center bg-blue-400 rounded-lg w-[100%] py-2 my-2"
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

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    pickerButton: {
        position: 'relative',
        justifyContent: 'center',
        width: "auto",
        height: 40,
        borderRadius: 20,
    },
    pickerButtonText: {
        padding: 6,
        fontSize: 20,
        height: 40,
        marginLeft: 10,
        zIndex: 1,
        color: '#fff',
        fontWeight: "600",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    placeholder: {
        position: 'absolute',
        left: 20,
        fontSize: 20,
        zIndex: 2,
        fontWeight: "600",
        color: '#888',
        width: "auto"
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
    },
});

export default GaiaDateTimePicker;
