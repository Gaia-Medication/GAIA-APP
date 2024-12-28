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
import { SearchDrug } from 'dao/Search';

const GaiaSearchResults = ({ dataFound, nbOfResults, onItemPressed, onItemMaintained, allergies }) =>{

    return (
        <View className='w-full max-h-60 bg-grey-300 flex-col justify-start align start overflow-hidden h-auto rounded-xl'>
            <ScrollView>
                <View>
                {dataFound.map((item: SearchDrug) => (
                    <SearchListItem key={item.Name} item={item} type={"SearchDrug"} onPress={onItemPressed} onMaintain={onItemMaintained} isAllergy={Array.from(allergies).includes(String(item.CIS))}/>
                ))}
                </View>
                <Text className='text-center text-grey-200 font-semibold mb-3 mt-3'>Aucun autre résultat</Text>
            </ScrollView>
        </View>
    );
};

export default GaiaSearchResults;
