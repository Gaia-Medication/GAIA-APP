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
  changeTreatments,
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
import * as Notifications from "expo-notifications";
import TutorialBubble from "../component/TutorialBubble";

import { ArrowRightCircle, XCircle } from "react-native-feather";

export default function Suivis({ navigation }) {
  const isFocused = useIsFocused();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [takes, setTakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
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
    const newTreatments = changeTreatments(tak).then((res) => {
      setTreatments(res);
    });
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
    fourHoursAgo.setHours(currentDate.getHours() - 4);
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
  }

  async function getTakes() {
    const takes = await initTreatments();
    takes.sort((a, b) => {
      const dateA = new Date(a.take.date);
      const dateB = new Date(b.take.date);
      return dateA.getTime() - dateB.getTime();
    });
    const currentId = await AsyncStorage.getItem("currentUser");
    setTakes(takes.filter((take) => take.take.userId == currentId));

    let actualIndex = null;
    takes.length !== 0&&(actualIndex = takes.findIndex(
      (take) => compareDates(take.take.date) === "actual"
    ))
    actualIndex==-1&&(actualIndex = takes.findIndex(
      (take) => compareDates(take.take.date) === "next")
    )
    console.log(actualIndex)
    setScroll(actualIndex);
    console.log("Takes");
  }

  const init = async () => {
    setTutoTreatment(await AsyncStorage.getItem("TutoTreatment"));
    await getTreatments();
    await getTakes();
    setIsLoading(false);
    console.log("Takes");
  }

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      console.log("Nav on Suivis Page");
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
      {isLoading && (
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
            className=" object-cover h-24 w-48 self-center -mt-[50%]"
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
      )}
      {takes && takes.length !== 0 ? (
        <View className=" flex border-1">
          <View className="flex-row justify-between items-center px-5 py-2 border-b border-gray-200">
            <Text className=" text-4xl font-bold pt-3">À venir</Text>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ManageTreatments")}
              >
                <Text className=" text-[#9CDE00] text-lg font-bold">Gestion</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddTreatment")}
              >
                <Text className=" text-[#9CDE00] text-lg font-bold">Ajouter</Text>
              </TouchableOpacity>
            </View>


          </View>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 160,
            }}
            ref={(ref) => (this.flatList = ref)}
            showsVerticalScrollIndicator={false}
            data={takes}
            keyExtractor={(take, index) => index.toString()}
            onContentSizeChange={() => {
              try{
                if (
                  this.flatList &&
                  this.flatList.scrollToIndex &&
                  takes &&
                  takes.length
                ) {
                  this.flatList.scrollToIndex({ index: scroll });
                }
              }
              catch{}
            }}
            onScrollToIndexFailed={() => { }}
            renderItem={({ item }) => {
              return (
                <Treatment
                  navigation={navigation}
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
        <View className="flex flex-col justify-around items-center h-[98%] w-full">
          <Text className="text-2xl font-medium text-center text-neutral-300">
            Aucun traitement à venir
          </Text>
          <Image
            className=" h-[150px] w-[150px] -mt-[40%] -mb-[20%]"
            source={require("../../assets/prescription(1).png")}
          />
          <TouchableOpacity
            className="bg-lime-400 rounded-2xl flex flex-row justify-center items-center p-2 px-8 "
            onPress={() => navigation.navigate("AddTreatment")}
          >
            <Text className="text-center text-white font-semibold text-lg p-2">
              Ajouter un traitement
            </Text>
            <ArrowRightCircle color="white" height={30} width={30} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
