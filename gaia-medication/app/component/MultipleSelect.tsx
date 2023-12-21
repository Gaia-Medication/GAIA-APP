import React, { useState } from "react";
import { View, Text } from "react-native";
import MultiSelect from "react-native-multiple-select";

const MultipleSelect = (items) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  return (
    <View style={{ flex: 1 }}>
      <MultiSelect
        items={items}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="Pick Items"
        searchInputPlaceholderText="Search Items..."
        onChangeInput={(text) => console.log(text)}
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: "#CCC" }}
        submitButtonColor="#CCC"
        submitButtonText="Submit"
      />
      <Text>Selected Items: {selectedItems.join(", ")}</Text>
    </View>
  );
};

export default MultipleSelect;
