import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { Bell } from "react-native-feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import callGoogleVisionAsync from "../../OCR/helperFunctions";
import {
  getAllTreatments,
  getUserByID,
  initTreatments,
  readList,
} from "../../dao/Storage";
import { styles } from "../../style/style";
import AvatarButton from "../component/Avatar";

import * as Notifications from "expo-notifications";
import { trouverNomMedicament } from "../../dao/Search";
import Loading from "../component/Loading";
import TutorialBubble from "../component/TutorialBubble";
import Stock from "../Suivis/Stock";

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [takes, setTakes] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [header, setHeader] = useState(true);

  const [smallTutoStep, setSmallTutoStep] = useState(0);
  const [tutoHome, setTutoHome] = useState("0");

  const init = async () => {
    const userList = await readList("users");
    setUsers(userList);
    setTreatments(await getAllTreatments());
    const takes = await initTreatments();
    takes.sort((a, b) => {
      const dateA = new Date(a.take.date);
      const dateB = new Date(b.take.date);
      return dateA.getTime() - dateB.getTime();
    });
    setTakes(takes);
    const currentId = await AsyncStorage.getItem("currentUser");
    const isFirstConnection = await AsyncStorage.getItem("isFirstConnection");
    setTutoHome(await AsyncStorage.getItem("TutoHome"));
    if (userList.length < 1 || isFirstConnection === "true") {
      // L'utilisateur se connecte pour la première fois
      AsyncStorage.setItem("TutoHome", "0");
      AsyncStorage.setItem("TutoCreate", "0");
      AsyncStorage.setItem("TutoSearch", "0");
      AsyncStorage.setItem("TutoMedic", "0");
      AsyncStorage.setItem("TutoMap", "0");
      AsyncStorage.setItem("TutoTreatment", "0");
      AsyncStorage.setItem("TutoSettings", "0");
      navigation.navigate("CreateProfile");
    } else {
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

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Home Page");
      init();
    }
  }, [isFocused]);

  const handleTuto = (isClicked: boolean) => {
    if (tutoHome === "1") {
      navigation.navigate("SuivisHandler");
    }
    if (smallTutoStep === 2) {
      AsyncStorage.setItem("TutoHome", "1");
      navigation.navigate("Search");
    }
    if (isClicked) {
      setSmallTutoStep(smallTutoStep + 1);
    }
  };

  return (
    <View className=" flex bg-white w-full h-full flex-1" style={{ gap: 20 }}>
      <Image
        className=" object-cover h-12 w-24 self-center"
        source={require("../../assets/logo_title_gaia.png")}
      ></Image>
      {user && (
        <>
          {smallTutoStep === 0 && tutoHome === "0" && (
            <TutorialBubble
              isClicked={handleTuto}
              styleAdded={{ top: "40%", left: "10%" }}
              text={"Bienvenue sur l'accueil de Gaïa, 1/3"}
            ></TutorialBubble>
          )}

          {smallTutoStep === 1 && tutoHome === "0" && (
            <TutorialBubble
              isClicked={handleTuto}
              styleAdded={{ top: "20%", left: "18%" }}
              text={
                "Voici votre avatar,\ncliquez dessus\npour accéder à vos profils,\n ou en ajouter d'autre, 2/3"
              }
            ></TutorialBubble>
          )}

          {smallTutoStep === 2 && tutoHome === "0" && (
            <TutorialBubble
              isClicked={handleTuto}
              styleAdded={{ top: "35%", left: "6%" }}
              text={
                "Voici la barre de recherche,\nvous pouvez chercher et scannez des médicaments, 3/3"
              }
            ></TutorialBubble>
          )}

          {tutoHome === "1" && (
            <TutorialBubble
              isClicked={handleTuto}
              styleAdded={{ top: "75%", left: "8%" }}
              text={
                "Voici la barre de navigation, \nnous allons y faire un petit détour, 1/1"
              }
            ></TutorialBubble>
          )}

          <View style={styles.header}>
            <AvatarButton
              onPress={handleAvatarButton}
              users={users}
              current={user}
              setUser={setUser}
              navigation={navigation}
              tuto={smallTutoStep === 1}
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
          <TouchableOpacity
            onPress={() => navigation.navigate("Suivis")}
            style={styles.searchQR}
          ></TouchableOpacity>
        </>
      )}
      {loading && <Loading />}
    </View>
  );
}
