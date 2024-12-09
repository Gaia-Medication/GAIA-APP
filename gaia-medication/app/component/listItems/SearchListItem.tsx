import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import { SearchDrug } from './../../../dao/Search'
import img from '../../../assets/images';
import MedIconByType from '../MedIconByType';

const SearchListItem = ({ item, type }) => {
  console.log(item);

  if (type == "SearchDrug") {
    item = item as SearchDrug;
    return (
      <View className='flex-row align-center justify-start m-4'>
        <MedIconByType type={item.type} />
        <Text className='color-white font-semibold text-center'>{item.Name}</Text>
      </View>
    );
  }


};

export default SearchListItem;
