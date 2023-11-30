import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import callGoogleVisionAsync from "../../OCR/helperFunctions";
import { styles } from "../../style/style";
import AvatarButton from "../component/Avatar";
import { readList } from "../../dao/Storage";
import { getAllMed } from "../../dao/Meds";
import { searchMed } from "../../dao/Search";
import { Bell } from "react-native-feather";
import { Input } from "react-native-elements";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Home({ navigation }) {
  const isFocused = useIsFocused();

  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [header, setHeader] = useState(true);

  const eventHandler = async () => {
    //const isConnected = await AsyncStorage.getItem("users");
    const userList = await readList("users");
    setUsers(userList);
    console.log(userList);
    if (userList.length < 1) {
      // L'utilisateur se connecte pour la première fois
      navigation.navigate("CreateProfile");
    } /*else if(isTutoComplete === null){
        alert("Va falloir faire le tuto bro");
      }*/ else {
      setUser(userList[0]);
    }
  };

  const handleAvatarButton = () => {
    setHeader(!header);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, //return base64 data.
      //this will allow the Vision API to read this image.
    });
    if (!result.canceled) {
      //if the user submits an image,
      //setImage(result.assets[0].uri);
      //run the onSubmit handler and pass in the image data.
      const googleText = await callGoogleVisionAsync(result.assets[0].base64);
      console.log("OCR :", googleText.text);
      alert(googleText.text);
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Home Page");
      eventHandler();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.header}>
            <AvatarButton
              onPress={handleAvatarButton}
              users={users}
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
                  onPressIn={() =>
                    navigation.navigate("Search", { focusSearchInput: true })
                  }
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
    </View>
  );
}
