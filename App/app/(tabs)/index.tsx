import { StyleSheet } from "react-native";
import React, { useEffect } from 'react';

import { Text, View } from "../../components/Themed";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Vérifie si l'utilisateur s'est déjà connecté
const checkFirstConnection = async () => {
  try {
    const isFirstConnection = await AsyncStorage.getItem('firstConnection');
    await AsyncStorage.setItem('tutoCompleted', 'false');
    const 
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherche</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
