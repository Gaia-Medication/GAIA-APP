import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Button,
  Image
} from "react-native";
import * as Icon from "react-native-feather";
import { getAllMed } from "../../dao/Meds";
import { getAllTreatments, initTreatments } from "../../dao/Storage";
import { styles } from "../../style/style";
import ModalComponent from "../component/Modal";
import Treatment from "../component/Treatment";
import { notificationDaily, scheduleLocalNotification } from "../Handlers/NotificationsHandler";

export default function Suivis({ navigation }) {
  const isFocused = useIsFocused();
  const [allMeds, setAllMeds] = useState([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [datesDict, setDatesDict] = useState({});
  const [datesKeys, setDatesKeys] = useState([]);
  const [showAll, setShowAll] = useState(false);

  function compareDates(date): "actual" | "next" | "previous" {
    const now = new Date();
    const dateObj = new Date(date);
    if (now.getTime() > dateObj.getTime()) {
      return "previous"; // SI LA DATE EST PASSEE
    }
    now.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    if (now.getTime() === dateObj.getTime()) {
      return "actual"; // SI LA DATE EST LA MEME
    }  else {
      return "next"; // SI LA DATE EST FUTURE
    }
  }

  const isTodayInDates = (dates: string[]): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dates.some((date) => {
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate.getTime() === today.getTime();
    });
  };

  const init = async () => {
    const allMeds = getAllMed();
    const medsWithKey = allMeds.map((med) => ({
      id: med.CIS,
      label: med.Name,
    }));
    await initTreatments().then((treatments) => {
      setDatesDict(treatments);
      setDatesKeys(Object.keys(datesDict));
    });
    await getAllTreatments().then((treatments) => {
      setTreatments(treatments);
    })
    setAllMeds(medsWithKey);
    setShowAll(false);
    console.log("datesDict", datesDict);
    console.log("treatments", treatments);
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
      init();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {datesDict && datesKeys.length == 0 ? (
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
          {!isTodayInDates(datesKeys) ? (
            <Text>{"Aucun traitement à prendre aujourd'hui"}</Text>
          ) : null}

          <ScrollView>
            <View style={{ paddingBottom: 200, paddingTop: 50 }}>
              {datesKeys && datesKeys.map((date, index) => (
                <View>
                  <Treatment
                    key={index}
                    onPress={null}
                    status={compareDates(date)}
                    date={date}
                    treatment={treatments.find((treatment) => treatment.name === datesDict[date][0])}
                  />
                  <Text>{}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View >
  );
}
