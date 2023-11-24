import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from 'react-native-date-picker'
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Input } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Link, NavigationProp, ParamListBase} from '@react-navigation/native';


interface ICreateProps {
  navigation: NavigationProp<ParamListBase>
}

export default function CreateProfile({navigation}:ICreateProps) {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState("");
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const handleSumbit = () => {
    console.log(`Nom: ${lastname}`);
    type User = {
      firstname: string,
      lastname: string,
      birthdate: string,
      gender: string,
      preference: string
    };
    try {
      const user: User = {
        firstname,
        lastname,
        birthdate,
        gender,
        preference
      };
      
      // Convert the user object to JSON
      const userJSON = JSON.stringify(user);
      console.log(user);
      AsyncStorage.setItem("users", userJSON);
      AsyncStorage.setItem("firstConnection", "true"); 
      navigation.goBack();
    } catch (e){
      console.log(e);
    }
    
  };

  return (
    <View style={styles.container}>
      <Input
        label="Prenom"
        placeholder="Entrez votre prenom"
        leftIcon={{ type: "font-awesome", name: "user" }}
        onChangeText={(text) => setFirstname(text)}
        value={firstname}
      />

      <Input
        label="Nom"
        placeholder="Entrez votre nom"
        leftIcon={{ type: "font-awesome", name: "user" }}
        onChangeText={(text) => setLastname(text)}
        value={lastname}
      />

      <Input
        label="Preference/Allergies"
        placeholder="Preference/Allergies"
        leftIcon={{ type: "font-awesome", name: "heart" }}
        onChangeText={(text) => setPreference(text)}
        value={preference}
      />

      <RNPickerSelect
        placeholder={{ label: "Sélectionner le genre", value: "" }}
        onValueChange={(value) => setGender(value)}
        items={[
          { label: "Masculin", value: "male" },
          { label: "Feminin", value: "female" },
          { label: "Autre", value: "other" },
        ]}
      />

      <Button title="Enregistrer le profil" onPress={handleSumbit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    //width: "25%",
    display: "flex",
    gap: 5,
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