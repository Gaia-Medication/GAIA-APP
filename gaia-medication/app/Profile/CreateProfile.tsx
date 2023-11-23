import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from 'react-native-date-picker'
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Input } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateProfile() {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState("");
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const handleSumbit = () => {
    console.log(`Nom: ${lastname}`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Input
        label="Prenom"
        placeholder="Entrez votre prenom"
        leftIcon={{ type: "font-awesome", name: "user" }}
        onChangeText={(text) => setLastname(text)}
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
    </SafeAreaView>
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