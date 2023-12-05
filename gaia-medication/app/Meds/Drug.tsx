import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMedbyCIS } from "../../dao/Meds";
import { addItemToList, getUserByID, readList } from "../../dao/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Drug({ route }) {
  const isFocused = useIsFocused();
  const [user, setUser] = useState<User | null>(null);
  const [stock, setStock] = useState(null);

  const { drugCIS } = route.params;
  const drug = getMedbyCIS(drugCIS);

  const init = async () => {
    const currentId = await AsyncStorage.getItem("currentUser");
    const current = await getUserByID(JSON.parse(currentId));
    setUser(current);
    const stockList = await readList("stock");
    setStock(
      stockList.filter((item) => item.idUser == currentId && item.CIS == drugCIS)
    );
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Drug Page CIS :", drugCIS);
      init();
      //console.log(drug);
    }
  }, [isFocused]);

  const addToStock = async (item) => {
    try {
      const stock: Stock = {
        idUser: user.id,
        CIP: item.CIP,
        CIS: item.CIS,
        qte: 0,
      };
      console.log(stock);

      await addItemToList("stock", stock);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View>
      {drug && stock && user && (
        <>
          <Text>Name : {drug.Name}</Text>
          <Text>Administration : {drug.Administration_way}</Text>
          <Text>Type : {drug.Shape}</Text>
          <Text>Commerce : {drug.Marketed}</Text>
          <FlatList
            data={drug.Values}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const alreadyStocked =
                stock.find((stock) => stock.CIP === item.CIP) != null;
              return (
                <>
                  <Text>Produit :</Text>
                  <Text>CIP : {item.CIP}</Text>
                  <Text>Description : {item.Denomination}</Text>
                  {drug.Marketed == "Commercialisée" &&
                    (item.Price_with_taxes ? (
                      <>
                        <Text>Prix : {item.Price_with_taxes}€</Text>
                        <Text>Remboursement : {item.Remboursement}</Text>
                      </>
                    ) : (
                      <>
                        <Text>Prix : Prix libre</Text>
                        <Text>Remboursement : Non remboursable</Text>
                      </>
                    ))}

                  {alreadyStocked ? (
                    <Text>✅</Text>
                  ) : (
                    <TouchableOpacity onPress={() => addToStock(item)}>
                      <Text>🆗</Text>
                    </TouchableOpacity>
                  )}
                </>
              );
            }}
          />
        </>
      )}
    </View>
  );
}
