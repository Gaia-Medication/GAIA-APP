import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList
} from "react-native";
import * as Icon from "react-native-feather";
import { getAllMed } from "../../dao/Meds";
import { addItemToList, getAllTreatments, getTreatmentByName, initTreatments } from "../../dao/Storage";
import { styles } from "../../style/style";
import Treatment from "../component/Treatment";
import { SafeAreaView } from "react-native-safe-area-context";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalComponent from "../component/Modal";
import { Modal } from "react-native-paper";
import { BlurView } from "expo-blur";

export default function Suivis({ navigation }) {
  const isFocused = useIsFocused();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [takes, setTakes] = useState([]);
  const [isToday, setIsToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef(null);

  const changeTreatments = async (tak: Take) => {
    console.log(tak);
    treatments.forEach((treatment) => {
      if (treatment.name === tak.treatmentName) {
        treatment.instructions.forEach((instruction) => {
          if (Number(instruction.CIS) === tak.CIS) {
            instruction.takes.forEach((take) => {
              if (take.date === tak.date) {
                take.taken = tak.taken;
                take.review = tak.review;
              }
            });
          }
        })
      }
    });
    setTreatments(treatments);
    AsyncStorage.setItem('treatments', JSON.stringify(treatments));
  }


  const toggleTakeTaken = (tak: Take) => {
    let takesUpdate = [...takes];
    takesUpdate.forEach((take) => {
      if (take.take.date === tak.date && take.treatmentName === tak.treatmentName) {
        take.take.taken = !take.take.taken;
      }
    });
    setTakes(takesUpdate);
    changeTreatments(tak);
  };


  function compareDates(targetDate, currentDate = new Date()): "previous" | "actual" | "next" {
    // Set the time to midnight for both dates
    const today=new Date(currentDate);
    const dateObj = new Date(targetDate);
    dateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Compare using ISO date strings
    let fourHoursAgo = new Date(currentDate);
    fourHoursAgo.setHours(currentDate.getHours() - 6);
    console.log(fourHoursAgo.getHours())
    if (new Date(targetDate) <= fourHoursAgo) {
        return "previous";
    } else if (dateObj.toISOString() > today.toISOString()) {
      return "next";
    } else {
      return "actual";
    }
  }

  const isTodayInDates = (takes: any[]): boolean => {
    if (takes.length === 0) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return takes.length === 0 ? false :
      takes.some((take: { take: Take, tre: Treatment }) => {
        const currentDate = new Date(take.take.date);
        currentDate.setHours(0, 0, 0, 0);
        return currentDate.getTime() === today.getTime();
      });
  };

  async function getTreatments() {
    const treatments = await getAllTreatments();
    setTreatments(treatments);
  }

  async function getTakes() {
    const takes = await initTreatments();
    takes.sort((a, b) => {
      const dateA = new Date(a.take.date);
      const dateB = new Date(b.take.date);
      return dateA.getTime() - dateB.getTime();
    })
    setTakes(takes);
    setIsToday(isTodayInDates(takes));
  }

  const init = async () => {
    await getTreatments();
    await getTakes();
    setIsLoading(false);
    let actualIndex = null

    takes.length !== 0 ? takes.findIndex(take => compareDates(take.take.date) === 'actual') ? actualIndex = takes.findIndex(take => compareDates(take.take.date) === 'actual') : actualIndex = takes.findIndex(take => compareDates(take.take.date) === 'previous') : null;

    console.log(actualIndex);
    if (actualIndex && actualIndex !== -1) {
      const positionToScroll = 334 * actualIndex + 50;
      scrollViewRef.current.scrollTo({ y: positionToScroll, animated: true });
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
      if(takes.length<1) setIsLoading(true);

      init();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
    <BlurView
      intensity={20}
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        flex: 1,
        zIndex:10
      }}
      className="px-0"
    >
        <Image
          className=" object-cover h-24 w-48 self-center"
          source={require("../../assets/logo_title_gaia.png")}
        />
        <ActivityIndicator size={40} color="#9CDE00" />
        <Text style={{ color: "#9CDE00", fontSize: 20, marginTop: 50, textAlign:'center' }}>Récupération des traitements...</Text>
      </BlurView>
      ): null}
      {takes && takes.length !== 0 ? (
        <View className=" flex border-1 p-5">
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
          ) : <Text>TRAITEMENT AJD</Text>}

          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
            <View style={{ paddingBottom: 200, paddingTop: 50 }}>
              {takes && takes.map((take, index) => (
                <View key={index}>
                  <Treatment
                    key={index}
                    onPress={null}
                    status={compareDates(take.take.date)}
                    take={take.take}
                    treatmentName={take.treatmentName}
                    treatmentDescription={take.treatmentDescription}
                    med={take.med}
                    onTakePress={toggleTakeTaken}
                    validateModalFun={changeTreatments}
                  />

                </View>
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
    </SafeAreaView>
  );

}
