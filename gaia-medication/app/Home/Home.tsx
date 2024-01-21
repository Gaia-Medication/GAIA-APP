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
  saveNotifs,
} from "../../dao/Storage";
import { styles } from "../../style/style";
import AvatarButton from "../component/Avatar";
import * as Icon from "react-native-feather";
import { trouverNomMedicament } from "../../dao/Search";
import Loading from "../component/Loading";
import { initDailyNotifications, initLateNotifications, initTakeNotifications } from "../Handlers/NotificationsHandler";
import TutorialBubble from "../component/TutorialBubble";
import ModalComponent from "../component/Modal";
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import * as Notifications from 'expo-notifications';

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [takes, setTakes] = useState(null);
  const [stock, setStock] = useState(null);
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
    
    const currentId = await AsyncStorage.getItem("currentUser");
    const isFirstConnection = await AsyncStorage.getItem("isFirstConnection");
    setTutoHome(await AsyncStorage.getItem("TutoHome"));
    const current = await getUserByID(JSON.parse(currentId));
    if (userList.length < 1 || isFirstConnection === "true") {
      // L'utilisateur se connecte pour la première fois
      // Reinitialisation du tutoriel 
      AsyncStorage.setItem("TutoHome", "0");
      AsyncStorage.setItem("TutoCreate", "0");
      AsyncStorage.setItem("TutoSearch", "0");
      AsyncStorage.setItem("TutoMedic", "0");
      AsyncStorage.setItem("TutoMap", "0");
      AsyncStorage.setItem("TutoTreatment", "0");
      AsyncStorage.setItem("TutoSettings", "0");
      navigation.navigate("CreateProfile");
    } else {
      console.log(current);
      setUser(current);
    }
    const notifsDaily = await initDailyNotifications(current?.firstname, current?.id);
    const notifsTakes = await initTakeNotifications(current?.firstname, current?.id);
    const notifsLate = await initLateNotifications(current?.firstname, current?.id);

    //setNotificationsList(notifsDaily);
    console.log("Notifs Quotidiennes Totales :", notifsDaily.length);
    console.log("Notifs Prises Totales :", notifsTakes.length);
    console.log("Notifs Retards Totales :", notifsLate.length);
    console.log("TOUTES NOTIF ", (await Notifications.getAllScheduledNotificationsAsync()).length);
    setNotificationsList(notifsDaily.concat(notifsTakes).concat(notifsLate));
    console.log("Notifs Totales :", notifsDaily.concat(notifsTakes).concat(notifsLate));
    AsyncStorage.setItem("notifications", JSON.stringify(notifsDaily.concat(notifsTakes).concat(notifsLate)));
    saveNotifs(notifsDaily.concat(notifsTakes).concat(notifsLate));
  };


  const initUserInfo = async ()=>{
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
    setNextTake(nextTakeIndex) 
    setTakes(todaysTakes.filter(take=>take.take.userId==user.id));
    
    const stockList = await readList("stock");
    const stockListFilter=stockList.filter((item) => item.idUser == user.id);
    const stockListFilterGrouped = stockListFilter.reduce((result, current) => {
      const key = current.CIS;
      if (!result[key]) {
        result[key] = { ...current };
      } else {
        result[key].qte += current.qte;
      }
      return result;
    }, {});
    
    const actualStock = Object.values(stockListFilterGrouped);
    setStock(actualStock)
  }

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
      const scanMedsFinded = trouverNomMedicament(
        googleText.text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace("Ⓡ", "")
      );
      if (scanMedsFinded.meds.length > 0) {
        setLoading(false);
        if(scanMedsFinded.ordonnanceBool){
          navigation.navigate("AddTreatment", { drugScanned: scanMedsFinded.meds })
        }else{
          navigation.navigate("Drug", { drugCIS: scanMedsFinded.meds[0].med.CIS })
        }
      } else {
        setLoading(false);
        Dialog.show({
          type: ALERT_TYPE.WARNING, 
          title: "Aucun médicament détecté", 
          textBody: "Veuillez réessayer avec une autre photo",
          button: 'Fermer'
        });
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Home Page");
      init();
    }
  }, [isFocused]);

  
  useEffect(() => {
    if(user)initUserInfo()
  }, [user]);

  const handleTuto = (isClicked: boolean) => {
    if (tutoHome === "1") {
      AsyncStorage.setItem("TutoHome", "2");
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
    <AlertNotificationRoot>
      <Image
        className=" object-cover h-12 w-24 self-center mt-2"
        source={require("../../assets/logo_title_gaia.png")}
      ></Image>
      <View className=" flex bg-white w-full h-full flex-1" style={{ gap: 20 }}>
      {user && takes && stock && (
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
                "Voici votre avatar,\ncliquer dessus\npour accéder à vos profils,\nou en ajouter d'autre, 2/3"
              }
            ></TutorialBubble>
          )}

          {smallTutoStep === 2 && tutoHome === "0" && (
            <TutorialBubble
              isClicked={handleTuto}
              styleAdded={{ top: "35%", left: "6%" }}
              text={
                "Voici la barre de recherche,\nvous pouvez chercher et scanner des médicaments, 3/3"
              }
            ></TutorialBubble>
          )}

          {tutoHome === "1" && (
            <TutorialBubble
              isClicked={handleTuto}
              styleAdded={{ top: "70%", left: "8%" }}
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
                  <Text style={styles.title} className="text-neutral-800">{user?.firstname}</Text>
                </View>
                <TouchableOpacity style={{ marginHorizontal: 13 }} onPress={() => navigation.navigate("Notifications", { data: JSON.stringify(notificationsList) })}>
                  <Icon.Bell stroke="#242424" width={24} height={24}></Icon.Bell>
                  
                </TouchableOpacity>
                
              </>
            )}
          </View>
          <View style={styles.searchContainer}>
            <Text style={styles.title2} className="text-neutral-700">Recherche d’un médicament</Text>
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
            <Text style={styles.title2} className="text-neutral-700">Suivis d'un traitement</Text>
          </View>
          <FlatList
          className=" flex-grow-0" 
          contentContainerStyle={{paddingHorizontal:25}}
          ref={(ref) => (this.flatList = ref)}
          onContentSizeChange={() => {
            try{
              if (
                this.flatList &&
                this.flatList.scrollToIndex &&
                takes &&
                takes.length
              ) {
                this.flatList.scrollToIndex({ index: nextTake<0?takes.length-1:nextTake });
              }
            }
            catch{}
          }}
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
              borderColor:  nextTake !== index ? "#BCBCBC90" : "#9CDE00",
              padding: 15,
            }}
              onPress={()=>navigation.navigate("SuivisHandler",{screen:"Suivis"})}
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
          {takes && takes.length<1 && (
            <TouchableOpacity className="flex justify-center items-center"
            onPress={()=>navigation.navigate("SuivisHandler",{screen:"Suivis"})}>
              <Image className="w-24 h-24 -mt-4" source={require("../../assets/prescription.png")} />
              <Text className="mt-2 text-base text-[#51a6ec]">Aucune prise à prendre aujoud'hui</Text>
            </TouchableOpacity>
          )}
          <View className="flex justify-center items-center mt-2">
            <TouchableOpacity onPress={()=>navigation.navigate("SuivisHandler",{screen:"Stock"})} 
            className=" rounded-3xl bg-[#9CDE00] flex-row items-center justify-center p-4 w-68">
              <Image className="h-5 w-5" source={require("../../assets/stock.png")} />
              <Text className="ml-2 text-base text-white font-bold">{stock.length} Medicaments en stock</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      </View>
      {loading && <Loading />}
    </AlertNotificationRoot>
    </View>
  );
}


