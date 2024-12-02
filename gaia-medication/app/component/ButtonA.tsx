import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../../style/style";

// COMPOSANT BOUTTON PERSONNALISER
const ButtonA = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button
      ]}
      className="bg-green-100 mb-3"
    >
      <Text className="text-button font-bold text-black dark:text-white uppercase" >{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonA;
