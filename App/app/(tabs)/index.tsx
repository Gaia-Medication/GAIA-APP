import { StyleSheet } from "react-native";
import React, { useEffect, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { Text, View } from "../../components/Themed";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Vérifie si l'utilisateur s'est déjà connecté
const checkFirstConnection = async () => {
  try {
    const isFirstConnection = await AsyncStorage.getItem('firstConnection');
    await AsyncStorage.setItem('tutoCompleted', 'false');
    if (isFirstConnection === null) {
      // L'utilisateur se connecte pour la première fois
      // TODO: affiche la page de creation de profil + condition pour savoir si il y a un profil
      alert('Première connexion')
      
      // On enregistre que l'utilisateur s'est déjà connecté
      await AsyncStorage.setItem('firstConnection', 'true');
    } else {
      // L'utilisateur s'est déjà connecté
      // TODO: Affiche la page d'acceuil ou de selection de profil
      alert('Tu t déjà connecté toi')
    }
  } catch (error) {
    console.error('Error while reading/writing AsyncStorage', error);
  }
};

export default function TabOneScreen() {
  useEffect(() => {
    checkFirstConnection();
  }, []);
  
  const [search, setSearch] = useState("");

  const updateSearch = (text: string) => {
    setSearch(text)
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Welcome back</Text>
        <Text style={styles.title}>Alexandre</Text>
      </View>
      <View style={styles.searchContainer}>
        <Text style={styles.title2}>Recherche d’un médicament</Text>
        <View style={styles.searchBarwQR}>  
          <View style={styles.searchBar}>
            <SearchBar
              placeholder="Doliprane, Aspirine ..."
              onChangeText={updateSearch}
              value={search}
            />
          </View>
          <View style={styles.searchQR}>
          </View>
        </View>
      </View>
      <View style={styles.traitementContainer}>
        <Text style={styles.title2}>Suivis d'un traitement</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height:"100%",
    gap:20,
  },
  header: {
    paddingTop:20,
    display: "flex",
    alignItems: "center",
  },
  searchContainer: {
    display: "flex",
    gap:10,
    marginHorizontal:25,
  },
  searchBarwQR: {
    display: "flex",
    gap:19,
    marginHorizontal:10,
    flexDirection:"row",
    height:50
  },
  searchBar: {
    display: "flex",
    flex:1,
    backgroundColor:"#A0DB3050",
    borderRadius:10,
  },
  searchQR: {
    width:50,
    display: "flex",
    backgroundColor:"#A0DB3050",
    borderRadius:10,
  },
  traitementContainer: {
    display: "flex",
    marginHorizontal:25,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    lineHeight:30,
  },
  title2: {
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: '#888888',
    fontWeight: "normal",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
