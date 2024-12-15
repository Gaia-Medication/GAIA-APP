import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { NewInstruction } from 'types/Medical';
import GaiaBottomSheetHeader from './GaiaBottomSheetHeader';

interface ModalInstructionDetailsProps {
    instruction: NewInstruction;
    onClickClose: () => void;
    onClickValidate: () => void;
    canValidate: boolean;
}

const ModalInstructionDetails : React.FC<ModalInstructionDetailsProps> = ({instruction, onClickClose, onClickValidate, canValidate}) => {
    return (
        <View 
            className='flex-row justify-center align-center bg-grey-100 px-4 h-full'
        >
            <GaiaBottomSheetHeader title={instruction.name} onClickClose={onClickClose} onClickValidate={onClickValidate} canClickValidate={canValidate}/>
        </View>
    );
}

export default ModalInstructionDetails;
