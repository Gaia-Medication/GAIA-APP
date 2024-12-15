import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  PanResponder,
} from 'react-native';
import { SearchDrug } from '../../dao/Search';
import MedIconByType from './MedIconByType';
import { NewInstruction } from 'types/Medical';

const GaiaItemSelected = ({ item, complete }) => {
  complete = complete as boolean;

  return (
    <TouchableOpacity
      className={`flex-row bg-grey-100 mt-2 mx-2 p-2 rounded-md border-2 ${complete ? 'border-green-100' : 'border-grey-200'} p-5`}
      onLongPress={() => {
        console.log('Long Press');
      }}
    >
      <MedIconByType type={item.type} />
      <Text className='text-white text-base font-semibold ml-4'>{item.name}</Text>
    </TouchableOpacity>
  );
};

const GaiaItemsSelected = ({ items }) => {
  return (
    <View className='w-full flex-row justify-start align start flex-wrap h-full'>
      <ScrollView className='h-full'>
        {items.map((item: NewInstruction) => (
          <GaiaItemSelected key={item.CIS} item={item} complete={item.completed} />

        ))}
      </ScrollView>

    </View>
  );
};

export default GaiaItemsSelected;
