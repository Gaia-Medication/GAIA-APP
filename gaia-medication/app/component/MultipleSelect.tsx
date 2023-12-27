import React, { useState } from "react";
import { View} from "react-native";
import MultiSelect from "react-native-multiple-select";

const MultiSelectComponent = ({ items, onSelectionChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  };

  return (
    <View>
      <MultiSelect
        items={items}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="Sélectionnez"
        searchInputPlaceholderText="Recherche..."
        displayKey="name"
        searchInputStyle={{}}
        submitButtonText="Valider"
      />
    </View>
  );
};

export default MultiSelectComponent;
