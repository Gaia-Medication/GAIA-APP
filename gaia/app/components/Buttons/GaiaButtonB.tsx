import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../../../style/style";

// COMPOSANT BOUTTON PERSONNALISER
const GaiaButtonB = ({ title, onPress, disabled=false, width=null, margin=null }) => {
  return (
    <TouchableOpacity
      className={`${disabled ? "bg-grey-300" : "bg-green-200"} ${margin}`}
      onPress={disabled ? null : onPress}
      style={[styles.button,{ width: width } ]}
    >
      <Text className={`text-button font-bold ${disabled ? "text-grey-200" : "text-black"} ${disabled ? "dark:text-grey-200" : "dark:text-green-100" }`} >{title}</Text>
    </TouchableOpacity>
  );
};

export default GaiaButtonB;
