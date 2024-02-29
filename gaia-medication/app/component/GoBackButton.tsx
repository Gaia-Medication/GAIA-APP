import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "react-native-feather";

// COMPOSANT BOUTON POUR RETOUR EN ARRIERE DES PAGES
const GoBackButton = ({ navigation }) => {
  return (
      <ArrowLeft height={30} width={30} color={"#4296E4"} 
      onPress={() => navigation.goBack()}/>
  );
};

export default GoBackButton;