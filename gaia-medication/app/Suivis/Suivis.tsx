import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "react-native-elements";
import * as Icon from "react-native-feather";
import RNPickerSelect from "react-native-picker-select";
import { getAllMed, getMedbyCIS } from "../../dao/Meds";
import { addItemToList } from "../../dao/Storage";
import { styles } from "../../style/style";
import ModalComponent from "../component/Modal";

export default function Suivis({ navigation}) {
  const isFocused = useIsFocused();
  const [allMeds, setAllMeds] = useState([]);

  const init = () => {
    const allMeds = getAllMed();
    const medsWithKey = allMeds.map((med) => ({
      id: med.CIS,
      label: med.Name,
    }));
    setAllMeds(medsWithKey);
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
      init();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View className=" flex border-1 p-5">
        <TouchableOpacity
          className=" flex flex-row items-center gap-3 justify-end"
          onPress={() => {
            //setTreatmentModalVisible(true);
            navigation.navigate("AddTreatment");
          }}
        >
          <Text className=" text-[#363636] text-lg">
            {" "}
            Ajouter un traitement
          </Text>
          <Icon.Plus color="#363636" width={35} height={35} />
        </TouchableOpacity>
      </View>
      
    </View>
  );
}
