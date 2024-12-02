import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import data from "./../Suivis/treatment.json";
import { getAllTreatments, getUserByID } from "../../dao/Storage";
import * as Icon from "react-native-feather";
import TutorialBubble from "../component/TutorialBubble";
import { useColorScheme } from "nativewind";
import { avatars } from "./Settings/AvatarChange";

export default function Settings({ navigation, route }) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [debug, setDebug] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const settingsData = [
    { id: "ModifyProfile", title: "Paramètres des Profils" },
    { id: "NotificationsSettings", title: "Pramètres des Notifications" },
  ];
  const handleItemClick = (pageId) => {
    // Navigate to the selected settings page
    navigation.navigate(pageId);
  };

  const [tutoSettings, setTutoSettings] = useState(null);

  const handleTuto = (isClicked) => {
    AsyncStorage.setItem("TutoSettings", "1");
    navigation.navigate("Home");
  };

  const init = async () => {
    setTutoSettings(await AsyncStorage.getItem("TutoSettings"));
    const currentId = await AsyncStorage.getItem("currentUser");
    const current = await getUserByID(JSON.parse(currentId));
    setUser(current);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    init();
    if (isFocused) {
      console.log("Nav on Settings Page");
    }
  }, [isFocused]);

  const createTreatmentTest1 = async () => {
    const tre = JSON.parse(JSON.stringify(data));
    console.log("tre", tre);
    const treatments = await getAllTreatments();
    if (treatments.find((treatment) => treatment.name === tre.name)) {
      alert("Le traitement existe déjà");
      return;
    }
    treatments.push(tre);
    await AsyncStorage.setItem("treatments", JSON.stringify(treatments));
  };

  const showTreatments = async () => {
    const treatments = await getAllTreatments();
    if (treatments.length == 0) {
      alert("Vous n'avez pas de traitement");
    } else {
      console.log(treatments);
      console.log(treatments[0].instructions[0].takes);
      console.log(treatments.length);
    }

    setTreatments(treatments);
  };
  const deleteTreatments = async () => {
    AsyncStorage.removeItem("treatments");
  };

  const reset = () => {
    AsyncStorage.removeItem("users");
    AsyncStorage.removeItem("stock");
    AsyncStorage.removeItem("treatments");
    AsyncStorage.setItem("isFirstConnection", "true");
    AsyncStorage.setItem("TutoHome", "0");
    AsyncStorage.setItem("TutoCreate", "0");
    AsyncStorage.setItem("TutoSearch", "0");
    AsyncStorage.setItem("TutoMedic", "0");
    AsyncStorage.setItem("TutoMap", "0");
    AsyncStorage.setItem("TutoTreatment", "0");
    AsyncStorage.setItem("TutoSettings", "0");
  };

  return (
    <SafeAreaView className=" flex bg-white w-full h-full dark:bg-[#131f24]">
      {user && (
        <>
          {isFocused && (
            <StatusBar barStyle="dark-content" backgroundColor={user.bgcolor ? user.bgcolor : "#ffeea1"} />
          )}
          {tutoSettings === "0" && (
            <TutorialBubble
              isClicked={handleTuto}
              styleAdded={{ top: "70%", left: "1%" }}
              text={
                "Nous arrivons déjà à la fin, avec la page des réglages, maintenant vous pouvez profiter et découvrir de tout ce que Gaïa à vous offrir!"
              }
            ></TutorialBubble>
          )}
          <View className="w-full h-52 overflow-hidden" style={{backgroundColor:user.bgcolor ? user.bgcolor : "#ffeea1"}}>
            <Pressable
              className="absolute -bottom-1 left-1/2 -translate-x-24"
              onPress={() =>
                navigation.navigate("AvatarChange", { user: user })
              }
            >
              <Image
                className="w-48 h-48"
                source={user.avatar ? avatars[user.avatar] : avatars["man"]}
              />
            </Pressable>
          </View>
          <Text className=" dark:text-slate-50 pb-2 px-6 w-full text-center">
            {user.firstname} {user.lastname}
          </Text>
          <TouchableOpacity
            className="mb-4"
            onPress={() => {
              setDebug(!debug);
            }}
          >
            <Text className="text-center text-[#9CDE00] mt-3 font-bold">
              TOGGLE DEBUG
            </Text>
          </TouchableOpacity>
          {debug && (
            <>
              <Button
                color={"#9CDE00"}
                title="CLEAR USERS DATA"
                onPress={() => (
                  AsyncStorage.removeItem("users"),
                  AsyncStorage.removeItem("stock")
                )}
              />
              <Button
                color={"#9CDE00"}
                title="CLEAR STOCK DATA"
                onPress={() => AsyncStorage.removeItem("stock")}
              />
              <Button
                color={"#9CDE00"}
                title="ADD PROFILE"
                onPress={() => navigation.navigate("CreateProfile")}
              ></Button>
              <Button
                color={"#9CDE00"}
                title="MODIFY PROFILE"
                onPress={() => navigation.navigate("ModifyProfile")}
              ></Button>
              <Button
                color={"#9CDE00"}
                onPress={showTreatments}
                title="Liste des traitements"
              />
              <Button
                color={"#9CDE00"}
                onPress={deleteTreatments}
                title="Supprimer traitements"
              />
              <Button
                color={"#9CDE00"}
                onPress={createTreatmentTest1}
                title="TraitementTest 1"
              />
              <Button color={"#9CDE00"} onPress={reset} title="reset" />
              {treatments &&
                treatments.map((treatment) => {
                  return (
                    <View key={treatment.name}>
                      <Text>{treatment.name}</Text>
                      <Text>{treatment.instructions.length}</Text>
                    </View>
                  );
                })}
              {!treatments ? (
                <Text>PAS DE VARIABLE ASYNC TREATMENT</Text>
              ) : treatments.length == 0 ? (
                <Text>TREATMENTS VIDE</Text>
              ) : null}
            </>
          )}

          <View>
            <FlatList
              data={settingsData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleItemClick(item.id)}
                  style={{
                    padding: 18,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#404040",
                      fontWeight: "400",
                      fontSize: 16,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Icon.ChevronRight color="#404040" width={23} height={23} />
                </TouchableOpacity>
              )}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 15,
              }}
            >
              <View
                style={{ width: "80%", height: 1, backgroundColor: "#dbdbdb" }}
              />
            </View>
          </View>
          <Pressable
            className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900"
            onPress={() => {
              toggleColorScheme();
              AsyncStorage.setItem("darkmode", colorScheme);
            }}
          >
            <Text className="text-black dark:text-white">
              {`Try clicking me! ${colorScheme === "dark" ? "🌙" : "🌞"}`}
            </Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}
