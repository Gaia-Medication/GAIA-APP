import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { styles } from "../../style/style";

// COMPOSANT Titre de Page
const PageSubtitle = ({ subtitle, className }) => {
  return (
    <View className={className}>
        <Text className="color-grey-200 text-2xl font-medium">{subtitle}</Text>
    </View>
  );
};

export default PageSubtitle;
