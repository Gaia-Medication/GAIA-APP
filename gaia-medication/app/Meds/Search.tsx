import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { searchMed } from "../../dao/Search";
import { styles } from "../../style/style";
import { Icon, Input } from "react-native-elements";
import MedIconByType from "../component/MedIconByType";
import { Navigation } from "react-native-feather";

export default function Search({ route, navigation }) {
  const textInputRef = React.useRef(null);

  useEffect(() => {
    if (textInputRef.current) {
      setTimeout(() => textInputRef.current.focus(), 200);
    }
  }, []);
  const [search, setSearch] = useState(searchMed("E"));
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Search Page");
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarwQR} className="mt-3 px-4">
        <View style={styles.searchBar}>
          <Input
            style={styles.searchBarInput}
            ref={textInputRef}
            placeholder="Doliprane, Aspirine ..."
            placeholderTextColor="#9CDE00"
            leftIcon={
              <Icon
                name="arrow-right" // Change to your icon's name
                type='feather'
                size={24}
                color='#9CDE00'
                onPress={() => {navigation.goBack()}}
              />
            }
            rightIcon={{ type: "feathers", name: "search", color: "#9CDE00" }}
            inputContainerStyle={styles.searchBarContainer}
            onChangeText={(text) => {
              const newSearch=searchMed(text)
              if (newSearch.length>0) {
                setSearch(newSearch)
              } else {
                setSearch(searchMed("E"))
              }
            }}
          />
        </View>
      </View>
      <FlatList
        data={search}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            className="flex justify-start align-middle"
            onPress={() => navigation.navigate("Drug", { drugCIS: item.CIS })}
          >
            <MedIconByType type={item.type}/>
            <Text className="ml-4">{item.Name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
