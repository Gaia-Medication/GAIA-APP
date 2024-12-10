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

const GaiaSearchList = ({ inputPlaceholder, onItemPressed, onItemMaintained, searchFunction, editable=true, allergies }) => {
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
        editable={editable}
        placeholder={inputPlaceholder}
        value={searchText}
        onChangeText={handleSearch}
        width={undefined}
      />

      {editable && (
        <>
          <GaiaSearchResults
            allergies={allergies}
            dataFound={data}
            nbOfResults={10}
            onItemPressed={onItemPressed}
            onItemMaintained={onItemMaintained}
          />
          <GaiaSearchItemsSelected
            items={[]}
          />
        </>
      )}
    </View>
  );
};

export default GaiaSearchList;
