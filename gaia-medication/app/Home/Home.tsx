import React, { useEffect, useState } from "react";
import { View,StyleSheet, Text, StatusBar, TextInput,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface IHomeProps {
  navigation: NavigationProp<ParamListBase>
}
export default function Home({navigation}:IHomeProps)  { 
  const [search, setSearch] = useState("");

  const updateSearch = (text : string) => {
    setSearch(text)
  };
  useEffect(() => {
    checkFirstConnection(navigation);
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.container}> 
      <View style={styles.header}>
        <Text style={styles.subtitle}>Welcome back</Text>
        <Text style={styles.title}>Alexandre</Text>
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
          <View style={styles.searchQR}>
            {/* <Image
              source={{ uri: "App/assets/images/Scan. png" }}
            /> */}
          </View>
        </View>
      </View>
      <View style={styles.traitementContainer}>
        <Text style={styles.title2}>Suivis d'un traitement</Text>
      </View>
    </SafeAreaView>
  );
}

const checkFirstConnection = async (navigation: NavigationProp<ParamListBase>) => {
  try {
    const isFirstConnection = await AsyncStorage.getItem('firstConnection');
    if (isFirstConnection === null) {
      await AsyncStorage.setItem('tutoCompleted', 'false');
      // L'utilisateur se connecte pour la première fois
      // TODO: affiche la page de creation de profil + condition pour savoir si il y a un profil
      alert('Première connexion')
      
      // -> mettre ca une fois le premier profil crée : await AsyncStorage.setItem('firstConnection', 'true');
      navigation.navigate('CreateProfile')
    } else {
      // L'utilisateur s'est déjà connecté
      alert('Tout est bon mon con') 
      
    }
  } catch (error) {
    console.error('Error while reading/writing AsyncStorage', error);
  }
};

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
  searchBarInput: {
    display: "flex",
    flex:1,
    color:"#9CDE00",
    fontSize:16
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