import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as Icon from "react-native-feather";
import { getAllMed } from "../../dao/Meds";
import {
  addItemToList,
  getAllTreatments,
  getTreatmentByName,
  initTreatments,
} from "../../dao/Storage";
import { styles } from "../../style/style";
import Treatment from "../component/Treatment";
import { SafeAreaView } from "react-native-safe-area-context";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalComponent from "../component/Modal";
import { BlurView } from "expo-blur";
import TutorialBubble from "../component/TutorialBubble";

export default function Suivis({ navigation }) {
  const isFocused = useIsFocused();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [takes, setTakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scroll, setScroll] = useState(0);

  const [tutoTreatment, setTutoTreatment] = useState(null);
  const [tutoStep, setTutoStep] = useState(0);

  const handleTuto = (isClicked) => {
    setTutoStep(tutoStep + 1);
    console.log(tutoStep);
    if (tutoStep === 3) {
      AsyncStorage.setItem("TutoTreatment", "1");
      navigation.navigate("Map");
    }
  };

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
        });
      }
    });
    setTreatments(treatments);
    AsyncStorage.setItem("treatments", JSON.stringify(treatments));
  };

  const toggleTakeTaken = (tak: Take) => {
    let takesUpdate = [...takes];
    takesUpdate.forEach((take) => {
      if (
        take.take.date === tak.date &&
        take.treatmentName === tak.treatmentName
      ) {
        take.take.taken = !take.take.taken;
      }
    });
    setTakes(takesUpdate);
    changeTreatments(tak);
  };

  function compareDates(
    targetDate,
    currentDate = new Date()
  ): "previous" | "actual" | "next" {
    // Set the time to midnight for both dates
    const today = new Date(currentDate);
    const dateObj = new Date(targetDate);
    dateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Compare using ISO date strings
    let fourHoursAgo = new Date(currentDate);
    fourHoursAgo.setHours(currentDate.getHours() - 6);
    if (new Date(targetDate) <= fourHoursAgo) {
      return "previous";
    } else if (dateObj.toISOString() > today.toISOString()) {
      return "next";
    } else {
      return "actual";
    }
  }

  async function getTreatments() {
    const treatments = await getAllTreatments();
    setTreatments(treatments);
    console.log("Treatments");
  }

  async function getTakes() {
    const takes = await initTreatments();
    takes.sort((a, b) => {
      const dateA = new Date(a.take.date);
      const dateB = new Date(b.take.date);
      return dateA.getTime() - dateB.getTime();
    });
    setTakes(takes);
    console.log("Takes");
  }

  const init = async () => {
    setTutoTreatment(await AsyncStorage.getItem("TutoTreatment"));
    await getTreatments();
    await getTakes();
    setIsLoading(false);

    let actualIndex = null;
    takes.length !== 0
      ? takes.findIndex((take) => compareDates(take.take.date) === "actual")
        ? (actualIndex = takes.findIndex(
            (take) => compareDates(take.take.date) === "actual"
          ))
        : (actualIndex = takes.findIndex(
            (take) => compareDates(take.take.date) === "previous"
          ))
      : null;

    console.log(actualIndex);
    setScroll(actualIndex);
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
      setIsLoading(true);

      init();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {tutoStep === 0 && tutoTreatment === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "2%", left: "2%" }}
          text={
            "Voici la page des suivis,\nvous pourrez voir tes futurs traitements.1/4"
          }
        ></TutorialBubble>
      )}
      {tutoStep === 1 && tutoTreatment === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "64%", left: "12%" }}
          text={"C'est ici que ce passe la création \nd'un traitement, 2/4"}
        ></TutorialBubble>
      )}
      {tutoStep === 2 && tutoTreatment === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "1%", left: "40%" }}
          text={
            "Et c'est dans le Stock, \noù vous retrouvez tous \ntes médicaments , 3/4"
          }
        ></TutorialBubble>
      )}
      {tutoStep === 3 && tutoTreatment === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "75%", left: "33%" }}
          text={"On va passer ensuite\nau prochain onglet, 4/4"}
        ></TutorialBubble>
      )}
      {isLoading ? (
        <View
          style={{
            backgroundColor: "white",
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            flex: 1,
            zIndex: 10,
          }}
          className="px-0"
        >
          <Image
            className=" object-cover h-24 w-48 self-center"
            source={require("../../assets/logo_title_gaia.png")}
          />
          <ActivityIndicator size={40} color="#9CDE00" />
          <Text
            style={{
              color: "#9CDE00",
              fontSize: 20,
              marginTop: 50,
              textAlign: "center",
            }}
          >
            Chargement des traitements...
          </Text>
        </View>
      ) : null}
      {takes && takes.length !== 0 ? (
        <View className=" flex border-1">
          <View className="flex-row justify-between items-center px-5 py-2 border-b border-gray-200">
            <Text className=" text-4xl font-bold pt-3">À venir</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddTreatment")}
            >
              <Text className=" text-[#9CDE00] text-lg font-bold">Ajouter</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 160,
            }}
            //initialScrollIndex={scroll}
            ref={(ref) => (this.flatList = ref)}
            showsVerticalScrollIndicator={false}
            data={takes}
            keyExtractor={(take, index) => index.toString()}
            onContentSizeChange={() => {
              if (
                this.flatList &&
                this.flatList.scrollToIndex &&
                takes &&
                takes.length
              ) {
                this.flatList.scrollToIndex({ index: scroll });
              }
            }}
            onScrollToIndexFailed={() => {}}
            renderItem={({ item }) => {
              return (
                <Treatment
                  onPress={null}
                  status={compareDates(item.take.date)}
                  take={item.take}
                  treatmentName={item.treatmentName}
                  treatmentDescription={item.treatmentDescription}
                  med={item.med}
                  onTakePress={toggleTakeTaken}
                  validateModalFun={changeTreatments}
                />
              );
            }}
          />
        </View>
      ) : (
        <View
          style={{
            padding: 10,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 200,
          }}
        >
          <Text
            style={{
              color: "rgb(103, 33, 236)",
              fontSize: 20,
              marginBottom: 100,
            }}
          >
            Aucun traitement à venir
          </Text>
          <Image
            source={require("./../../assets/heureux.png")}
            style={{
              width: 200,
              height: 200,
              resizeMode: "contain",
              marginBottom: 100,
            }}
          />
          <TouchableOpacity
            style={{ backgroundColor: "rgb(103, 33, 236)", borderRadius: 10 }}
            onPress={() => navigation.navigate("AddTreatment")}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textAlign: "center",
                padding: 10,
              }}
            >
              Ajouter un traitement
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
