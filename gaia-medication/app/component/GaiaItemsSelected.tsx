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

const GaiaItemSelected = ({ item }) => {
  const [swipedLeft, setSwipedLeft] = useState(false);

  return (
    <TouchableOpacity
      className='flex-row bg-grey-100 mt-2 mx-2 p-2 rounded-md border-2 border-green-100 p-5'
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
        {items.map((item: SearchDrug) => (
          <GaiaItemSelected item={item} />

        ))}
      </ScrollView>

    </View>
  );
};

export default GaiaItemsSelected;
