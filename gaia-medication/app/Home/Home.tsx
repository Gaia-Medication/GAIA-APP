import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, NavigationProp, ParamListBase } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

interface IHomeProps {
  navigation: NavigationProp<ParamListBase>;
}
export default function Home({ navigation }: IHomeProps) {
  const isFocused = useIsFocused();

  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const eventHandler = async () => {
      //const isTutoComplete = await AsyncStorage.getItem("tutoComplete");
      const isConnected = await AsyncStorage.getItem("users");
      if (isConnected === null) {
        // L'utilisateur se connecte pour la première fois
        navigation.navigate("CreateProfile");
        
      } /*else if(isTutoComplete === null){
        alert("Va falloir faire le tuto bro");
  
      }*/else{
        setUser(JSON.parse(isConnected));
        console.log("user :",isConnected)
      }
  };

  const updateSearch = (text: string) => {
    setSearch(text);
  };

  useEffect(() => {
    if(isFocused){ 
      console.log("Nav on Home Page")
      eventHandler();
    }
  },[isFocused]); 
  

  return (
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.header}>
            <Text style={styles.subtitle}>Welcome back</Text>
            <Text style={styles.title}>{user.firstname}</Text>
          </View>
          <View style={styles.searchContainer}>
            <Text style={styles.title2}>Recherche d’un médicament</Text>
            <View style={styles.searchBarwQR}>
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.searchBarInput}
                  placeholder="Doliprane, Aspirine ..."
                  onChangeText={updateSearch}
                  value={search}
                />
              </View>
              <Link to={{ screen: "Scan" }} style={styles.searchQR}>
                {/* <Image
      source={{ uri: "App/assets/images/Scan. png" }}
    /> */}
              </Link>
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



const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    gap: 20,
  },
  header: {
    paddingTop: 20,
    display: "flex",
    alignItems: "center",
  },
  searchContainer: {
    display: "flex",
    gap: 10,
    marginHorizontal: 25,
  },
  searchBarwQR: {
    display: "flex",
    gap: 19,
    marginHorizontal: 10,
    flexDirection: "row",
    height: 50,
  },
  searchBar: {
    display: "flex",
    flex: 1,
    backgroundColor: "#A0DB3050",
    borderRadius: 10,
  },
  searchBarInput: {
    display: "flex",
    flex: 1,
    color: "#9CDE00",
    fontSize: 16,
  },
  searchQR: {
    width: 50,
    display: "flex",
    backgroundColor: "#A0DB3050",
    borderRadius: 10,
  },
  traitementContainer: {
    display: "flex",
    marginHorizontal: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 30,
  },
  title2: {
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "normal",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
