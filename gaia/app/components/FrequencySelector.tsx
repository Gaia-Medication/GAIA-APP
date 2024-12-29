import React from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native';

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
