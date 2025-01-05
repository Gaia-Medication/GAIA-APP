import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { GaiaDropdownMenu } from './Pickers/GaiaDropdownMenu';


interface MenuItem {
    actionKey: string ;
    actionTitle: string;
}

interface FrequencyPickerProps {
    menuItems: MenuItem[];
    numberItems: MenuItem[];
    handleFrequencyChange: (actionKey: string) => void;
}

const FrequencyPicker: React.FC<FrequencyPickerProps> = ({ menuItems, numberItems, handleFrequencyChange }) => {
    const [frequency, setFrequency] = useState('day');
    const [frequencyNumber, setFrequencyNumber] = useState('1');

    const [visibleFrequency, setVisibleFrequency] = useState(false);
    const [visibleNumber, setVisibleNumber] = useState(false);

    return (
        <View className='flex-row gap-3 items-center'>
            <GaiaDropdownMenu
                visible={visibleNumber}
                handleOpen={() => setVisibleNumber(true)}
                handleClose={() => setVisibleNumber(false)}
                trigger={
                    <TouchableOpacity onPress={() => setVisibleNumber(true)}>
                        <Text className='text-white text-xl font-semibold text-center'>{frequencyNumber}</Text>
                    </TouchableOpacity>
                }
                menuItems={numberItems}
                onMenuItemPress={(actionKey) => {
                    handleFrequencyChange(actionKey)
                    console.log(actionKey)
                }}
            />
            <Text className='text-white text-xl font-semibold ml-4 w-50'>fois par</Text>
            <GaiaDropdownMenu
                visible={visibleFrequency}
                handleOpen={() => setVisibleFrequency(true)}
                handleClose={() => setVisibleFrequency(false)}
                trigger={
                    <TouchableOpacity onPress={() => setVisibleFrequency(true)}>
                        <Text className='text-white text-xl font-semibold text-center'>{menuItems.find(item => item.actionKey === frequency)?.actionTitle}</Text>
                    </TouchableOpacity>
                }
                menuItems={menuItems}
                onMenuItemPress={(actionKey) => {
                    handleFrequencyChange(actionKey)
                    console.log(actionKey)
                }}
            />


        </View>
    );
};

export default FrequencyPicker;
