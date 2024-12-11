import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SearchDrug } from './../../../dao/Search'
import img from '../../../assets/images';
import MedIconByType from '../MedIconByType';
import { getMedbyCIS } from 'dao/Meds';

const InstructionListItem = ({ instruction, onPress, onMaintain }) => {
    instruction = instruction as Instruction;

    const [drug, setDrug] = useState(null);
    const init = () => {
        getMedbyCIS(instruction.CIS).then((med) => {
            setDrug(med);
        });
    }

    useState(init);


    return (
        <TouchableOpacity className='ml-2 my-2 flex-row justify-between items-center h-10 rounded-xl bg-grey-100 mr-3' onLongPress={onMaintain}>
            <View className='flex-row items-center h-full ml-3 mr-6 flex-1'>
                <MedIconByType type={drug.type} />
                <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    className='text-white font-semibold text-center ml-3'
                >
                    {instruction.name}
                </Text>
            </View>

            <TouchableOpacity className={`bg-grey-100 h-full w-[25%] flex items-center justify-center rounded-r-xl ml-5`} onPress={() => onPress(instruction)}>
                <Text className='text-white font-semibold text-center' numberOfLines={1} ellipsizeMode='tail'>
                    Supprimer
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default InstructionListItem;
