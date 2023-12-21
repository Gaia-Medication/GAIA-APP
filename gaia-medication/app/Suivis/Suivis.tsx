import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Icon from "react-native-feather";
import { styles } from "../../style/style";
import ModalComponent from "../component/Modal";
import { Input } from "react-native-elements";
import { addItemToList, readList } from "../../dao/Storage";
import MultipleSelect from "../component/MultipleSelect";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Suivis() {
  const isFocused = useIsFocused();
  const [stock, setStock] = useState(null);

  const [treatmentModalVisible, setTreatmentModalVisible] = useState(false);
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentDescription, setTreatmentDescription] = useState("");

  const [duration, setDuration] = useState("");

  const init = async () => {
    const currentId = JSON.parse(await AsyncStorage.getItem("currentUser"));
    const stockList = await readList("stock");
    setStock(stockList.filter((item) => item.idUser == currentId));
    setStock(stockList);
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
      init();
    }
  }, [isFocused]);

  const handleSumbit = async () => {
    try {
      const currentDate = new Date(Date.now());
      const treatment: Treatment = {
        name: treatmentName,
        description: treatmentDescription,
        startDate: currentDate,
        medic: [],
        instructions: [],
      };

      await addItemToList("Treatment", treatment);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View className=" flex border-1 p-5">
        <TouchableOpacity
          className=" flex flex-row items-center gap-3 justify-end"
          onPress={() => {
            setTreatmentModalVisible(true);
          }}
        >
          <Text className=" text-[#363636] text-lg"> Ajouté un traitement</Text>
          <Icon.Plus color="#363636" width={35} height={35} />
        </TouchableOpacity>
      </View>
      <ModalComponent
        visible={treatmentModalVisible}
        onClose={() => {
          setTreatmentModalVisible(false);
        }}
      >
        <View>
          <Input
            label="Nom du traitement"
            placeholder="Entrez le nom du traitement"
            leftIcon={{}}
            onChangeText={(text) =>
              setTreatmentName(text.charAt(0).toUpperCase() + text.slice(1))
            }
            value={treatmentName}
          ></Input>
          <Input
            label="Description du traitement"
            placeholder="Entrez la description du traitement (optionel)"
            leftIcon={{}}
            onChangeText={(text) =>
              setTreatmentDescription(
                text.charAt(0).toUpperCase() + text.slice(1)
              )
            }
            value={treatmentDescription}
          ></Input>
          {stock &&(
          <MultipleSelect
          items={stock}></MultipleSelect>
          )}
        </View>
      </ModalComponent>
    </View>
  );
}
