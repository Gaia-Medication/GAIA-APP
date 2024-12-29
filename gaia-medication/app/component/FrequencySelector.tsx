import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Platform,
    Button,
    Alert,
} from 'react-native';
import { ContextMenuView } from 'react-native-ios-context-menu';

interface MenuItem {
    actionKey: string;
    actionTitle: string;
}

interface FrequencyPickerProps {
    menuItems: MenuItem[];
}

const FrequencyPicker: React.FC<FrequencyPickerProps> = ({ menuItems }) => {

    return (
        <View className='flex-row gap-3 items-center'>
            <TextInput className='w-auto bg-grey-200 p-2 rounded-xl text-xl text-white' style={{ textAlignVertical: 'center' }} />
            <Text className='text-white text-xl font-semibold ml-4 w-50'>fois par</Text>


        </View>
    );
};

export default FrequencyPicker;
