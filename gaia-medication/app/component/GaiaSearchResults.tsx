import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import SearchListItem from './listItems/SearchListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByID } from 'dao/Storage';

const GaiaSearchResults = ({ dataFound, nbOfResults, onItemPressed, onItemMaintained, allergies }) =>{

    return (
        <View className='w-full max-h-60 bg-grey-300 flex-col justify-start align start overflow-hidden h-auto rounded-xl'>
            <ScrollView>
                {dataFound.map((item) => (
                    <SearchListItem item={item} type={"SearchDrug"} onPress={onItemPressed} onMaintain={onItemMaintained} isAllergy={allergies.includes(item.CIS)}/>
                ))}
                <Text className='text-center text-grey-200 font-semibold mb-3 mt-3'>Aucun autre résultat</Text>
            </ScrollView>
        </View>
    );
};

export default GaiaSearchResults;