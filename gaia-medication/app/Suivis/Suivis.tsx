import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import {
  addItemToList,
  changeTreatments,
  getAllTreatments,
  getTreatmentByName,
  getUserByID,
  initTreatments,
  saveNotifs,
} from "../../dao/Storage";
import { styles } from "../../style/style";
import Treatment from "../component/Treatment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TutorialBubble from "../component/TutorialBubble";
import * as Notifications from "expo-notifications";
import { ArrowRightCircle, XCircle } from "react-native-feather";
import { initDailyNotifications, initLateNotifications, initTakeNotifications } from "../Handlers/NotificationsHandler";
import { UserContext } from "app/contexts/UserContext";
import ButtonA from "app/component/ButtonA";

export default function Suivis({ navigation }) {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("Profile must be used within a UserProvider");
  }
  const { user, setUser } = userContext;

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
    takes.length !== 0 && (actualIndex = takes.findIndex(
      (take) => compareDates(take.take.date) === "actual"
    ))
    actualIndex == -1 && (actualIndex = takes.findIndex(
      (take) => compareDates(take.take.date) === "next")
    )
    setScroll(actualIndex);
  }

  const init = async () => {
    let loadingTimeout;

    const loadingPromise = new Promise(() => {
      loadingTimeout = setTimeout(() => {
        setIsLoading(true);
      }, 500);
    });
    const operationsPromise = (async () => {
      setTutoTreatment(await AsyncStorage.getItem("TutoTreatment"));
      await getTreatments();
      await getTakes();
    })();

    await Promise.race([loadingPromise, operationsPromise]);
    await operationsPromise;

    clearTimeout(loadingTimeout);
    setIsLoading(false);

    console.log("Current User : ", user);
    const notifsDaily = await initDailyNotifications(user?.firstname, user?.id);
    const notifsTakes = await initTakeNotifications(user?.firstname, user?.id);
    const notifsLate = await initLateNotifications(user?.firstname, user?.id);
    console.log("Notifs Daily Totales :", notifsDaily.length);
    console.log("Notifs Take Totales :", notifsTakes.length);
    console.log("Notifs Late Totales :", notifsLate.length);
    console.log(
      "NOTIFS ACTIVES : ",
      (await Notifications.getAllScheduledNotificationsAsync()).length
    );
    //AsyncStorage.setItem("notifications", JSON.stringify(notificationsList));
    saveNotifs(notifsDaily.concat(notifsTakes).concat(notifsLate));
    console.log("Traitements :", await getAllTreatments());
  }

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Suivis Page");
      init();
    }
  }, [isFocused]);

  return (
    <SafeAreaView className=" flex bg-white w-full h-full dark:bg-grey-100">
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
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            flex: 1,
            zIndex: 10,
          }}
          className="px-0 bg-white dark:bg-[#131f24]"
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
              try {
                if (
                  this.flatList &&
                  this.flatList.scrollToIndex &&
                  takes &&
                  takes.length
                ) {
                  this.flatList.scrollToIndex({ index: scroll });
                }
              }
              catch { }
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
        <View className="flex flex-col justify-around items-center h-full w-full">
          <Text className="text-2xl font-medium text-center text-neutral-300">
            Aucun traitement en cours
          </Text>
          <Image
            className=" h-[150px] w-[150px] -mt-[40%] -mb-[20%]"
            source={require("../../assets/suivis.png")}
          />
          <ButtonA
            onPress={() => navigation.navigate("AddTreatment", { user: user })}
            title="Ajouter un traitement"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
