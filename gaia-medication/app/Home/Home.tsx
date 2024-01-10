import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import callGoogleVisionAsync from "../../OCR/helperFunctions";
import { styles } from "../../style/style";
import AvatarButton from "../component/Avatar";
import { getAllTreatments, getUserByID, initTreatments, readList } from "../../dao/Storage";
import { Bell } from "react-native-feather";
import { Button, Input } from "react-native-elements";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Notifications from "expo-notifications";
import { trouverNomMedicament } from "../../dao/Search";
import Loading from "../component/Loading";

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [takes, setTakes] = useState([]);
  const [nextTake, setNextTake] = useState(-1);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [header, setHeader] = useState(true);

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

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Home Page");
      init();
    }
  }, [isFocused]);

  return (
    <View className=" flex bg-white w-full h-full" style={{ gap: 0 }}>
      <Image
        className=" object-cover h-12 w-24 self-center mt-2"
        source={require("../../assets/logo_title_gaia.png")}
      ></Image>
      <View className=" flex bg-white w-full h-full flex-1" style={{ gap: 20 }}>
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


