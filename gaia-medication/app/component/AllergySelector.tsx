import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { styles } from "../../style/style";
import { Input, Text } from "react-native-elements";
import { SearchAllergy } from "../../dao/Search";
import { X } from "react-native-feather";
import CustomButton from "./CustomButton";

const AllergySelector = ({ isAllergySelectorValid, preference, onPreferenceChange }) => {
  const [searchAllergy, setSearchAllergy] = useState([]);

  return (
    <View className=" bg-white h-[90%] w-full p-4 flex justify-center items-center">
      <Input
        label="Allergies médicamenteuses"
        placeholder="Rechercher"
        placeholderTextColor={"#dedede"}
        labelStyle={styles.label}
        onChangeText={(text) => {
          const newSearch = SearchAllergy(text);
          setSearchAllergy(newSearch);
        }}
      />
      <FlatList
        className=" m-3 min-h-[40px] max-h-[40px]"
        horizontal={true}
        data={preference}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className=" bg-sky-200 m-1 p-1 rounded-lg flex flex-row justify-center align-middle"
            onPress={() => {
              const updatedPreference = preference.filter(
                (itemr) => itemr !== item
              );
              onPreferenceChange(updatedPreference);
            }}
          >
            <X className=" text-sky-500"></X>
            <Text className=" text-sky-500">{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={searchAllergy}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            className="flex justify-start items-center"
            onPress={() => {
              if (preference.includes(item.Name)) {
                // Si l'élément est déjà dans preference, supprimez-le
                const updatedPreference = preference.filter(
                  (itemr) => itemr !== item.Name
                );
                onPreferenceChange(updatedPreference);
              } else {
                // Si l'élément n'est pas dans preference, ajoutez-le
                const updatedPreference = [...preference, item.Name];
                onPreferenceChange(updatedPreference);
              }
            }}
          >
            <Text className="ml-2 text-xs w-full">{item.Name}</Text>
          </TouchableOpacity>
        )}
      />
      <View>
        <CustomButton
          title={"Valider les allergies"}
          onPress={() => {
            isAllergySelectorValid(false);
          }}
          disabled={false}
          color={"#4296E4"}
        ></CustomButton>
      </View>
    </View>
  );
};

export default AllergySelector;
