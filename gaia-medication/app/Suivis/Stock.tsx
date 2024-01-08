import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { getUserByID, readList } from "../../dao/Storage";
import { styles } from "../../style/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMedbyCIS, getPAfromMed } from "../../dao/Meds";
import Loading from "../component/Loading";
import MedIconByType from "../component/MedIconByType";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Stock({ navigation }) {
  const isFocused = useIsFocused();
  const [stock, setStock] = useState(null);
  const [user, setUser] = useState<User | null>(null);

  const init = async () => {
    const currentId = JSON.parse(await AsyncStorage.getItem("currentUser"));
    const current = await getUserByID(JSON.parse(currentId));
    setUser(current);
    const stockList = await readList("stock");
    const stockListFilter=stockList.filter((item) => item.idUser == currentId);
    console.log(stockListFilter);
    const stockListFilterGrouped = stockListFilter.reduce((result, current) => {
      const key = current.CIS;
      if (!result[key]) {
        result[key] = { ...current };
      } else {
        result[key].qte += current.qte;
      }
      return result;
    }, {});
    
    // Conversion de l'objet regroupé en tableau
    const actualStock = Object.values(stockListFilterGrouped);
    setStock(actualStock)
  };
  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Stock Page");
      init();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {stock && (
        <FlatList
          data={stock}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const drug = getMedbyCIS(item.CIS);
            return (
              <TouchableOpacity
                style={styles.listItem}
                className="flex justify-start align-middle"
                onPress={() =>
                  navigation.navigate("Drug", { drugCIS: drug.CIS })
                }
              >
                <MedIconByType type={drug.Shape}/>
                <View className="ml-4 flex-1 flex-row justify-between items-center">
                  <Text className="flex-1">{drug.Name}</Text>
                  {user.preference
                      .map((allergie) =>
                        Array.from(getPAfromMed(item.CIS)).includes(allergie)
                      )
                      .some((bool) => bool) && (
                        <Image
                        className={"h-5 w-5 ml-1 mr-1"}
                        source={require("../../assets/allergy.png")} />
                    )}
                  <Text className=" text-[#7B7B7B]">{item.qte} Boite(s)</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      {!stock && <Loading />}
    </SafeAreaView>
  );
}
