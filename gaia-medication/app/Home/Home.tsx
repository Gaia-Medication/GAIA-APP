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
  type User = {
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: string;
    preference: string;
  };

  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const eventHandler = async () => {
      //const isTutoComplete = await AsyncStorage.getItem("tutoComplete");
      const isConnected = await AsyncStorage.getItem("users");
      if (isConnected === null) {
        //await AsyncStorage.setItem('tutoCompleted', 'false');
        // L'utilisateur se connecte pour la première fois
        // TODO: affiche la page de creation de profil + condition pour savoir si il y a un profil
        alert("Première connexion");

        // -> mettre ca une fois le premier profil crée : await AsyncStorage.setItem('firstConnection', 'true');
        navigation.navigate("CreateProfile");
        
      } /*else if(isTutoComplete === null){
        alert("Va falloir faire le tuto bro");
  
      }*/else{
        // AsyncStorage.getItem("users").then((userData) => {
        //   if (userData) {
        //     // Conversion de la chaîne JSON en objet JavaScript
        //     const getUser = JSON.parse(userData);
        //     setUser(getUser)
        //     console.log('Données utilisateur récupérées avec succès', user);
        //   } else {
        //     console.log('Aucune donnée utilisateur trouvée');
        //   }
        // })
        // .catch((error) => {
        //   console.error('Erreur lors de la récupération des données utilisateur', error);
        // });
        setUser(JSON.parse(isConnected));
      }
  };

  const updateSearch = (text: string) => {
    setSearch(text);
  };

  // Utilisez useEffect pour appeler la fonction lors de la montée du composant
  useEffect(() => {
    if(isFocused){ 
      eventHandler();
      console.log("EXEC")
    }
  },[isFocused]); // Le tableau de dépendances est vide pour exécuter cela une seule fois à la montée du composant
  

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
          <Button
            title="CLEAR USERS DATA"
            onPress={() => AsyncStorage.removeItem("users")}
          />
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
