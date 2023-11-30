import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserByID, readList } from "../../dao/Storage";
import { styles } from "../../style/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMedbyCIS } from "../../dao/Meds";

export default function Stock({ navigation }) {
  const isFocused = useIsFocused();
  const [stock, setStock] = useState([]);

  const init = async () => {
    const currentId = JSON.parse(await AsyncStorage.getItem("currentUser"));
    const stockList = await readList("stock");
    setStock(stockList.filter((item) => item.idUser == currentId));
  };
  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Stock Page");
      init();
    }
  }, [isFocused]);
  return (
    <SafeAreaView edges={["top"]}>
      <FlatList
        data={stock}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const drug = getMedbyCIS(item.CIS);
          const product = drug.Values.find((drug) => drug.CIP === item.CIP);
          return (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation.navigate("Drug", { drugCIS: item.CIS })}
            >
              <Text>{drug.Name}</Text>
              <Text>{product.Denomination}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
