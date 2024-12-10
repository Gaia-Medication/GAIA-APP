import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { SearchDrug } from '../../dao/Search';

const GaiaSearchItemSelected = ({ item }) => {
    return (
        <View className='bg-grey-100 mt-2 mx-2 p-2 rounded-md'>
        <Text className='text-white font-semibold'>{item.Name}</Text>
        </View>
    );
};

const GaiaSearchItemsSelected = ({ items }) => {

  return (
    <View className='w-full h-60 bg-red-100 flex-row justify-start align start flex-wrap'>

        {items.map((item: SearchDrug) => (

            <GaiaSearchItemSelected item={item} />

        ))}

    </View>
  );
};

export default GaiaSearchItemsSelected;
