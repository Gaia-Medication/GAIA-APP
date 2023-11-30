import React, { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from "react-native-date-picker";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Input } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, NavigationProp, ParamListBase } from "@react-navigation/native";
import { addItemToList } from "../../dao/Storage";

interface ICreateProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function CreateProfile({ navigation }: ICreateProps) {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isValidFirstname, setIsValidFirstname] = useState(true);
  const [isValidLastname, setIsValidLastname] = useState(true);

  //TODO: ajouté un input birthdate 
  const isFormEmpty = !firstname || !lastname || !gender;

  const validateFirstname = () => {
    setIsValidFirstname(firstname.length >= 2);
  };

  const validateLastname = () => {
    setIsValidLastname(lastname.length >= 2);
  };

  useEffect(() => {
      console.log("Nav on CreationProfile Page")

      //Empecher le redirection, on reste sur la page creation de profile tant qu'il y a 0 Users -> a finir 
      navigation.addListener('beforeRemove', (e) => {
        e.preventDefault();
        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure to discard them and leave the screen?',
          [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      })
  },[]); 

  const handleSumbit = async () => {
    if (!isValidFirstname || !isValidLastname || isFormEmpty) {
      console.log(`error not valid`);
    } else {
      try {
        const user: User = {
          id:1,
          firstname,
          lastname,
          birthdate,
          gender,
          preference,
        };
        console.log(user);

        await addItemToList("users",user)
        await AsyncStorage.setItem("currentUser", user.firstname);
        navigation.navigate('Home');
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Prenom"
        placeholder="Entrez votre prenom"
        leftIcon={{ type: "font-awesome", name: "user" }}
        onChangeText={(text) => setFirstname(text)}
        onBlur={validateFirstname}
        value={firstname}
        renderErrorMessage={isValidFirstname}
      />
      {!isValidFirstname && (
        <Text style={styles.errorText}>Le prénom doit comporter au moins 1 caractères.</Text>
      )}

      <Input
        label="Nom"
        placeholder="Entrez votre nom"
        leftIcon={{ type: "font-awesome", name: "user" }}
        onChangeText={(text) => setLastname(text)}
        onBlur={validateLastname}
        value={lastname}
        renderErrorMessage={isValidLastname}
      />
      {!isValidLastname && (
        <Text style={styles.errorText}>Le nom doit comporter au moins 1 caractères.</Text>
      )}

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

      <Button
        title="Enregistrer le profil"
        onPress={handleSumbit}
        disabled={isFormEmpty}
      />
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
