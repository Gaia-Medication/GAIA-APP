import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../../style/style";

// COMPOSANT BOUTTON PERSONNALISER
const ButtonB = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button
      ]}
      className="w-90 bg-grey-100 border-green-100 border-2 mb-3"
    >
      <Text className="text-button font-bold text-green-100 uppercase" >{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonB;
