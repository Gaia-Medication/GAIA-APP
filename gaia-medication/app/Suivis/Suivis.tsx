import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image
} from "react-native";
import * as Icon from "react-native-feather";
import { getAllMed } from "../../dao/Meds";
import { getAllTreatments, getTreatmentByName, initTreatments } from "../../dao/Storage";
import { styles } from "../../style/style";
import Treatment from "../component/Treatment";

export default function Suivis({ navigation }) {
  const isFocused = useIsFocused();
  const [allMeds, setAllMeds] = useState([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [datesDict, setDatesDict] = useState({});
  const [datesKeys, setDatesKeys] = useState([]);
  const [takes, setTakes] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [treatment, setTreatment] = useState<Treatment>(null);
  const [isToday, setIsToday] = useState(false);

  const scrollViewRef = useRef(null);


  const toggleTakeTaken = (tak: Take) => {
    let takesUpdate = [...takes];
    takesUpdate.forEach((take) => {
      if (take.date === tak.date && take.treatmentName === tak.treatmentName) {
        take.taken = !take.taken;
        console.log("take", take);
      }
    });
    setTakes(takesUpdate);
  };

  function compareDates(date): "actual" | "next" | "previous" {
    const now = new Date();
    const dateObj = new Date(date);
    now.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    if (now.getTime() === dateObj.getTime()) {
      return "actual"; // SI LA DATE EST LA MEME
    } else if (now.getTime() > dateObj.getTime()) {
      return "previous"; // SI LA DATE EST PASSEE
    } else {
      return "next"; // SI LA DATE EST FUTURE
    }
  }

  const isTodayInDates = (takes: Take[]): boolean => {
    if (takes.length === 0) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return takes.some((take) => {
      const currentDate = new Date(take.date);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate.getTime() === today.getTime();
    });
  };

  const init = async () => {
    setShowAll(false);
    initTreatments().then((treatments) => {
      treatments.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      setTakes(treatments);
      setIsToday(isTodayInDates(takes));
      console.log("isToday", isToday);
    })
    getAllTreatments().then((treatments) => {
      setTreatments(treatments);
    })
    console.log("takes", takes);

    const actualIndex = takes.findIndex(take => compareDates(take.date) === 'actual');

    if (actualIndex !== -1) {
      // Calculate the position to scroll to
      // For simplicity, assuming each Treatment has a fixed height (e.g., 100)
      const positionToScroll = 320 * actualIndex + 50;

      // Step 3: Scroll to the target item
      scrollViewRef.current.scrollTo({ y: positionToScroll, animated: true });
    }
    
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");


      init();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {takes && takes.length !== 0 ? (
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
          {isToday === false ? (
            <Text>{"Aucun traitement à prendre aujourd'hui"}</Text>
          ) : null}

          <ScrollView ref={scrollViewRef}>
            <View style={{ paddingBottom: 200, paddingTop: 50 }}>
              {takes && takes.map((take, index) => (
                <Treatment
                  key={index}
                  onPress={null}
                  status={compareDates(take.date)}
                  take={take}
                  treatment={treatments.find((treatment) => treatment.name === take.treatmentName)}
                  onTakePress={toggleTakeTaken} 
                />
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
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
      )}
    </View >
  );
}
