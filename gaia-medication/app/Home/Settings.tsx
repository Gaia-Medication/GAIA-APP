import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  requestNotificationPermissions,
  notificationDaily,
  notificationNow,
  notificationForgot,
} from "./../Handlers/NotificationsHandler";
import data from "./../Suivis/treatment.json";
import { getAllTreatments, getUserByID, readList } from "../../dao/Storage";
import * as Icon from "react-native-feather";
import TutorialBubble from "../component/TutorialBubble";

import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { getMedbyCIS } from "../../dao/Meds";

export default function Settings({ navigation }) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [debug, setDebug] = useState(false);
  const dateNotification = new Date();
  const settingsData = [
    { id: "ModifyProfile", title: "Paramètres des Profils" },
    { id: "NotificationsSettings", title: "Pramètres des Notifications" },
  ];
  const handleItemClick = (pageId) => {
    // Navigate to the selected settings page
    navigation.navigate(pageId);
  };

  const [tutoSettings, setTutoSettings] = useState(null);

  const tuto = async () => {
    setTutoSettings(await AsyncStorage.getItem("TutoSettings"));
  };

  function formaterDate(date) {
    const heures = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const jour = date.getDate().toString().padStart(2, "0");
    const mois = (date.getMonth() + 1).toString().padStart(2, "0");
    const annee = date.getFullYear();

    return `${heures}:${minutes} ${jour}/${mois}/${annee}`;
  }

  const handleTuto = (isClicked) => {
    AsyncStorage.setItem("TutoSettings", "1");
    navigation.navigate("Home");
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    tuto();
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
    AsyncStorage.removeItem("users"), AsyncStorage.removeItem("stock");
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
    <SafeAreaView className="h-full w-full bg-white">
      {tutoSettings === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "70%", left: "1%" }}
          text={
            "Nous arrivons déjà à la fin, avec la page des réglages, maintenant vous pouvez profiter et découvrir de tout ce que Gaïa à vous offrir!"
          }
        ></TutorialBubble>
      )}
      {debug && (
        <>
          <Button
            title="CLEAR USERS DATA"
            onPress={() => (
              AsyncStorage.removeItem("users"), AsyncStorage.removeItem("stock")
            )}
          />
          <Button
            title="CLEAR STOCK DATA"
            onPress={() => AsyncStorage.removeItem("stock")}
          />
          <Button
            title="ADD PROFILE"
            onPress={() => navigation.navigate("CreateProfile")}
          ></Button>
          <Button
            title="MODIFY PROFILE"
            onPress={() => navigation.navigate("ModifyProfile")}
          ></Button>
          <Button onPress={showTreatments} title="Liste des traitements" />
          <Button onPress={deleteTreatments} title="Supprimer traitements" />
          <Button onPress={createTreatmentTest1} title="TraitementTest 1" />
          <Button onPress={reset} title="reset" />
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

      <TouchableOpacity
        onPress={() => {
          setDebug(!debug);
        }}
      >
        <Text className="text-center text-[#9CDE00] mt-3 font-bold">
          TOGGLE DEBUG
        </Text>
      </TouchableOpacity>
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
                style={{ color: "#404040", fontWeight: "400", fontSize: 16 }}
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
    </SafeAreaView>
  );
}
