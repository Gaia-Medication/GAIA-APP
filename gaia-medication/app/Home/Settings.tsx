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


export default function Settings({ navigation: Navigation }) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const dateNotification = new Date();
  const settingsData = [
    { id: 'UsersSettings', title: 'User Settings' },
    { id: 'NotificationsSettings', title: 'Notifications Settings' },
  ];
  const handleItemClick = (pageId) => {
    // Navigate to the selected settings page
    Navigation.navigate(pageId);
  };
  

  const isFocused = useIsFocused();
  useEffect(() => {
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

  const notifDaily = async () => {
    dateNotification.setHours(18, 37, 0, 0);
    const dateTake = new Date();
    dateTake.setHours(22, 0, 0, 0);
    const notif = await notificationDaily(
      "Nathan",
      [{
        hour: dateTake,
        med: "Doliprane",
      }],
      dateNotification
      );
  }

  return (
    <SafeAreaView>
      <Text>Settings</Text>
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
        onPress={() => Navigation.navigate("CreateProfile")}
      ></Button>
      <Button
        title="MODIFY PROFILE"
        onPress={() => Navigation.navigate("ModifyProfile")}
      ></Button>
      <Button onPress={() => notifDaily()} title="Notification quotidienne" />
      <Button onPress={notificationForgot} title="Notification oubli" />
      <Button onPress={showTreatments} title="Liste des traitements" />
      <Button onPress={deleteTreatments} title="Supprimer traitements" />
      <Button onPress={createTreatmentTest1} title="TraitementTest 1" />
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
      <FlatList
        data={settingsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemClick(item.id)} style={{ padding: 18, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: "#333333", fontWeight: "700", fontSize: 18 }}>{item.title}</Text>
            <Icon.ChevronRight color="#363636" width={23} height={23} />
          </TouchableOpacity>
        )}
      />
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginVertical: 15 }}>
        <View style={{ width: "90%", height: 1, backgroundColor: "#444444" }} />
      </View>
      <TouchableOpacity onPress={() => console.log("DELETE ACC")} style={{ padding: 18, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: "#FF0000", fontWeight: "700", fontSize: 18 }}>Delete Account</Text>
        <Icon.Trash color="#FF0000" width={23} height={23} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}
