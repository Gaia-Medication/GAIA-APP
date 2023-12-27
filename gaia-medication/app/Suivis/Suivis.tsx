import DateTimePicker from "@react-native-community/datetimepicker";
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

export default function Suivis() {
  const isFocused = useIsFocused();
  const [allMeds, setAllMeds] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMed, setSelectedMed] = useState("");
  const [selectedMedCIS, setSelectedMedCIS] = useState("");
  const [searchText, setSearchText] = useState("");

  // Traitement
  const [treatmentModalVisible, setTreatmentModalVisible] = useState(false);
  const [instructionModalVisible, setInstructionModalVisible] = useState(false);
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentDescription, setTreatmentDescription] = useState("");

  // Instructions
  const [instructions, setInstructions] = useState([]);
  const [frequency, setFrequency] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const frequencyList = [
    { label: "Une seule fois", value: "null" },
    { label: "Toutes les 30 minutes", value: "00:30" },
    { label: "Toutes les heures", value: "01:00" },
    { label: "Toutes les 2 heures", value: "02:00" },
    { label: "Toutes les 3 heures", value: "03:00" },
    { label: "Toutes les 4 heures", value: "04:00" },
    { label: "Toutes les 5 heures", value: "05:00" },
    { label: "Toutes les 6 heures", value: "06:00" },
    { label: "Toutes les 8 heures", value: "08:00" },
    { label: "Tous les jours", value: "24:00" },
    { label: "Tous les 2 jours", value: "48:00" },
    { label: "Tous les 3 jours", value: "72:00" },
    { label: "Tous les 4 jours", value: "96:00" },
  ];
  const [quantity, setQuantity] = useState(0);

  const init = () => {
    const allMeds = getAllMed();
    const medsWithKey = allMeds.map((med) => ({
      id: med.CIS,
      label: med.Name,
    }));
    setAllMeds(medsWithKey);
  };

  const filteredData =
    searchText === ""
      ? allMeds
      : allMeds.filter((item) =>
          item.label.toLowerCase().includes(searchText.toLowerCase())
        );

  const handleMedSelect = (med, CIS) => {
    setSelectedMed(med);
    setIsVisible(false);
    setSearchText("");
    setSelectedMedCIS(CIS);
    setInstructionModalVisible(true);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => handleMedSelect(item.label, item.id)}
      >
        <Text>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
      init();
    }
  }, [isFocused]);

  const handleInstructionSumbit = (CIS) => {
    const currentMed = getMedbyCIS(CIS);
    const instruction: Instruction = {
      CIS: currentMed.CIS,
      CIP: currentMed.Name,
      qty: quantity,
      frequency: frequency,
      endDate: endDate,
    };
    setInstructions([...instructions, instruction]);
  };

  const handleSumbit = async () => {
    try {
      const currentDate = new Date(Date.now());

      const treatment: Treatment = {
        name: treatmentName,
        description: treatmentDescription,
        startDate: currentDate,
        instruction: instructions,
      };

      console.log(treatment);
      setInstructions([]);
      setTreatmentName("");
      setTreatmentDescription("");
      await addItemToList("Treatment", treatment);
    } catch (e) {
      console.log(e);
    }
  };

  // Formatte la date pour l'affichage
  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowPicker(false);
    setEndDate(currentDate);
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
          <Text className=" text-[#363636] text-lg">
            {" "}
            Ajouter un traitement
          </Text>
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
            <Text>Nom du traitement*</Text>
            <Input
              placeholder="Entrez le nom du traitement"
              leftIcon={{}}
              onChangeText={(text) =>
                setTreatmentName(text.charAt(0).toUpperCase() + text.slice(1))
              }
              value={treatmentName}
            ></Input>
            <Text>Description du traitement</Text>
            <Input
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
            <TextInput
              style={styles.dropdownInput}
              onFocus={() => setIsVisible(true)}
              onChangeText={(text) => {
                setSearchText(text);
                setIsVisible(true);
              }}
              value={searchText}
              placeholder="Selectioner vos médicaments..."
            />
            {isVisible && (
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.dropdownList}
              />
            )}
            <View className=" flex gap-2">
              {instructions.map((instruction, index) => (
                <View style={styles.medItems} key={index}>
                  <Text className=" text-center text-s text-blue-500">
                    {" "}
                    {instruction.qty}x {instruction.CIP}
                  </Text>
                </View>
              ))}
            </View>
            <ModalComponent
              visible={instructionModalVisible}
              onClose={() => {
                setInstructionModalVisible(false);
              }}
              styleAdded={{
                backgroundColor: "white",
                borderRadius: 10,
                paddingTop: 40,
                padding: 20,
                minWidth: 300,
                height: "105%",
                width: "100%",
              }}
            >
              <View className=" flex justify-center gap-4 p-2">
                <Text className="text-center text-xl font-bold text-blue-400">
                  {selectedMed}
                </Text>
                <Text>Selectioner la fréquence</Text>
                <RNPickerSelect
                  placeholder={{
                    label: "Selectioner la fréquence",
                    value: null,
                  }}
                  onValueChange={(value) => setFrequency(value)}
                  items={frequencyList}
                />
                <Text>Selectioner la date de fin</Text>
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                  style={{ marginBottom: 20 }}
                >
                  <TextInput
                    style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                    editable={false}
                    value={formatDate(endDate)}
                    placeholder="Sélectionnez une date"
                  />
                </TouchableOpacity>
                {showPicker && ( 
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <Text>Selectioner la quantité</Text>
                <Input
                  placeholder="Selectioner la quantité de médicament"
                  leftIcon={{}}
                  onChangeText={(text) => setQuantity(parseInt(text))}
                  value={quantity ? quantity.toString() : ""}
                  keyboardType="numeric"
                ></Input>

                <TouchableOpacity
                  onPress={() => {
                    setInstructionModalVisible(false);
                    handleInstructionSumbit(selectedMedCIS);
                  }}
                >
                  <Text className=" text-center">Valider</Text>
                </TouchableOpacity>
              </View>
            </ModalComponent>
          </View>
          <TouchableOpacity
            onPress={() => {
              setTreatmentModalVisible(false);
              handleSumbit();
            }}
          >
            <Text className=" text-center">Ajouter le traitement</Text>
          </TouchableOpacity>
        </View>
      </ModalComponent>
    </View>
  );
}
