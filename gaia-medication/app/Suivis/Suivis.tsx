import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Icon from "react-native-feather";
import { styles } from "../../style/style";
import ModalComponent from "../component/Modal";
import { Input } from "react-native-elements";

export default function Suivis() {
  const isFocused = useIsFocused();
  const [traitementModalVisible, setTraitementModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View className=" flex border-1 p-5">
        <TouchableOpacity
          className=" flex flex-row items-center gap-3 justify-end"
          onPress={() => {
            setTraitementModalVisible(true);
          }}
        >
          <Text className=" text-[#363636] text-lg"> Ajouté un traitement</Text>
          <Icon.Plus color="#363636" width={35} height={35} />
        </TouchableOpacity>
      </View>
      <ModalComponent
        visible={traitementModalVisible}
        onClose={() => {
          setTraitementModalVisible(false);
        }}
      >
        <View>
          <Input></Input>
        </View>
      </ModalComponent>
    </View>
  );
}
