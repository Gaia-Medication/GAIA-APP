import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../../../style/style";

// COMPOSANT BOUTTON PERSONNALISER
const GaiaButtonA = ({ title, onPress, disabled=false, width=null }) => {
  return (
    <TouchableOpacity
      className={`${disabled ? "bg-grey-300" : "bg-green-100"} flex-row justify-center items-center`}
      onPress={disabled ? null : onPress}
      style={[styles.button,{ width: width } ]}
    >
      <Text className={`text-button align-center font-bold ${disabled ? "text-grey-200" : "text-black"} ${disabled ? "dark:text-grey-200" : "dark:text-white" }`} >{title}</Text>
    </TouchableOpacity>
  );
};

export default GaiaButtonA;
