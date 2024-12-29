import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { NewInstruction } from 'types/Medical';
import GaiaBottomSheetHeader from './GaiaBottomSheetHeader';
import MedIconByType from './MedIconByType';

interface ModalInstructionDetailsProps {
    instruction: NewInstruction;
    drugRelated: any;
    onClickClose: () => void;
    onClickValidate: () => void;
    canValidate: boolean;
}

const ModalInstructionDetails : React.FC<ModalInstructionDetailsProps> = ({instruction, drugRelated, onClickClose, onClickValidate, canValidate}) => {
    
    // TODO: IMPLEMENT A DESIGN FOR INSTRUCTION DISPLAY
    return (
        <View 
            className='flex-column justify-center align-center bg-grey-100 px-4 h-full'
        >
            <GaiaBottomSheetHeader title={instruction.name} onClickClose={onClickClose} onClickValidate={onClickValidate} canClickValidate={canValidate}/>

            <View className='flex-1 h-full'>
                <View className='flex-row justify-between items-end mr-5'>
                    <View className='flex-column'>
                        <Text className='text-grey-200 text-medium font-semibold mt-4'>CIS : {instruction.CIS}</Text>
                        <Text className='text-white text-3xl font-semibold'>{instruction.name}</Text>
                    </View>
                    <MedIconByType type={drugRelated.type} size='h-10 w-10' />
                </View>
                <Text className='text-white text-xl font-normal mt-10'>Ce médicament est à prendre de façon {instruction.regularFrequency ? "régulière" : "non-régulière"}</Text>
                <Text className='text-white text-xl font-normal mt-10'>Date de la première prise : {instruction.takes[0].date}</Text>
                <Text>AJOUTER</Text>
            </View>

        </View>
    );
}

export default ModalInstructionDetails;
