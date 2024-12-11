import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../../style/style";

// COMPOSANT BOUTTON PERSONNALISER
const GaiaButtonA = ({ title, onPress, disabled=false }) => {
  return (
    <TouchableOpacity
      className={`${disabled ? "bg-grey-300" : "bg-green-100"}`}
      onPress={disabled ? null : onPress}
      style={[ styles.button ]}
    >
      <Text className={`text-button font-bold ${disabled ? "text-grey-200" : "text-black"} ${disabled ? "dark:text-grey-200" : "dark:text-white" } uppercase`} >{title}</Text>
    </TouchableOpacity>
  );
};

export default GaiaButtonA;
