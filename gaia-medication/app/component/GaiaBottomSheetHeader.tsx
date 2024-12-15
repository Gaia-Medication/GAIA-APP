import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { NewInstruction } from 'types/Medical';

interface ModalInstructionDetailsProps {
    title: string;
    onClickClose: () => void;
    onClickValidate: () => void;
    canClickValidate: boolean;
}

const GaiaBottomSheetHeader : React.FC<ModalInstructionDetailsProps> = ({title, onClickClose, onClickValidate, canClickValidate}) => {
    return (
        <View className='h-20 w-full flex-row justify-between items-center'>

            <TouchableOpacity onPress={() => onClickClose()} >
                <Text className='text-red-500 text-base font-semibold'>Close</Text>
            </TouchableOpacity>

            <Text className='text-white font-semibold text-lg'>{title}</Text>

            <TouchableOpacity onPress={() => onClickValidate()} disabled={!canClickValidate}>
                <Text className={`${canClickValidate ? 'text-white' : 'text-grey-200'} text-base font-semibold`}>Validate</Text>
            </TouchableOpacity>

        </View>
    );
}

export default GaiaBottomSheetHeader;
