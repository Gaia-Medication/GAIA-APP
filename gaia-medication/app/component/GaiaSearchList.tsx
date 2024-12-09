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
import GaiaInput from './GaiaInput';
import GaiaSearchItemsSelected from './GaiaSearchItemsSelected';
import GaiaSearchResults from './GaiaSearchResults';

const GaiaSearchList = ({ inputPlaceholder, onItemSelected, searchFunction }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 2) {
      setData(searchFunction(text));
    }
  }

  return (
    <View>
      <GaiaInput
        placeholder={inputPlaceholder}
        value={searchText}
        onChangeText={handleSearch}
        width={undefined}
      />
      <GaiaSearchResults
        dataFound={data}
        nbOfResults={10}
      />
      <GaiaSearchItemsSelected
      
        items={[]}
        />
    </View>
  );
};

export default GaiaSearchList;
