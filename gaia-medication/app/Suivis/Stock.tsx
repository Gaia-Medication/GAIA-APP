import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserByID, readList, removeItemFromStock } from "../../dao/Storage";
import { styles } from "../../style/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMedbyCIS } from "../../dao/Meds";
import Loading from "../component/Loading";

export default function Stock({ navigation }) {
  const isFocused = useIsFocused();
  const [stock, setStock] = useState(null);

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

  const deleteFromStock = async (cis, cip, idUser) => {
    try {
      await removeItemFromStock(cis, cip, idUser);
      init()
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View style={styles.container}>
      {stock && (
        <FlatList
          data={stock}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const drug = getMedbyCIS(item.CIS);
            const product = drug.Values.find((drug) => drug.CIP === item.CIP);
            return (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate("Drug", { drugCIS: drug.CIS })
                }
              >
                <View>
                  <Text>{drug.Name}</Text>
                  <Text>{product.Denomination}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    deleteFromStock(product.CIS, product.CIP, item.idUser)
                  }
                >
                  <Text>❌</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
      {!stock && <Loading />}
    </View>
  );
}
