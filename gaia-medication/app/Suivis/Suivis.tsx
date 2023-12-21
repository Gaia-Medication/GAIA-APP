import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import * as Icon from "react-native-feather";
import { styles } from "../../style/style";
import ModalComponent from "../component/Modal";
import { Input } from "react-native-elements";
import { addItemToList } from "../../dao/Storage";
import MultiSelectComponent from "../component/MultipleSelect";
import { getAllMed } from "../../dao/Meds";

export default function Suivis() {
  const isFocused = useIsFocused();
  const [stock, setStock] = useState(null);
  const [meds, setMeds] = useState([]);

  const [treatmentModalVisible, setTreatmentModalVisible] = useState(false);
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentDescription, setTreatmentDescription] = useState("");

  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");

  const init = () => {
    const allMeds = getAllMed();
    const medsWithId = allMeds.map((med) => ({
      id: med.CIS,
      name: med.Name,
    }));
    setMeds(medsWithId);
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
        styleAdded={{
          backgroundColor: "white",
          borderRadius: 10,
          paddingTop: 40,
          padding: 20,
          minWidth: 300,
          height: "105%",
          width: "100%",
        }}
        visible={treatmentModalVisible}
        onClose={() => {
          setTreatmentModalVisible(false);
        }}
      >
        <View>
          <Text className=" text-3xl">Ajouter un Traitement</Text>
          <View className=" flex pt-8">
            <Input
              label="Nom du traitement*"
              placeholder="Entrez le nom du traitement"
              leftIcon={{}}
              onChangeText={(text) =>
                setTreatmentName(text.charAt(0).toUpperCase() + text.slice(1))
              }
              value={treatmentName}
            ></Input>
            <Input
              label="Description du traitement"
              placeholder="Entrez la description du traitement"
              leftIcon={{}}
              onChangeText={(text) =>
                setTreatmentDescription(
                  text.charAt(0).toUpperCase() + text.slice(1)
                )
              }
              value={treatmentDescription}
            ></Input>
            <Text>Selectioner vos médicaments</Text>
            <MultiSelectComponent items={meds}></MultiSelectComponent>
            <FlatList
              data={[
                { key: "Toutes les 30 minutes" },
                { key: "Toutes les heures" },
                { key: "Toutes les 2 heures" },
                { key: "Toutes les 3 heures" },
                { key: "Toutes les 4 heures" },
                { key: "Toutes les 5 heures" },
                { key: "Toutes les 6 heures" },
                { key: "Toutes les 8 heures" },
                { key: "Tous les jours" },
                { key: "Tous les 2 jours" },
                { key: "Tous les 3 jours" },
                { key: "Tous les 4 jours" },
              ]}
              renderItem={({ item }) => <Text>{item.key}</Text>}
            />
          </View>
        </View>
      </ModalComponent>
    </View>
  );
}
