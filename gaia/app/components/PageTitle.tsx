import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { styles } from "../../style/style";

// COMPOSANT Titre de Page
const PageTitle = ({ title }) => {
  return (
    <View>
        <Text className="color-green-100 text-title font-medium">{title}</Text>
    </View>
  );
};

export default PageTitle;
