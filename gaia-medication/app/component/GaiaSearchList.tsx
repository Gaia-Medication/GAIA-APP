import React, { useState } from 'react';
import { View } from 'react-native';
import GaiaInput from './Inputs/GaiaInput';
import GaiaSearchResults from './GaiaSearchResults';

const GaiaSearchList = ({ inputPlaceholder, onItemPressed, onItemMaintained, searchFunction, editable = true, allergies }) => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  
  const handleSearch = (text: string) => {
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
      {editable && searchText.length >= 3 ? (
        <GaiaSearchResults
          allergies={allergies}
          dataFound={data.length > 0 ? data : []}
          nbOfResults={10}
          onItemPressed={onItemPressed}
          onItemMaintained={onItemMaintained}
        />
      ) : null}
    </View>
  );
};

export default GaiaSearchList;
