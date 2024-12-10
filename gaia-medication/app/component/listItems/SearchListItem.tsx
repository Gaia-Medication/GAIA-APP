import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SearchDrug } from './../../../dao/Search'
import img from '../../../assets/images';
import MedIconByType from '../MedIconByType';

const SearchListItem = ({ item, type, onPress, onMaintain, isAllergy=false }) => {

  if (type == "SearchDrug") {
    item = item as SearchDrug;
    return (
      <TouchableOpacity className='ml-2 my-2 flex-row justify-between items-center h-10 rounded-xl bg-grey-100 mr-3' onLongPress={onMaintain}>
        <View className='flex-row items-center h-full ml-3 mr-6 flex-1'>
          <MedIconByType type={item.type} />
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            className='text-white font-semibold text-center ml-3'
          >
            {item.Name}
          </Text>
        </View>

        <TouchableOpacity className='bg-green-100 h-full w-[25%] flex items-center justify-center rounded-r-xl ml-5' onPress={() => onPress(item)}>
          <Text className='text-white font-semibold text-center' numberOfLines={1} ellipsizeMode='tail'>
            Ajouter {isAllergy ? "A" : "B"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }


};

export default SearchListItem;
