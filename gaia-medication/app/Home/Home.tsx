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
import { getUserByID, readList } from "../../dao/Storage";
import { Bell } from "react-native-feather";
import { Button, Input } from "react-native-elements";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from "react-native-feather";


import * as Notifications from "expo-notifications";
import { trouverNomMedicament } from "../../dao/Search";
import Loading from "../component/Loading";
import { initDailyNotifications } from "../Handlers/NotificationsHandler";

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [header, setHeader] = useState(true);
  const [notificationsList, setNotificationsList] = useState<Notif[]>([]);

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
    const notifs = await initDailyNotifications(user?.firstname);
    setNotificationsList(notifs);
    console.log("Notifs Totales :", notifs.length);
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

  return (
    <View className=" flex bg-white w-full h-full flex-1" style={{ gap: 20 }}>
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
                <TouchableOpacity style={{ marginHorizontal: 13 }} onPress={() => navigation.navigate("Notifications", { data: JSON.stringify(notificationsList) })}>
                  <Icon.Bell stroke="#242424" width={24} height={24}></Icon.Bell>
                  
                </TouchableOpacity>
                
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
        </>
      )}
      {loading && <Loading />}
    </View>
  );
}
