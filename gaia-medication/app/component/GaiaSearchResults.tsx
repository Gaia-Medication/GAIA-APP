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

const GaiaSearchResults = ({ dataFound, nbOfResults }) => {

  return (
    <View className='w-full h-60 bg-grey-100 flex-col justify-start align start overflow-scroll'>
        {dataFound.map((item) => (
            <SearchListItem item={item} type={"SearchDrug"} />
        ))}
    </View>
  );
};

export default GaiaSearchResults;
