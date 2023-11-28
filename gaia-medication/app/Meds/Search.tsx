import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchMed } from "../../dao/Search";
import { styles } from "../../style/style";

export default function Search({ route }) {
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState([]);

  useEffect(() => {
    if (route.params?.focusSearchInput) {
      searchInputRef.current?.focus();
    }
  }, [route.params]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Search Page");
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarwQR}>
        <View style={styles.searchBar}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchBarInput}
            placeholder="Doliprane, Aspirine ..."
            onChangeText={text =>setSearch(searchMed(text))}
          />
        </View>
      </View>
      <FlatList
        data={search}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item.Name}</Text>}
      />
    </View>
  );
}
