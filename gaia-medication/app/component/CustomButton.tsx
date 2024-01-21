import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../../style/style";

// COMPOSANT BOUTTON PERSONNALISER
const CustomButton = ({ title, onPress, disabled, color }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? "#F1F1F1" : color,
          borderColor: disabled ? "#dddddd" : color,
        },
      ]}
      disabled={disabled}
    >
      <Text className=" text-l font-normal" style={{ color: disabled ? "#b0b0b0" : "white" }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
