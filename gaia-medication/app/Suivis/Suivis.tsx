import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Button,
  Image
} from "react-native";
import { Input } from "react-native-elements";
import * as Icon from "react-native-feather";
import RNPickerSelect from "react-native-picker-select";
import { getAllMed, getMedbyCIS } from "../../dao/Meds";
import { addItemToList, getAllTreatments } from "../../dao/Storage";
import { styles } from "../../style/style";
import ModalComponent from "../component/Modal";
import Treatment from "../component/Treatment";

export default function Suivis({ navigation }) {
  const isFocused = useIsFocused();
  const [allMeds, setAllMeds] = useState([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [datesDict, setDatesDict] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [datesKeys, setDatesKeys] = useState([]);

  const initTreatments = async () => {
    const allTreatments = await getAllTreatments();
    setTreatments(allTreatments);
    let dict = {}; // Initialize dict as an array

    const treatmentDates: Record<string, string[]> = {};

    allTreatments.forEach((treatment) => {
      console.log(treatment.name)
      treatment.instruction?.forEach((instr) => {
        Object.keys(instr.datesAndQuantities || {}).forEach((date) => {
          console.log(date)
          if (dict[date]) {
            // If the date already exists in the dictionary, append the treatment name to the array
            dict[date].push(treatment.name);
          } else {
            // If the date doesn't exist, create a new array with the treatment name
            dict[date] = [treatment.name];
          }
        });
      });
    });
    const sortedKeys = Object.keys(dict).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    })
    const dictWithDates = sortedKeys
      .map(dateStr => new Date(dateStr))
    console.log("dictWithDates => ", dictWithDates);
    const nextDateIndex = dictWithDates.findIndex(dateObj => dateObj > new Date());
    const futureDateKeys = nextDateIndex == 0 ? (sortedKeys) : (nextDateIndex === -1 ? (sortedKeys.slice(-1)): (sortedKeys.slice(nextDateIndex - 1))) ;
    const futureDatesDict = {};
    futureDateKeys.forEach(date => {
      futureDatesDict[date] = dict[date];
    });
    setDatesDict(futureDatesDict);
    console.log("futureDatesKeys => ", futureDateKeys);
    setDatesKeys(futureDateKeys);
  };

  const init = () => {
    const allMeds = getAllMed();
    const medsWithKey = allMeds.map((med) => ({
      id: med.CIS,
      label: med.Name,
    }));
    initTreatments();
    setAllMeds(medsWithKey);
    setShowAll(false);
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
      init();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {datesKeys.length == 0 ? (
        <View style={{ padding: 10, width: "100%", height: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', marginBottom: 200 }}>
          <Text style={{ color: "rgb(103, 33, 236)", fontSize: 20, marginBottom: 100 }}>Aucun traitement à venir</Text>
          <Image
            source={require('./../../assets/heureux.png')}
            style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 100 }}
          />
          <TouchableOpacity
            style={{ backgroundColor: "rgb(103, 33, 236)", borderRadius: 10 }}
            onPress={() => navigation.navigate("AddTreatment")}
          >
            <Text style={{ color: "white", fontSize: 20, textAlign: "center", padding: 10 }}>Ajouter un traitement</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className=" flex border-1 p-5">
          <Text className=" text-[#363636] text-lg">À venir...</Text>
          <ScrollView>
            <TouchableOpacity
              className=" flex flex-row items-center gap-3 justify-end"
              onPress={() => navigation.navigate("AddTreatment")}
              style={{ position: "relative", right: 0, top: 0 }}
            >
              <Text className=" text-[#363636] text-lg">
                {" "}
                Ajouter un traitement
              </Text>
              <Icon.Plus color="#363636" width={35} height={35} />
            </TouchableOpacity>
            {datesKeys.length <= 1 ? (
              new Date(datesKeys[0]) < new Date() ? (
                <View>
                  <Treatment
                    onPress={null}
                    date={datesKeys[0]}
                    status="previous"
                    treatment={treatments.find((treatment) => treatment.name === datesDict[datesKeys[0]][0])}
                  />
                  <View style={{ padding: 10, width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: "100%", height: 5, backgroundColor: "rgb(103, 33, 236)", marginBottom: 20, marginTop: 20, borderRadius: 10 }}></View>
                    <Text style={{ color: "rgb(103, 33, 236)", fontSize: 20, marginBottom: 20 }}>Aucun traitement à venir</Text>
                    <Image
                      source={require('./../../assets/comme.png')}
                      style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 100 }}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <Treatment
                    onPress={null}
                    date={datesKeys[0]}
                    status="actual"
                    treatment={treatments.find((treatment) => treatment.name === datesDict[datesKeys[0]][0])}
                  />
                </View>
              )) : (
              <View>
                <Treatment
                  onPress={null}
                  date={datesKeys[0]}
                  status="previous"
                  treatment={treatments.find((treatment) => treatment.name === datesDict[datesKeys[0]][0])}
                />
                <Treatment
                  onPress={null}
                  date={datesKeys[1]}
                  status="actual"
                  treatment={treatments.find((treatment) => treatment.name === datesDict[datesKeys[1]][0])}
                />
                {datesKeys.length > 2 && datesKeys.slice(2).map((date, index) => {
                  return (
                    <Treatment
                      key={index}
                      onPress={null}
                      date={date}
                      status="next"
                      treatment={treatments.find((treatment) => treatment.name === datesDict[date][0])}
                    />
                  )
                })}
              </View>
            )}
            </ScrollView>
        </View>
      )}
    </View >
  );
}
