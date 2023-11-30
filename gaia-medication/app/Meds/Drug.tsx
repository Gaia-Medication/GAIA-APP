import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMedbyCIS } from "../../dao/Meds";

export default function Drug({ route }) {
  const isFocused = useIsFocused();

  const { drugCIS } = route.params;
  const drug = getMedbyCIS(drugCIS);

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Drug Page CIS :", drugCIS);
      //console.log(drug);
    }
  }, [isFocused]);
  return (
    <View>
      {drug && (
        <>
          <Text>Name : {drug.Name}</Text>
          <Text>Administration : {drug.Administration_way}</Text>
          <Text>Type : {drug.Shape}</Text>
          <Text>Commerce : {drug.Marketed}</Text>
          <FlatList
            data={drug.Values}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
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
              </>
            )}
          />
        </>
      )}
    </View>
  );
}
