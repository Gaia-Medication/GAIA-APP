import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import callGoogleVisionAsync from "../../OCR/helperFunctions";
import { styles } from "../../style/style";
import AvatarButton from "../component/Avatar";
import { getAllTreatments, getUserByID, readList } from "../../dao/Storage";
import { Bell } from "react-native-feather";
import { Button, Input } from "react-native-elements";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestNotificationPermissions,
  notificationDaily,
  notificationNow,
  notificationForgot,
} from "./../Handlers/NotificationsHandler";
import * as Notifications from "expo-notifications";
import { trouverNomMedicament } from "../../dao/Search";
import Loading from "../component/Loading";
import data from './../Suivis/treatment.json';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [header, setHeader] = useState(true);
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  const init = async () => {
    const userList = await readList("users");
    setUsers(userList);
    const currentId = await AsyncStorage.getItem("currentUser");
    if (userList.length < 1) {
      // L'utilisateur se connecte pour la première fois
      navigation.navigate("CreateProfile");
    } /*else if(isTutoComplete === null){
        alert("Va falloir faire le tuto bro");
      }*/ else {
      const current = await getUserByID(JSON.parse(currentId));
      console.log(current);
      setUser(current);
    }
    Notifications.addNotificationResponseReceivedListener((notification) => {
      console.log("Action notification => ", notification.actionIdentifier);
    });
  };

  const handleAvatarButton = () => {
    setHeader(!header);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    if (!result.canceled) {
      setLoading(true);
      const googleText = await callGoogleVisionAsync(result.assets[0].base64);
      //console.log("OCR :", googleText.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace('Ⓡ',''));
      const list = trouverNomMedicament(
        googleText.text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace("Ⓡ", "")
      );
      if (list.length > 0) {
        let msg: string = "";
        for (const med of list) {
          msg += med.med + "\nAcc : " + med.score + "%\n\n";
        }
        setLoading(false);
        alert(msg);
      } else {
        setLoading(false);
        alert("Rien");
      }
    }
  };

  const createTreatmentTest1 = async () => {
    const tre=JSON.parse(JSON.stringify(data))
    console.log("tre",tre)
    const treatments = await getAllTreatments();
    if (treatments.find((treatment) => treatment.name === tre.name)) {
      alert("Le traitement existe déjà");
      return;
    }
    treatments.push(tre);
    await AsyncStorage.setItem("treatments", JSON.stringify(treatments));
  }

  const showTreatments = async () => {
    const treatments = await getAllTreatments();
    if(treatments.length==0){
      alert("Vous n'avez pas de traitement")
    } else {
      console.log(treatments);
    console.log(treatments[0].instructions[0].takes);
    console.log(treatments.length)
    }
    
    setTreatments(treatments);
  };
  const deleteTreatments = async () => {
    AsyncStorage.removeItem("treatments");
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Home Page");
      init();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Image
        className=" object-cover h-12 w-24 self-center"
        source={require("../../assets/logo_title_gaia.png")}
      ></Image>
      {user && (
        <>
          <View style={styles.header}>
            <AvatarButton
              onPress={handleAvatarButton}
              users={users}
              current={user}
              setUser={setUser}
              navigation={navigation}
            ></AvatarButton>
            {header && (
              <>
                <View style={styles.titleContainer}>
                  <Text style={styles.subtitle}>Welcome back</Text>
                  <Text style={styles.title}>{user?.firstname}</Text>
                </View>
                <Bell
                  stroke="#242424"
                  width={24}
                  height={24}
                  style={{
                    marginLeft: 13,
                    marginRight: 13,
                  }}
                ></Bell>
              </>
            )}
          </View>
          <View style={styles.searchContainer}>
            <Text style={styles.title2}>Recherche d’un médicament</Text>
            <View style={styles.searchBarwQR}>
              <View style={styles.searchBar}>
                <Input
                  style={styles.searchBarInput}
                  placeholder="Doliprane, Aspirine ..."
                  placeholderTextColor="#9CDE00"
                  leftIcon={{
                    type: "feathers",
                    name: "search",
                    color: "#9CDE00",
                  }}
                  value={""}
                  inputContainerStyle={styles.searchBarContainer}
                  //editable={false}
                  onPressIn={() => navigation.navigate("Search")}
                />
              </View>
              <TouchableOpacity onPress={pickImage} style={styles.searchQR}>
                <MaterialIcons
                  name="qr-code-scanner"
                  size={35}
                  color="#9CDE00"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.traitementContainer}>
            <Text style={styles.title2}>Suivis d'un traitement</Text>
          </View>
          <Button onPress={notificationDaily} title="Notification quotidienne"/>
          <Button onPress={notificationForgot} title="Notification oubli"/>
          <Button onPress={showTreatments} title="Liste des traitements"/>
          <Button onPress={deleteTreatments} title="Supprimer traitements"/>
          <Button onPress={createTreatmentTest1} title="TraitementTest 1"/>
          {treatments && treatments.map((treatment) => { return (
            <View key={treatment.name}>
              <Text>{treatment.name}</Text>
              <Text>{treatment.instructions.length}</Text>
              </View>
         )})}
        {!treatments ? (
            <Text>PAS DE VARIABLE ASYNC TREATMENT</Text>
          ) : treatments.length == 0 ? (
            <Text>TREATMENTS VIDE</Text>
          ) : null}
        </>
      )}
      {loading && <Loading />}
    </View>
  );
}
