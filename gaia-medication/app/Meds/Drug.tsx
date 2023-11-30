import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMedbyCIS } from "../../dao/Meds";

export default function Drug({ route }) {
  const isFocused = useIsFocused();

  const { drugCIS } = route.params;
  const drug = getMedbyCIS(drugCIS);

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Drug Page CIS :", drugCIS);
      console.log(drug);
    }
  }, [isFocused]);
  return (
    <View>
      {drug && (
        <>
          <Text>Name : {drug.Name}</Text>
          <Text>Administration : {drug.Administration_way}</Text>
          <Text>Type : {drug.Shape}</Text>
          <Text>Description : {drug.Values[0].Denomination}</Text>
          <Text>Commerce : {drug.Marketed}</Text>
          {drug.Marketed == "Commercialisée"&& drug.Values[0].Price_with_taxes && (
            <>
              <Text>Prix : {drug.Values[0].Price_with_taxes}€</Text>
              <Text>Remboursement : {drug.Values[0].Remboursement}</Text>
            </>
          )}
        </>
      )}
    </View>
  );
}
