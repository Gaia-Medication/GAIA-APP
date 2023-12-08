import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings({ navigation: Navigation }) {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Settings Page");
    }
  }, [isFocused]);
  return (
    <View>
      <Text>Settings</Text>
      <Button
        title="CLEAR USERS DATA"
        onPress={() =>( AsyncStorage.removeItem("users"),AsyncStorage.removeItem("stock"))}
      />
      <Button
        title="CLEAR STOCK DATA"
        onPress={() =>( AsyncStorage.removeItem("stock"))}
      />
      <Button
        title="ADD PROFILE"
        onPress={() => Navigation.navigate("CreateProfile")}
      ></Button>
    </View>
  );
}
