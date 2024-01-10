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
  FlatList,
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
import * as Icon from "react-native-feather";
import { trouverNomMedicament } from "../../dao/Search";
import Loading from "../component/Loading";
import { initDailyNotifications } from "../Handlers/NotificationsHandler";
import TutorialBubble from "../component/TutorialBubble";
import Stock from "../Suivis/Stock";

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [takes, setTakes] = useState([]);
  const [nextTake, setNextTake] = useState(-1);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [header, setHeader] = useState(true);
  const [notificationsList, setNotificationsList] = useState<Notif[]>([]);

  const [smallTutoStep, setSmallTutoStep] = useState(0);
  const [tutoHome, setTutoHome] = useState(null);
  const formatHour = (hour) => {
    if (hour instanceof Date) {
      const hours = hour.getHours();
      const minutes = hour.getMinutes();
      const formattedTime = `${hours.toString()}:${minutes.toString().padStart(2, '0')}`;
      return formattedTime;
    }
    return "";
  };

  const init = async () => {
    const userList = await readList("users");
    setUsers(userList);
    const takes = await initTreatments();
    takes.sort((a, b) => {
      const dateA = new Date(a.take.date);
      const dateB = new Date(b.take.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);

    const todaysTakes = takes.filter((take) => {
      const currentDate = new Date(take.take.date);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate.toISOString() === today.toISOString();
    });
    const now = new Date();
    const nextTakeIndex = todaysTakes.findIndex((take) => {
      const takeDate = new Date(take.take.date);
      return takeDate > now;
    });
    console.log(nextTakeIndex)
    setNextTake(nextTakeIndex) 
    setTakes(todaysTakes);
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
    const notifs = await initDailyNotifications(user?.firstname, user?.id);
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
    <View className=" flex bg-white w-full h-full" style={{ gap: 0 }}>
      <Image
        className=" object-cover h-12 w-24 self-center mt-2"
        source={require("../../assets/logo_title_gaia.png")}
      ></Image>
      <View className=" flex bg-white w-full h-full flex-1" style={{ gap: 20 }}>
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
            <FlatList
            className=" flex-grow-0" 
            contentContainerStyle={{paddingHorizontal:25}}
            data={takes}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{width: 25}} />}
            renderItem={({item, index}) => (
              <TouchableOpacity style={{
                alignItems: "center",
                zIndex: 1,
                width: 200,
                backgroundColor:  "#BCBCBC10",
                borderRadius: 17,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor:  "#BCBCBC90",
                padding: 15,
              }}
                onPress={()=>navigation.navigate("SuivisHandler")}
              >
                <View style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
                  <View className="flex-1 items-center mx-2"
                  style={{
                    backgroundColor: nextTake !== index ? "#BCBCBC40" : "#9CDE00",
                    borderRadius: 100,
                    padding: 5,
                  }}>
                    <Text style={{ color: nextTake !== index ? null : "white", fontWeight: "700", fontSize: 12,lineHeight:14, maxWidth: 180 }} numberOfLines={1} ellipsizeMode="tail">{item.take.treatmentName}</Text>
                  </View>
                  <Text className="mx-2" style={{ fontWeight: "700",fontSize:16, }}>{formatHour(new Date(item.take.date))}</Text>
                </View>
        
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, }}>
                  {/* <Icon.Info color={nextTake !== index ? "#BCBCBC" : "#9CDE00"} width={25} height={25} /> */}
                  <Text style={{ fontWeight: "bold", color: "#444444" }} ellipsizeMode="tail" numberOfLines={1}>{item.med ? item.med + " x " + item.take.quantity : null}</Text>
                </View>
        
                <View style={{ paddingHorizontal: 30,marginTop:10, display: "flex", flexDirection: "row", gap: 15 }} >
                  <View style={{
                    backgroundColor: nextTake !== index ? "#BCBCBC90" : "#9CDE00",
                    width: 5,
                    borderRadius: 100,
        
                  }} />
                  <View>
                    <Text style={{ color: nextTake !== index  ? "#7B7B7B" : "black", fontWeight: "bold" }}>Description :</Text>
                    <Text style={{ color: "#C9C9C9", fontWeight: "700" }} numberOfLines={3} ellipsizeMode="tail">{item.treatmentDescription ? item.treatmentDescription : "Aucune description..."}</Text>
                  </View>
        
                </View>
              </TouchableOpacity>
            )}
            />
          
          <View style={styles.traitementContainer}>
            <Text style={styles.title2}>Stock</Text>
          </View>
        </>
      )}
      </View>
      {loading && <Loading />}
    </View>
  );
}


