import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { getUserByID } from "../../../data/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Journal({ navigation }) {
  const isFocused = useIsFocused();
  const [user, setUser] = useState<User | null>(null);

  const init = async () => {
    const currentId = JSON.parse(await AsyncStorage.getItem("currentUser"));
    const current = await getUserByID(JSON.parse(currentId));
    setUser(current);
  };
  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Journal Page");
      init();
    }
  }, [isFocused]);

  return (
    <SafeAreaView className=" flex bg-white w-full h-full dark:bg-[#131f24]">
    </SafeAreaView>
  );
}
